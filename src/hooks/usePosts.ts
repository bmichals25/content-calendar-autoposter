import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Post, PostWithSchedules, PostSchedule, Platform, PostStatus } from '@/lib/types';

export function usePosts() {
  const [posts, setPosts] = useState<PostWithSchedules[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        post_schedules (*)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPosts(data as PostWithSchedules[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const createPost = async (post: {
    title: string;
    content: string;
    media_urls?: string[];
    status?: PostStatus;
    platforms: Platform[];
    scheduled_at?: string;
    social_account_ids: Record<Platform, string>;
  }) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return { error: new Error('Not authenticated') };

    const { data: newPost, error: postError } = await supabase
      .from('posts')
      .insert({
        user_id: user.user.id,
        title: post.title,
        content: post.content,
        media_urls: post.media_urls || [],
        status: post.scheduled_at ? 'scheduled' : (post.status || 'draft'),
      })
      .select()
      .single();

    if (postError || !newPost) return { error: postError };

    if (post.platforms.length > 0 && post.scheduled_at) {
      const schedules = post.platforms.map((platform) => ({
        post_id: newPost.id,
        social_account_id: post.social_account_ids[platform],
        platform,
        scheduled_at: post.scheduled_at,
        status: 'scheduled' as PostStatus,
      }));

      const { error: scheduleError } = await supabase
        .from('post_schedules')
        .insert(schedules);

      if (scheduleError) return { error: scheduleError };
    }

    await fetchPosts();
    return { data: newPost, error: null };
  };

  const updatePost = async (id: string, updates: Partial<Post>) => {
    const { error } = await supabase
      .from('posts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (!error) await fetchPosts();
    return { error };
  };

  const deletePost = async (id: string) => {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (!error) await fetchPosts();
    return { error };
  };

  return { posts, loading, fetchPosts, createPost, updatePost, deletePost };
}

export function useSocialAccounts() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('is_active', true);

    if (!error && data) setAccounts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return { accounts, loading, fetchAccounts };
}

import { CalendarView } from '@/components/Calendar';
import { usePosts } from '@/hooks/usePosts';
import { Layout } from '@/components/Layout';
import { Loader2 } from 'lucide-react';

export function DashboardPage() {
  const { posts, loading, deletePost } = usePosts();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      await deletePost(id);
    }
  };

  return (
    <Layout>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : (
        <CalendarView posts={posts} onDeletePost={handleDelete} />
      )}
    </Layout>
  );
}

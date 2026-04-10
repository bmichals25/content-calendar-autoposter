export type Platform = 'twitter' | 'linkedin' | 'facebook' | 'instagram';

export type PostStatus = 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed';

export interface SocialAccount {
  id: string;
  user_id: string;
  platform: Platform;
  platform_user_id: string;
  platform_username: string;
  access_token: string;
  refresh_token: string | null;
  token_expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  media_urls: string[];
  status: PostStatus;
  created_at: string;
  updated_at: string;
}

export interface PostSchedule {
  id: string;
  post_id: string;
  social_account_id: string;
  platform: Platform;
  scheduled_at: string;
  status: PostStatus;
  published_at: string | null;
  platform_post_id: string | null;
  error_message: string | null;
  created_at: string;
}

export interface PostWithSchedules extends Post {
  post_schedules: PostSchedule[];
}

export interface PostAnalytics {
  id: string;
  post_schedule_id: string;
  likes: number;
  shares: number;
  comments: number;
  impressions: number;
  clicks: number;
  fetched_at: string;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  posts: PostWithSchedules[];
}

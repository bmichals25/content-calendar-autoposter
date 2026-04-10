import { Layout } from '@/components/Layout';
import { usePosts } from '@/hooks/usePosts';
import { BarChart3, TrendingUp, Eye, Heart, MessageCircle, Share2, Loader2 } from 'lucide-react';
import { PlatformBadge } from '@/components/PlatformBadge';
import { StatusBadge } from '@/components/StatusBadge';
import { format } from 'date-fns';

export function AnalyticsPage() {
  const { posts, loading } = usePosts();
  const totalPosts = posts.length;
  const publishedPosts = posts.filter((p) => p.status === 'published').length;
  const scheduledPosts = posts.filter((p) => p.status === 'scheduled').length;
  const draftPosts = posts.filter((p) => p.status === 'draft').length;
  const allSchedules = posts.flatMap((p) => p.post_schedules || []);
  const platformCounts = allSchedules.reduce(
    (acc, s) => ({ ...acc, [s.platform]: (acc[s.platform] || 0) + 1 }),
    {} as Record<string, number>
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <BarChart3 className="w-7 h-7 text-indigo-400" />
              Analytics
            </h1>
            <p className="text-gray-500 mt-1">Track your content performance across platforms</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Posts', value: totalPosts, icon: BarChart3, color: 'text-indigo-400' },
                { label: 'Published', value: publishedPosts, icon: TrendingUp, color: 'text-emerald-400' },
                { label: 'Scheduled', value: scheduledPosts, icon: Eye, color: 'text-amber-400' },
                { label: 'Drafts', value: draftPosts, icon: Heart, color: 'text-gray-400' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="card">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className={`w-5 h-5 ${color}`} />
                    <span className="text-sm text-gray-400">{label}</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="card">
                <h3 className="text-sm font-medium text-gray-400 mb-4">Posts by Platform</h3>
                <div className="space-y-3">
                  {Object.entries(platformCounts).map(([platform, count]) => (
                    <div key={platform} className="flex items-center justify-between">
                      <PlatformBadge platform={platform as any} showLabel size="md" />
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(count / Math.max(...Object.values(platformCounts))) * 100}%` }} />
                        </div>
                        <span className="text-sm text-white font-medium w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                  {Object.keys(platformCounts).length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No platform data yet</p>
                  )}
                </div>
              </div>

              <div className="card">
                <h3 className="text-sm font-medium text-gray-400 mb-4">Engagement Overview</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Heart, label: 'Likes', value: '—' },
                    { icon: MessageCircle, label: 'Comments', value: '—' },
                    { icon: Share2, label: 'Shares', value: '—' },
                    { icon: Eye, label: 'Impressions', value: '—' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="bg-gray-800 rounded-lg p-4 text-center">
                      <Icon className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                      <p className="text-lg font-bold text-white">{value}</p>
                      <p className="text-xs text-gray-500">{label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-3 text-center">Connect social accounts to see real analytics</p>
              </div>
            </div>

            <div className="card">
              <h3 className="text-sm font-medium text-gray-400 mb-4">Recent Posts</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left text-xs font-medium text-gray-500 pb-3">Title</th>
                      <th className="text-left text-xs font-medium text-gray-500 pb-3">Platforms</th>
                      <th className="text-left text-xs font-medium text-gray-500 pb-3">Status</th>
                      <th className="text-left text-xs font-medium text-gray-500 pb-3">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {posts.slice(0, 10).map((post) => (
                      <tr key={post.id} className="hover:bg-gray-800/50">
                        <td className="py-3 text-sm text-white">{post.title}</td>
                        <td className="py-3"><div className="flex gap-1">{post.post_schedules?.map((s) => (<PlatformBadge key={s.id} platform={s.platform} />))}</div></td>
                        <td className="py-3"><StatusBadge status={post.status} /></td>
                        <td className="py-3 text-sm text-gray-500">{format(new Date(post.created_at), 'MMM d')}</td>
                      </tr>
                    ))}
                    {posts.length === 0 && <tr><td colSpan={4} className="text-center py-8 text-gray-500 text-sm">No posts yet. Create your first post!</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

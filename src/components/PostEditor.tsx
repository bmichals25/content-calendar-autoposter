import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Clock, Save, Image, Sparkles } from 'lucide-react';
import { Platform } from '@/lib/types';
import { PLATFORM_CONFIG } from '@/lib/constants';
import { usePosts, useSocialAccounts } from '@/hooks/usePosts';

const PLATFORMS: Platform[] = ['twitter', 'linkedin', 'facebook', 'instagram'];

const CHARACTER_LIMITS: Record<Platform, number> = {
  twitter: 280,
  linkedin: 3000,
  facebook: 63206,
  instagram: 2200,
};

export function PostEditor() {
  const navigate = useNavigate();
  const { createPost } = usePosts();
  const { accounts } = useSocialAccounts();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [scheduledAt, setScheduledAt] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const contentWarnings = selectedPlatforms
    .filter((p) => content.length > CHARACTER_LIMITS[p])
    .map((p) => `${PLATFORM_CONFIG[p].label}: ${content.length}/${CHARACTER_LIMITS[p]} chars`);

  const handleSave = async (asDraft: boolean) => {
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }
    setSaving(true);
    setError('');
    const socialAccountIds: Record<Platform, string> = {} as any;
    selectedPlatforms.forEach((platform) => {
      const account = accounts.find((a) => a.platform === platform);
      if (account) socialAccountIds[platform] = account.id;
    });
    const { error: saveError } = await createPost({
      title: title.trim(),
      content: content.trim(),
      status: asDraft ? 'draft' : 'scheduled',
      platforms: selectedPlatforms,
      scheduled_at: asDraft ? undefined : scheduledAt || undefined,
      social_account_ids: socialAccountIds,
    });
    setSaving(false);
    if (saveError) { setError(saveError.message); } else { navigate('/'); }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Create Post</h1>
          <p className="text-gray-500 mt-1">Compose content and schedule it across platforms</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give your post a title…" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Content</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your post content here…" rows={8} className="input-field resize-none" />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">{content.length} characters</span>
              {contentWarnings.length > 0 && <div className="text-xs text-amber-400">⚠ Over limit: {contentWarnings.join(', ')}</div>}
            </div>
          </div>
          <div className="border-2 border-dashed border-gray-800 rounded-xl p-8 text-center hover:border-gray-700 transition-colors cursor-pointer">
            <Image className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Drop images or click to upload</p>
            <p className="text-xs text-gray-600 mt-1">PNG, JPG, GIF up to 10MB</p>
          </div>
          {content && (
            <div className="card">
              <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4" /> Preview</h4>
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-white text-sm whitespace-pre-wrap">{content}</p>
              </div>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Platforms</h3>
            <div className="space-y-2">
              {PLATFORMS.map((platform) => {
                const config = PLATFORM_CONFIG[platform];
                const isSelected = selectedPlatforms.includes(platform);
                const hasAccount = accounts.some((a) => a.platform === platform);
                return (
                  <button key={platform} onClick={() => togglePlatform(platform)} disabled={!hasAccount}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${isSelected ? `${config.bgColor} ${config.color}` : hasAccount ? 'border-gray-800 text-gray-400 hover:border-gray-700' : 'border-gray-800/50 text-gray-600 cursor-not-allowed'}`}>
                    <span className="text-lg font-bold w-6 text-center">{config.icon}</span>
                    <span className="text-sm font-medium">{config.label}</span>
                    {!hasAccount && <span className="text-xs text-gray-600 ml-auto">Not connected</span>}
                  </button>
                );
              })}
            </div>
            {accounts.length === 0 && <p className="text-xs text-gray-500 mt-3">Connect accounts in{' '}<button onClick={() => navigate('/settings')} className="text-indigo-400 hover:underline">Settings</button></p>}
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Schedule</h3>
            <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="input-field text-sm" />
          </div>
          <div className="space-y-2">
            {error && <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-3 text-sm text-red-400">{error}</div>}
            <button onClick={() => handleSave(false)} disabled={saving || !selectedPlatforms.length || !scheduledAt} className="btn-primary w-full flex items-center justify-center gap-2">
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Clock className="w-4 h-4" />Schedule Post</>}
            </button>
            <button onClick={() => handleSave(true)} disabled={saving} className="btn-secondary w-full flex items-center justify-center gap-2"><Save className="w-4 h-4" />Save as Draft</button>
            <button disabled={saving || !selectedPlatforms.length} className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"><Send className="w-4 h-4" />Publish Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

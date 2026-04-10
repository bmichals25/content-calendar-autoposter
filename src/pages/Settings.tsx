import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useSocialAccounts } from '@/hooks/usePosts';
import { useAuth } from '@/hooks/useAuth';
import { Settings, Link2, Unlink, ExternalLink, Shield, Bell, Loader2 } from 'lucide-react';
import { Platform } from '@/lib/types';
import { PLATFORM_CONFIG } from '@/lib/constants';
import { supabase } from '@/lib/supabase';

const PLATFORMS: Platform[] = ['twitter', 'linkedin', 'facebook', 'instagram'];

const OAUTH_DOCS: Record<Platform, string> = {
  twitter: 'https://developer.twitter.com/en/docs/authentication/oauth-2-0',
  linkedin: 'https://learn.microsoft.com/en-us/linkedin/shared/authentication/',
  facebook: 'https://developers.facebook.com/docs/facebook-login/',
  instagram: 'https://developers.facebook.com/docs/instagram-api/getting-started',
};

export function SettingsPage() {
  const { accounts, loading, fetchAccounts } = useSocialAccounts();
  const { user } = useAuth();
  const [connecting, setConnecting] = useState<Platform | null>(null);

  const handleConnect = async (platform: Platform) => {
    setConnecting(platform);
    const { error } = await supabase.from('social_accounts').insert({
      user_id: user?.id,
      platform,
      platform_user_id: `demo_${platform}_${Date.now()}`,
      platform_username: `@demo_${platform}`,
      access_token: 'placeholder_token',
      is_active: true,
    });
    if (!error) await fetchAccounts();
    setConnecting(null);
  };

  const handleDisconnect = async (accountId: string) => {
    if (!confirm('Disconnect this account?')) return;
    await supabase.from('social_accounts').update({ is_active: false }).eq('id', accountId);
    await fetchAccounts();
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Settings className="w-7 h-7 text-indigo-400" />Settings
          </h1>
          <p className="text-gray-500 mt-1">Manage your social accounts and preferences</p>
        </div>

        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-white mb-1">Social Accounts</h2>
          <p className="text-sm text-gray-500 mb-6">Connect your social media accounts to enable auto-posting</p>
          {loading ? (
            <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 text-indigo-500 animate-spin" /></div>
          ) : (
            <div className="space-y-3">
              {PLATFORMS.map((platform) => {
                const config = PLATFORM_CONFIG[platform];
                const account = accounts.find((a) => a.platform === platform);
                const isConnecting = connecting === platform;
                return (
                  <div key={platform} className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${account ? config.bgColor : 'border-gray-800 hover:border-gray-700'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold ${config.color} bg-gray-800`}>{config.icon}</div>
                      <div>
                        <p className="font-medium text-white">{config.label}</p>
                        {account ? <p className="text-sm text-gray-400">{account.platform_username}</p> : <p className="text-sm text-gray-500">Not connected</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {account ? (
                        <>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-emerald-400/10 text-emerald-400">Connected</span>
                          <button onClick={() => handleDisconnect(account.id)} className="p-2 text-gray-500 hover:text-red-400 transition-colors" title="Disconnect"><Unlink className="w-4 h-4" /></button>
                        </>
                      ) : (
                        <button onClick={() => handleConnect(platform)} disabled={isConnecting} className="btn-primary text-sm flex items-center gap-2">
                          {isConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}Connect
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
            <p className="text-xs text-gray-500">💡 In production, connecting accounts triggers an OAuth flow with each platform. API credentials are stored securely and encrypted at rest.</p>
          </div>
        </div>

        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2"><Bell className="w-5 h-5 text-indigo-400" />Posting Preferences</h2>
          <p className="text-sm text-gray-500 mb-6">Configure autonomous posting behavior</p>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-gray-800 rounded-xl cursor-pointer">
              <div><p className="text-sm font-medium text-white">Auto-retry failed posts</p><p className="text-xs text-gray-500">Automatically retry posting if it fails</p></div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-600" />
            </label>
            <label className="flex items-center justify-between p-4 bg-gray-800 rounded-xl cursor-pointer">
              <div><p className="text-sm font-medium text-white">Email notifications</p><p className="text-xs text-gray-500">Get notified when posts are published or fail</p></div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-600" />
            </label>
            <label className="flex items-center justify-between p-4 bg-gray-800 rounded-xl cursor-pointer">
              <div><p className="text-sm font-medium text-white">Optimal timing</p><p className="text-xs text-gray-500">Let AI pick the best time to post</p></div>
              <input type="checkbox" className="w-4 h-4 accent-indigo-600" />
            </label>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2"><Shield className="w-5 h-5 text-indigo-400" />Developer API Setup</h2>
          <p className="text-sm text-gray-500 mb-4">To enable real auto-posting, configure API keys for each platform</p>
          <div className="space-y-2">
            {PLATFORMS.map((platform) => (
              <a key={platform} href={OAUTH_DOCS[platform]} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                <span className={`font-bold ${PLATFORM_CONFIG[platform].color}`}>{PLATFORM_CONFIG[platform].icon}</span>
                <span className="text-sm text-gray-300">{PLATFORM_CONFIG[platform].label} API Docs</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-500 ml-auto" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

import { Platform } from './types';

export const PLATFORM_CONFIG: Record<Platform, { label: string; color: string; bgColor: string; icon: string }> = {
  twitter: {
    label: 'Twitter / X',
    color: 'text-sky-400',
    bgColor: 'bg-sky-400/10 border-sky-400/20',
    icon: '𝕏',
  },
  linkedin: {
    label: 'LinkedIn',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10 border-blue-500/20',
    icon: 'in',
  },
  facebook: {
    label: 'Facebook',
    color: 'text-blue-600',
    bgColor: 'bg-blue-600/10 border-blue-600/20',
    icon: 'f',
  },
  instagram: {
    label: 'Instagram',
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10 border-pink-500/20',
    icon: '📷',
  },
};

export const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  draft: { label: 'Draft', color: 'text-gray-400', bgColor: 'bg-gray-400/10' },
  scheduled: { label: 'Scheduled', color: 'text-amber-400', bgColor: 'bg-amber-400/10' },
  publishing: { label: 'Publishing…', color: 'text-blue-400', bgColor: 'bg-blue-400/10' },
  published: { label: 'Published', color: 'text-emerald-400', bgColor: 'bg-emerald-400/10' },
  failed: { label: 'Failed', color: 'text-red-400', bgColor: 'bg-red-400/10' },
};

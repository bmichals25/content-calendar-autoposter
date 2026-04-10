import { Platform } from '@/lib/types';
import { PLATFORM_CONFIG } from '@/lib/constants';

interface PlatformBadgeProps {
  platform: Platform;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export function PlatformBadge({ platform, size = 'sm', showLabel = false }: PlatformBadgeProps) {
  const config = PLATFORM_CONFIG[platform];

  return (
    <span
      className={`inline-flex items-center gap-1.5 border rounded-full font-medium ${config.bgColor} ${config.color} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      <span className="font-bold">{config.icon}</span>
      {showLabel && config.label}
    </span>
  );
}

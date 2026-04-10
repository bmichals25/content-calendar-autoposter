import { PostStatus } from '@/lib/types';
import { STATUS_CONFIG } from '@/lib/constants';

export function StatusBadge({ status }: { status: PostStatus }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
      {config.label}
    </span>
  );
}

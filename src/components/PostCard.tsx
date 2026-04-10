import { format } from 'date-fns';
import { Clock, Trash2, Edit3 } from 'lucide-react';
import { PostWithSchedules } from '@/lib/types';
import { PlatformBadge } from './PlatformBadge';
import { StatusBadge } from './StatusBadge';

interface PostCardProps {
  post: PostWithSchedules;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  compact?: boolean;
}

export function PostCard({ post, onDelete, onEdit, compact = false }: PostCardProps) {
  const nextSchedule = post.post_schedules
    ?.filter((s) => s.status === 'scheduled')
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())[0];

  if (compact) {
    return (
      <div className="group p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 transition-all cursor-pointer text-left w-full">
        <p className="text-xs text-white font-medium truncate">{post.title}</p>
        <div className="flex items-center gap-1 mt-1">
          {post.post_schedules?.map((s) => (
            <PlatformBadge key={s.id} platform={s.platform} size="sm" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card hover:border-gray-700 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold truncate">{post.title}</h3>
          <p className="text-gray-400 text-sm mt-1 line-clamp-2">{post.content}</p>
        </div>
        <StatusBadge status={post.status} />
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {post.post_schedules?.map((schedule) => (
          <PlatformBadge key={schedule.id} platform={schedule.platform} showLabel />
        ))}
      </div>

      {nextSchedule && (
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Clock className="w-3.5 h-3.5" />
          <span>
            Scheduled for {format(new Date(nextSchedule.scheduled_at), 'MMM d, yyyy \'at\' h:mm a')}
          </span>
        </div>
      )}

      <div className="flex items-center gap-2 pt-3 border-t border-gray-800">
        <button
          onClick={() => onEdit(post.id)}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
          Edit
        </button>
        <button
          onClick={() => onDelete(post.id)}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition-colors ml-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
}

import { useState, useMemo } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  parseISO,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { PostWithSchedules, CalendarDay } from '@/lib/types';
import { PostCard } from './PostCard';
import { useNavigate } from 'react-router-dom';

interface CalendarProps {
  posts: PostWithSchedules[];
  onDeletePost: (id: string) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarView({ posts, onDeletePost }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const navigate = useNavigate();

  const calendarDays: CalendarDay[] = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart);
    const calEnd = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: calStart, end: calEnd });

    return days.map((date) => {
      const dayPosts = posts.filter((post) => {
        const schedules = post.post_schedules || [];
        return schedules.some((s) => isSameDay(parseISO(s.scheduled_at), date));
      });

      return {
        date,
        isCurrentMonth: isSameMonth(date, currentMonth),
        isToday: isToday(date),
        posts: dayPosts,
      };
    });
  }, [currentMonth, posts]);

  const selectedDayPosts = selectedDay
    ? calendarDays.find((d) => isSameDay(d.date, selectedDay))?.posts || []
    : [];

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
              className="btn-secondary !p-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="btn-secondary !py-1.5 text-xs"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
              className="btn-secondary !p-2"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {WEEKDAYS.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-800 rounded-xl overflow-hidden border border-gray-800">
          {calendarDays.map((day, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDay(day.date)}
              className={`min-h-[100px] p-2 text-left transition-colors ${
                day.isCurrentMonth ? 'bg-gray-900' : 'bg-gray-950'
              } ${
                selectedDay && isSameDay(day.date, selectedDay)
                  ? 'ring-2 ring-indigo-500 ring-inset'
                  : 'hover:bg-gray-800/50'
              }`}
            >
              <span
                className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium ${
                  day.isToday
                    ? 'bg-indigo-600 text-white'
                    : day.isCurrentMonth
                    ? 'text-gray-300'
                    : 'text-gray-600'
                }`}
              >
                {format(day.date, 'd')}
              </span>
              <div className="mt-1 space-y-1">
                {day.posts.slice(0, 2).map((post) => (
                  <PostCard key={post.id} post={post} onDelete={onDeletePost} onEdit={() => {}} compact />
                ))}
                {day.posts.length > 2 && (
                  <p className="text-xs text-gray-500 px-1">+{day.posts.length - 2} more</p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="w-80 shrink-0">
        <div className="card sticky top-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">
              {selectedDay ? format(selectedDay, 'EEEE, MMM d') : 'Select a day'}
            </h3>
            <button onClick={() => navigate('/create')} className="btn-primary !p-2" title="New post">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {selectedDay ? (
            selectedDayPosts.length > 0 ? (
              <div className="space-y-3">
                {selectedDayPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onDelete={onDeletePost}
                    onEdit={(id) => navigate(`/edit/${id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No posts scheduled</p>
                <button
                  onClick={() => navigate('/create')}
                  className="btn-primary mt-3 text-sm"
                >
                  Create Post
                </button>
              </div>
            )
          ) : (
            <p className="text-gray-500 text-sm text-center py-8">
              Click a day to see scheduled posts
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

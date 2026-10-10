'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Trash2, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead, NotificationResponse } from '@/lib/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';

export default function NotificationsPage() {
  const [page, setPage] = useState(0);
  const size = 10;
  
  const { data: notificationsData, isLoading } = useNotifications(page, size);
  const markAsRead = useMarkNotificationRead();
  const markAllAsRead = useMarkAllNotificationsRead();
  const queryClient = useQueryClient();

  const notifications = notificationsData?.content || [];
  const totalPages = notificationsData?.totalPages || 0;

  const handleMarkAsRead = (id: number) => {
    markAsRead.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/notifications/${id}`);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch (error) {
      console.error('Failed to delete notification', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h1>
          <p className="text-slate-500 dark:text-slate-400">Stay updated on your account activity and earnings.</p>
        </div>
        
        {notifications.length > 0 && (
          <Button 
            onClick={handleMarkAllAsRead} 
            disabled={markAllAsRead.isPending}
            variant="outline"
            className="flex items-center gap-2"
          >
            <CheckCircle2 size={16} />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="h-20 w-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Bell className="h-10 w-10 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No notifications yet</h3>
            <p className="text-slate-500 max-w-sm mt-2">When you get commissions, payouts, or updates, they will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {notifications.map((notification: NotificationResponse) => (
              <div 
                key={notification.id} 
                className={cn(
                  "p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-colors",
                  !notification.isRead ? "bg-indigo-50/30 dark:bg-indigo-900/10" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                )}
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    {!notification.isRead && (
                      <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-600 flex-shrink-0" />
                    )}
                    <h4 className={cn(
                      "text-base font-semibold",
                      !notification.isRead ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"
                    )}>
                      {notification.title}
                    </h4>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 pl-4">
                    {notification.message}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 pl-4 pt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 pl-4 sm:pl-0">
                  {!notification.isRead && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleMarkAsRead(notification.id)}
                      disabled={markAsRead.isPending}
                      className="text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
                    >
                      Mark as read
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(notification.id)}
                    className="text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                    title="Delete notification"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Page {page + 1} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Bell, Check, Trash2, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useNotifications, useUnreadNotificationCount, useMarkNotificationRead, useMarkAllNotificationsRead, NotificationResponse } from '@/lib/hooks/useNotifications';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const { data: notificationsData, isLoading } = useNotifications(0, 10);
  
  const markAsRead = useMarkNotificationRead();
  const markAllAsRead = useMarkAllNotificationsRead();

  const notifications = notificationsData?.content || [];

  const handleMarkAsRead = (id: number) => {
    markAsRead.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 relative focus:outline-none">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white dark:border-slate-900">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 mr-4 mt-2" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              className="text-xs h-8 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
              disabled={markAllAsRead.isPending}
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <Bell className="h-10 w-10 text-slate-200 dark:text-slate-700 mb-3" />
              <p className="text-sm font-medium text-slate-900 dark:text-white">No notifications</p>
              <p className="text-xs text-slate-500 mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {notifications.map((notification: NotificationResponse) => (
                <div 
                  key={notification.id} 
                  className={cn(
                    "p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 flex gap-3",
                    !notification.isRead ? "bg-indigo-50/50 dark:bg-indigo-900/10" : ""
                  )}
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn(
                        "text-sm font-medium",
                        !notification.isRead ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"
                      )}>
                        {notification.title}
                      </p>
                      {!notification.isRead && (
                        <span className="flex h-2 w-2 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-1">
                      <span className="text-[10px] font-medium text-slate-400">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </span>
                      
                      {!notification.isRead && (
                        <button 
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-[10px] font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                          disabled={markAsRead.isPending}
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="p-2 border-t border-slate-100 dark:border-slate-800">
            <Button asChild variant="ghost" className="w-full text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white">
              <Link href="/dashboard/notifications" onClick={() => setIsOpen(false)}>
                View all notifications
              </Link>
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

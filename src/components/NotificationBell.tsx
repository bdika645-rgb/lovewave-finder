import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export function NotificationBell() {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'match':
        return '💕';
      case 'super_like':
        return '⭐';
      case 'like':
        return '❤️';
      case 'message':
        return '💬';
      default:
        return '🔔';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'match':
        return 'bg-primary/10';
      case 'super_like':
        return 'bg-secondary/10';
      case 'like':
        return 'bg-destructive/10';
      case 'message':
        return 'bg-accent';
      default:
        return 'bg-muted';
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={unreadCount > 0 ? `${unreadCount} התראות חדשות` : "התראות"}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
        >
          <Bell className="w-5 h-5" aria-hidden="true" />
          {unreadCount > 0 && (
            <span 
              className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center animate-pulse"
              aria-hidden="true"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" dir="rtl" role="dialog" aria-label="התראות">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-foreground" id="notifications-heading">התראות</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} aria-label="סמן את כל ההתראות כנקראו">
              סמן הכל כנקרא
            </Button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto" role="list" aria-labelledby="notifications-heading">
          {loading ? (
            <div className="p-4 space-y-3" role="status" aria-label="טוען התראות">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-1" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground" role="status">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" aria-hidden="true" />
              <p>אין התראות חדשות</p>
            </div>
          ) : (
            notifications.map(notification => (
              <Link
                key={notification.id}
                to={notification.type === 'match' || notification.type === 'like' || notification.type === 'super_like' 
                  ? `/member/${notification.profileId}` 
                  : '/messages'
                }
                onClick={() => {
                  markAsRead(notification.id);
                  setIsOpen(false);
                }}
                className={`flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors border-b last:border-b-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary ${
                  !notification.read ? 'bg-primary/5' : ''
                }`}
                role="listitem"
                aria-label={`${notification.title}: ${notification.message}`}
              >
                <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`} aria-hidden="true">
                  {notification.profileImage ? (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={notification.profileImage} alt="" />
                      <AvatarFallback>{notification.profileName?.[0]}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <span className="text-lg">{getTypeIcon(notification.type)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">
                    {notification.title}
                  </p>
                  <p className="text-muted-foreground text-xs mt-0.5 truncate">
                    {notification.message}
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), { 
                      addSuffix: true, 
                      locale: he 
                    })}
                  </p>
                </div>
                {!notification.read && (
                  <span className="w-2 h-2 bg-primary rounded-full mt-2" aria-label="לא נקראה" />
                )}
              </Link>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-3 border-t">
            <Link 
              to="/who-liked-me" 
              className="text-sm text-primary hover:underline block text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => setIsOpen(false)}
            >
              הצג את כל מי שאוהב אותי
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default NotificationBell;

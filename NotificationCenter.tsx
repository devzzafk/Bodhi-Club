import React from 'react';
import { NotificationItem } from '../types';
import { Bell, CheckCircle2, Sparkles, X, Clock, Calendar, Award } from 'lucide-react';

interface NotificationCenterProps {
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAllAsRead,
  onClose,
  onNavigate,
}) => {
  const requestPushPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('BODHI LBSITW Notifications Enabled!', {
            body: 'You will receive timely reminders for live quizzes, deadlines, and debate championships.',
          });
        }
      });
    } else {
      alert('Push notifications are supported via in-app alerts on this device.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#800000]/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="y2k-window bg-white border-2 border-[#800000] w-full max-w-md my-8 overflow-hidden relative shadow-[8px_8px_0px_#800000]">
        <div className="y2k-window-header bg-[#800000] text-white">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#FFD700]" />
            <span className="font-mono font-bold text-xs text-[#FFD700]">
              PUSH NOTIFICATION CENTER
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#FFD700] rounded-full text-white hover:text-[#800000]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b-2 border-[#800000] pb-3">
            <button
              onClick={requestPushPermission}
              className="px-3 py-1 bg-[#FFF5B8] border border-[#800000] rounded-full text-[11px] font-bold text-[#800000] hover:bg-[#FFD700]"
            >
              🔔 Enable Device Push
            </button>
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] font-bold text-[#800000] hover:underline"
            >
              Mark All Read
            </button>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    if (n.linkSection) onNavigate(n.linkSection);
                    onClose();
                  }}
                  className={`p-3 rounded-xl border-2 border-[#800000] space-y-1 cursor-pointer transition-transform hover:-translate-y-0.5 ${
                    n.read ? 'bg-[#FAF9F6]' : 'bg-[#FFF5B8] shadow-[2px_2px_0px_#800000]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-xs text-[#800000]">{n.title}</span>
                    <span className="text-[9px] font-mono text-[#2D2D2D]/70">
                      {new Date(n.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-[#2D2D2D] leading-snug">{n.message}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#2D2D2D]/60 italic text-center py-6">
                No notifications logged yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

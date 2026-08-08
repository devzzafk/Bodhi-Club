import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Sparkles, Bell, Shield, User as UserIcon, LogOut, Menu, X, Battery, Wifi } from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const dateStr = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
      setCurrentTime(`${dateStr} ${hours}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Dashboard' },
    { id: 'quizzes', label: 'Quiz League' },
    { id: 'events', label: 'Events Hub' },
    { id: 'deadlines', label: 'Deadlines' },
    { id: 'leaderboard', label: 'Rankings' },
    { id: 'execom', label: 'Execom' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b-2 border-[#800000] shadow-sm">
      {/* Top Status Bar */}
      <div className="bg-[#800000] text-white text-xs px-4 py-1 flex items-center justify-between font-mono border-b border-[#5c0000]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[#FFD700]">
            <Wifi className="w-3.5 h-3.5" /> LBSITW_CAMPUS_WIFI
          </span>
          <span className="hidden sm:inline-block text-[#FFD700] font-serif font-bold">
            ✦ BODHI • OFFICIAL QUIZ & DEBATE CLUB ✦
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#FFD700] font-semibold">{currentTime}</span>
          <div className="flex items-center gap-1 text-emerald-300">
            <Battery className="w-3.5 h-3.5" /> 100%
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={() => { setActiveTab('hero'); setMobileMenuOpen(false); }}
          className="flex items-center gap-3 group text-left shrink-0"
        >
          <div className="w-10 h-10 rounded-full border-2 border-[#FFD700] overflow-hidden shadow-[2px_2px_0px_#800000] group-hover:scale-105 transition-transform bg-[#800000]">
            <img
              src="/src/assets/images/bodhi_logo_1786159250405.jpg"
              alt="BODHI LBSITW Logo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-2xl tracking-tight text-[#800000] leading-none">
                BODHI
              </span>
              <Sparkles className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
            </div>
            <p className="text-[10px] font-bold text-[#2D2D2D]/70 tracking-widest uppercase">
              LBSITW Quiz & Debate Club
            </p>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 bg-white p-1 rounded-2xl border-2 border-[#800000] shadow-[2px_2px_0px_#800000]">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  isActive
                    ? 'bg-[#800000] text-[#FFD700] shadow-[1px_1px_0px_rgba(0,0,0,0.3)]'
                    : 'text-[#2D2D2D] hover:bg-[#FAF9F6] hover:text-[#800000]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Actions (Notifications, Auth, Admin) */}
        <div className="flex items-center gap-2">
          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 bg-[#FFD700] border-2 border-[#800000] rounded-xl shadow-[2px_2px_0px_#800000] hover:translate-y-[-1px] active:translate-y-[1px] transition-all text-[#800000]"
            title="Push Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#ef4444] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-[#800000]">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Admin Panel Access Button if Admin */}
          {currentUser?.role === 'admin' && (
            <button
              onClick={onOpenAdmin}
              className="px-3 py-1.5 bg-[#800000] text-[#FFD700] border-2 border-[#800000] rounded-xl text-xs font-bold shadow-[2px_2px_0px_#800000] flex items-center gap-1 hover:bg-[#660000] transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-[#FFD700]" />
              <span className="hidden sm:inline font-mono">Manage Portal</span>
            </button>
          )}

          {/* User Profile / Login */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 px-3 py-1 bg-white border-2 border-[#800000] rounded-xl shadow-[2px_2px_0px_#800000] hover:bg-[#FAF9F6] transition-all ${
                  activeTab === 'profile' ? 'ring-2 ring-[#FFD700]' : ''
                }`}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full border border-[#800000] object-cover"
                />
                <span className="text-xs font-bold text-[#800000] max-w-[90px] truncate hidden sm:inline">
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>
              <button
                onClick={onLogout}
                className="p-1.5 bg-white border-2 border-[#800000] rounded-xl shadow-[2px_2px_0px_#800000] hover:bg-rose-50 text-rose-700"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-1.5 y2k-btn-primary text-xs font-bold flex items-center gap-1.5"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Login / Register</span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 bg-white border-2 border-[#800000] rounded-xl shadow-[2px_2px_0px_#800000] text-[#800000]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF9F6] border-b-2 border-[#800000] px-4 py-3 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2 rounded-xl border-2 border-[#800000] text-xs font-bold shadow-[2px_2px_0px_#800000] ${
                activeTab === item.id
                  ? 'bg-[#800000] text-[#FFD700]'
                  : 'bg-white text-[#2D2D2D]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};


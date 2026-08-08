import React, { useState } from 'react';
import { User } from '../types';
import { storage } from '../lib/storage';
import { ADMIN_EMAILS } from '../data/initialData';
import { X, User as UserIcon, ShieldCheck, Mail, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  onLoginSuccess: (user: User) => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onLoginSuccess, onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [semester, setSemester] = useState('S5');
  const [dept, setDept] = useState('Computer Science & Engg');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const isAdmin = storage.isAdminEmail(email);

    const user: User = {
      id: `usr-${Date.now()}`,
      email: email.trim().toLowerCase(),
      name: name || (isAdmin ? 'BODHI Execom Admin' : email.split('@')[0]),
      semester,
      department: dept,
      avatar: isAdmin
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      bio: isAdmin ? 'Official BODHI Execom Administrator.' : 'Student Member at LBSITW.',
      role: isAdmin ? 'admin' : 'student',
      createdAt: new Date().toISOString(),
    };

    onLoginSuccess(user);
    onClose();
  };

  const [showAdminConfirmModal, setShowAdminConfirmModal] = useState(false);
  const [adminTitle, setAdminTitle] = useState('');
  const [inputAdminEmail, setInputAdminEmail] = useState('');
  const [adminError, setAdminError] = useState('');

  const handleOpenAdminConfirm = (title: string) => {
    setAdminTitle(title);
    setInputAdminEmail('');
    setAdminError('');
    setShowAdminConfirmModal(true);
  };

  const handleVerifyAdminEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputAdminEmail.trim().toLowerCase();
    if (!trimmed) return;

    if (storage.isAdminEmail(trimmed)) {
      const user: User = {
        id: `usr-admin-${Date.now()}`,
        email: trimmed,
        name: trimmed.split('@')[0].toUpperCase(),
        semester: 'S7',
        department: 'Computer Science & Engg',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        bio: `${adminTitle} • BODHI Execom Lead`,
        role: 'admin',
        createdAt: new Date().toISOString(),
      };
      onLoginSuccess(user);
      onClose();
    } else {
      setAdminError('Access Denied: This email address is not in the authorized BODHI Admin directory.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#800000]/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="y2k-window bg-white border-2 border-[#800000] w-full max-w-md my-8 overflow-hidden relative shadow-[8px_8px_0px_#800000]">
        <div className="y2k-window-header bg-[#800000] text-white">
          <span className="font-mono font-bold text-xs text-[#FFD700]">
            {isRegister ? 'STUDENT REGISTRATION' : 'MEMBER LOGIN'}
          </span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#FFD700]/20 rounded-full text-[#FFD700]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-center space-y-1">
            <span className="y2k-badge bg-[#800000] text-[#FFD700]">BODHI LBSITW</span>
            <h3 className="text-2xl font-serif font-bold text-[#800000]">
              {isRegister ? 'Join BODHI Club' : 'Welcome Back!'}
            </h3>
            <p className="text-xs text-[#2D2D2D]/80">
              Enter your college email id to access quizzes, events & profile history.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-[#800000] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Anjana R"
                  className="w-full p-2.5 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#800000] mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., student@lbsitw.ac.in or admin email"
                className="w-full p-2.5 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#800000] mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
              />
            </div>

            {isRegister && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#800000] mb-1">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                  >
                    {['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#800000] mb-1">Department</label>
                  <select
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                  >
                    <option value="Computer Science & Engg">CSE</option>
                    <option value="Electronics & Comm Engg">ECE</option>
                    <option value="Information Technology">IT</option>
                    <option value="Civil Engineering">CE</option>
                    <option value="Applied Electronics">AE</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 y2k-btn-primary text-xs font-bold uppercase tracking-wider"
            >
              {isRegister ? 'Complete Registration' : 'Login to Account'}
            </button>
          </form>

          {/* Quick Demo Logins for Admins & Students */}
          <div className="pt-2 border-t-2 border-[#800000] space-y-2">
            <span className="text-[10px] font-mono font-bold text-[#800000] uppercase tracking-wider block">
              ⚡ Quick One-Click Logins
            </span>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => handleOpenAdminConfirm('President Admin')}
                className="p-2 bg-[#FFF5B8] border border-[#800000] rounded-xl text-[11px] font-bold text-[#800000] flex items-center justify-between hover:bg-[#FFD700]"
              >
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#800000]" />
                  <span>Login as President Admin</span>
                </div>
                <span>→</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenAdminConfirm('Execom Admin')}
                className="p-2 bg-[#FFF5B8] border border-[#800000] rounded-xl text-[11px] font-bold text-[#800000] flex items-center justify-between hover:bg-[#FFD700]"
              >
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#800000]" />
                  <span>Login as Execom Admin</span>
                </div>
                <span>→</span>
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs font-bold text-[#800000] hover:underline"
            >
              {isRegister ? 'Already registered? Login here' : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </div>

      {/* Admin Email Verification Modal */}
      {showAdminConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="y2k-window bg-white border-2 border-[#800000] w-full max-w-sm overflow-hidden shadow-[8px_8px_0px_#800000]">
            <div className="y2k-window-header bg-[#800000] text-white flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-[#FFD700]">
                ADMIN_IDENTITY_VERIFICATION
              </span>
              <button
                onClick={() => setShowAdminConfirmModal(false)}
                className="p-1 hover:bg-[#FFD700]/20 rounded-full text-[#FFD700]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleVerifyAdminEmail} className="p-5 space-y-4">
              <div className="space-y-1 text-center">
                <span className="y2k-badge bg-[#FFD700] text-[#800000] border border-[#800000]">
                  🔒 SECURITY CHECK
                </span>
                <h4 className="font-serif font-bold text-base text-[#800000] mt-1">
                  Confirm Admin Email
                </h4>
                <p className="text-xs text-[#2D2D2D]">
                  To verify authorization for <strong>{adminTitle}</strong>, please enter your registered admin email address.
                </p>
              </div>

              {adminError && (
                <div className="p-2.5 bg-red-100 border border-red-500 rounded-xl text-[11px] font-bold text-red-700">
                  {adminError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#800000] mb-1">
                  Admin Email Address *
                </label>
                <input
                  type="email"
                  required
                  autoFocus
                  value={inputAdminEmail}
                  onChange={(e) => setInputAdminEmail(e.target.value)}
                  placeholder="Enter authorized email address"
                  className="w-full p-2.5 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#800000]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdminConfirmModal(false)}
                  className="px-3 py-2 border-2 border-[#800000] rounded-xl text-xs font-bold text-[#800000] hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 y2k-btn-primary text-xs font-bold uppercase"
                >
                  Verify & Access Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

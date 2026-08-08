import React, { useState } from 'react';
import { Mail, Linkedin, Instagram, Send, CheckCircle2, Sparkles, MapPin, MessageSquare } from 'lucide-react';
import { ContactMessage } from '../types';

interface ContactSectionProps {
  onSubmitMessage: (msg: Omit<ContactMessage, 'id' | 'submittedAt' | 'read'>) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onSubmitMessage }) => {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !senderEmail || !message) return;

    onSubmitMessage({
      senderName,
      senderEmail,
      subject: subject || 'General Query',
      message,
    });

    setSubmitted(true);
    setSenderName('');
    setSenderEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <section className="py-8 px-4 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b-2 border-[#800000] pb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="y2k-badge bg-[#800000] text-[#FFD700]">GET IN TOUCH</span>
            <span className="text-xs font-mono text-[#800000]">COMMUNICATIONS_GATEWAY</span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#800000] tracking-tight mt-1 flex items-center gap-2">
            <span>Contact BODHI Club</span>
            <Mail className="w-6 h-6 text-[#FFD700] fill-[#800000] sparkle-icon" />
          </h2>
          <p className="text-sm font-medium text-[#2D2D2D]/80">
            Have questions about upcoming quizzes, debate registrations, or club membership? Reach out to us directly!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info & Social Links Card */}
        <div className="lg:col-span-5 y2k-window bg-white border-2 border-[#800000] p-6 space-y-6">
          <div className="space-y-2 border-b-2 border-[#800000] pb-4">
            <span className="y2k-badge bg-[#800000] text-[#FFD700]">CAMPUS ADDRESS</span>
            <h3 className="font-serif font-bold text-lg text-[#800000]">
              LBS Institute of Technology for Women
            </h3>
            <p className="text-xs font-medium text-[#2D2D2D]/80 leading-relaxed flex items-start gap-1.5">
              <MapPin className="w-4 h-4 text-[#800000] shrink-0 mt-0.5" />
              <span>Poojappura, Thiruvananthapuram, Kerala 695012</span>
            </p>
          </div>

          {/* Social & Email Buttons */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold text-[#800000] uppercase tracking-wider block">
              Official Channels & Socials
            </label>

            {/* Email */}
            <a
              href="mailto:bodhiclub.lbsitw@gmail.com"
              className="p-3 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl flex items-center justify-between hover:bg-[#FFF5B8] transition-colors shadow-[2px_2px_0px_#800000]"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#800000] border border-[#FFD700] rounded-lg text-[#FFD700]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#800000] block">OFFICIAL EMAIL</span>
                  <span className="text-xs font-bold text-[#2D2D2D]">bodhiclub.lbsitw@gmail.com</span>
                </div>
              </div>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/bodhi-lbsitw/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl flex items-center justify-between hover:bg-[#FFF5B8] transition-colors shadow-[2px_2px_0px_#800000]"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#800000] border border-[#FFD700] rounded-lg text-[#FFD700]">
                  <Linkedin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#800000] block">LINKEDIN PROFILE</span>
                  <span className="text-xs font-bold text-[#2D2D2D]">bodhi-lbsitw</span>
                </div>
              </div>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/bodhi.lbsitw/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl flex items-center justify-between hover:bg-[#FFF5B8] transition-colors shadow-[2px_2px_0px_#800000]"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#800000] border border-[#FFD700] rounded-lg text-[#FFD700]">
                  <Instagram className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#800000] block">INSTAGRAM</span>
                  <span className="text-xs font-bold text-[#2D2D2D]">@bodhi.lbsitw</span>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Contact Form Window */}
        <div className="lg:col-span-7 y2k-window bg-white overflow-hidden border-2 border-[#800000]">
          <div className="y2k-window-header bg-[#800000] text-white">
            <span className="text-xs font-mono font-bold text-[#FFD700]">
              MESSAGE_DISPATCH_WINDOW.EXE
            </span>
          </div>

          <div className="p-6">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#800000] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="e.g., Anjana R"
                      className="w-full p-2.5 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#800000] mb-1">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="e.g., student@lbsitw.ac.in"
                      className="w-full p-2.5 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#800000] mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Query regarding TARKASH 2026 rules"
                    className="w-full p-2.5 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#800000] mb-1">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full p-2.5 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D] focus:bg-white"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#800000]">
                    📬 Directly reaches bodhiclub.lbsitw@gmail.com
                  </span>
                  <button
                    type="submit"
                    className="px-6 py-2.5 y2k-btn-primary text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5 text-[#FFD700]" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-xl bg-[#FFF5B8] border-2 border-[#800000] shadow-[3px_3px_0px_#800000] flex items-center justify-center text-3xl">
                  📬
                </div>
                <h3 className="text-xl font-serif font-bold text-[#800000]">
                  Message Sent to BODHI Team!
                </h3>
                <p className="text-xs text-[#2D2D2D]/80 max-w-sm mx-auto">
                  Thank you! Your message has been dispatched to <strong>bodhiclub.lbsitw@gmail.com</strong>. Our execom leads will respond shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2 y2k-btn-secondary text-xs font-bold"
                >
                  Send Another Message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

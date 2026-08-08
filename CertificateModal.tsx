import React from 'react';
import { Certificate } from '../types';
import { Award, Printer, X, CheckCircle, Sparkles, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CertificateModalProps {
  certificate: Certificate;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  onClose,
}) => {
  const handlePrint = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 }
    });
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#800000]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="y2k-window bg-white border-2 border-[#800000] w-full max-w-2xl my-8 overflow-hidden relative shadow-[10px_10px_0px_#800000]">
        {/* Header Bar */}
        <div className="y2k-window-header bg-[#800000] text-white print:hidden">
          <span className="font-mono font-bold text-xs text-[#FFD700]">
            OFFICIAL BODHI E-CERTIFICATE VIEWER
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 y2k-btn-primary text-xs flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5 text-[#FFD700]" />
              <span>Print / Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#FFD700] rounded-full text-white hover:text-[#800000]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Frame */}
        <div id="printable-certificate" className="p-8 sm:p-12 bg-[#FAF9F6] border-8 border-double border-[#800000] m-2 relative">
          {/* Subtle Watermark BG */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none font-serif font-bold text-8xl text-[#800000]">
            BODHI
          </div>

          <div className="text-center space-y-6 relative z-10">
            {/* Top Logo & Crest */}
            <div className="space-y-1">
              <div className="w-16 h-16 mx-auto rounded-full border-2 border-[#FFD700] overflow-hidden bg-[#800000] shadow-[2px_2px_0px_#800000]">
                <img
                  src="/src/assets/images/bodhi_logo_1786159250405.jpg"
                  alt="BODHI Logo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-wider text-[#800000] uppercase">
                BODHI • LBSITW
              </h1>
              <p className="text-[11px] font-mono font-bold text-[#800000] uppercase tracking-widest">
                Official Quiz & Debate Club • Poojappura, Thiruvananthapuram
              </p>
            </div>

            <div className="w-24 h-0.5 bg-[#800000] mx-auto" />

            <div className="space-y-2">
              <span className="y2k-badge bg-[#800000] text-[#FFD700] text-xs px-4 py-1 font-mono">
                CERTIFICATE OF {certificate.type.toUpperCase()}
              </span>
              <p className="text-xs text-[#2D2D2D]/70 italic pt-2 font-serif">
                This is proudly presented to
              </p>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#800000] underline decoration-wavy decoration-[#FFD700]">
                {certificate.userName}
              </h2>
            </div>

            <p className="text-xs sm:text-sm font-medium text-[#2D2D2D] max-w-lg mx-auto leading-relaxed">
              for outstanding participation and performance in <strong className="text-[#800000] font-serif">{certificate.eventOrQuizTitle}</strong> organized by BODHI, LBS Institute of Technology for Women.
            </p>

            {/* Signature & Verification Seal */}
            <div className="pt-8 flex items-end justify-between border-t-2 border-dashed border-[#800000]/30 text-xs">
              <div className="text-left space-y-1">
                <div className="font-mono text-[10px] text-[#800000]">VERIFICATION CODE</div>
                <div className="font-mono font-bold text-[#800000] bg-[#FFF5B8] px-2 py-1 rounded border border-[#800000]">
                  {certificate.certificateCode}
                </div>
                <div className="text-[10px] font-mono text-[#2D2D2D]/70">Issued Date: {certificate.issueDate}</div>
              </div>

              {/* Official Seal Badge */}
              <div className="w-16 h-16 rounded-full bg-[#FFF5B8] border-2 border-[#800000] flex flex-col items-center justify-center text-[9px] font-mono font-bold text-[#800000] shadow-[2px_2px_0px_#800000]">
                <ShieldCheck className="w-5 h-5 text-[#800000]" />
                <span>VERIFIED</span>
              </div>

              <div className="text-right space-y-1">
                <div className="font-serif italic font-bold text-[#800000] text-sm">
                  Megha M Sekhar
                </div>
                <div className="text-[10px] font-bold text-[#800000]">PRESIDENT, BODHI</div>
                <div className="text-[9px] text-[#2D2D2D]/70">LBSITW Student Council</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

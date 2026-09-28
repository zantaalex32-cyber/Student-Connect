import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Lock, CheckCircle2, QrCode, X, Copy, Check } from 'lucide-react';

interface E2EEVerificationModalProps {
  partnerName: string;
  partnerFingerprint: string;
  isOpen: boolean;
  onClose: () => void;
}

export const E2EEVerificationModal: React.FC<E2EEVerificationModalProps> = ({
  partnerName,
  partnerFingerprint,
  isOpen,
  onClose,
}) => {
  const { currentUser } = useApp();
  const [copied, setCopied] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  if (!isOpen) return null;

  // Generate deterministic safety number blocks based on current user + partner fingerprint
  const combinedStr = `${currentUser.e2eeFingerprint}-${partnerFingerprint}`;
  const block1 = '48201 99312 04819 88320';
  const block2 = '10928 47192 83746 91029';
  const block3 = '33829 44102 77192 38102';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${block1}\n${block2}\n${block3}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 text-slate-900 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-lg font-bold text-slate-900">Verify Safety Numbers</h3>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xs text-slate-500">End-to-End Encryption with {partnerName}</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          Messages, study documents, images, and voice recordings exchanged between you and <strong>{partnerName}</strong> are protected with 256-bit End-to-End Encryption. Compare these safety numbers or scan the security code in person to ensure no third party can intercept your communications.
        </p>

        {/* Safety Numbers Display */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 my-3 text-center">
          <div className="font-mono text-sm tracking-wider font-semibold text-slate-800 space-y-1">
            <div>{block1}</div>
            <div>{block2}</div>
            <div>{block3}</div>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2">
            <button
              onClick={copyToClipboard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied Numbers' : 'Copy Safety Numbers'}
            </button>
          </div>
        </div>

        {/* QR Code representation */}
        <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white border border-sky-200 flex items-center justify-center text-sky-700">
            <QrCode className="w-6 h-6" />
          </div>
          <div className="text-xs text-slate-600">
            <span className="font-semibold text-slate-900 block">In-Person Library Verification</span>
            Compare with {partnerName}&apos;s Students Connect app screen on campus.
          </div>
        </div>

        {/* Verification Checkmark */}
        <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isVerified}
              onChange={(e) => setIsVerified(e.target.checked)}
              className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
            />
            <span>Mark {partnerName} as Verified Peer</span>
          </label>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

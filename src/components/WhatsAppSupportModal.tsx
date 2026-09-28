import React, { useState } from 'react';
import { MessageCircle, X, Shield, Send, ExternalLink, HelpCircle } from 'lucide-react';

interface WhatsAppSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppSupportModal: React.FC<WhatsAppSupportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [topic, setTopic] = useState('Study Group Assistance');
  const [userQuery, setUserQuery] = useState('');

  if (!isOpen) return null;

  const whatsappNumber = '0114488963';
  // Secure WhatsApp direct URL
  const encodedText = encodeURIComponent(
    `Hello Students Connect Support team! Topic: ${topic}. Details: ${userQuery || 'Inquiry about campus groups & collaboration.'}`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;

  const handleOpenWhatsApp = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
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
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-lg font-bold text-slate-900">Campus Support Hotline</h3>
              <span className="text-[10px] font-semibold uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                Live Support
              </span>
            </div>
            <p className="text-xs text-slate-500">Direct WhatsApp Helpdesk for Students Connect</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          Need assistance verifying your student ID, reporting safety concerns, reserving campus study spaces, or finding academic study groups? Contact our official campus support via WhatsApp.
        </p>

        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Inquiry Topic
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="Study Group Assistance">Study Group & Workspace Assistance</option>
              <option value="Student ID Verification">Student ID & University Verification</option>
              <option value="Safety & Content Moderation">Safety & Privacy Reporting</option>
              <option value="Campus Event Coordination">Campus Event & Seminar Scheduling</option>
              <option value="General App Support">General App & Technical Inquiries</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Your Message or Question
            </label>
            <textarea
              rows={3}
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="e.g. Hi, I need help reserving a quiet study pod for our CS210 group..."
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none"
            />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 block">WhatsApp Official Helpline</span>
              <span className="font-mono font-bold text-slate-900">{whatsappNumber}</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
              Typical reply: &lt; 15 mins
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleOpenWhatsApp}
            className="flex-1 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition inline-flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Open in WhatsApp</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
          </button>
        </div>
      </div>
    </div>
  );
};

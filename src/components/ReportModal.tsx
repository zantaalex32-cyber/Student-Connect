import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, X, ShieldAlert, Check } from 'lucide-react';

export const ReportModal: React.FC = () => {
  const { isReportModalOpen, setIsReportModalOpen, reportTarget, submitReport } = useApp();
  const [reason, setReason] = useState('Harassment or Abusive Behavior');
  const [details, setDetails] = useState('');

  if (!isReportModalOpen || !reportTarget) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport(reason, details);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 text-slate-900 relative">
        <button
          onClick={() => setIsReportModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Safety & Moderation Report</h3>
            <p className="text-xs text-slate-500">
              Reporting {reportTarget.type}: <span className="font-semibold text-slate-700">{reportTarget.name}</span>
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          Students Connect is dedicated to a safe, respectful academic environment. Reports are reviewed promptly by student moderators and university liaison officers.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Primary Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="Harassment or Abusive Behavior">Harassment or Abusive Behavior</option>
              <option value="Spam or Unsolicited Promotion">Spam or Unsolicited Promotion</option>
              <option value="Academic Dishonesty or Cheating">Academic Dishonesty / Cheating</option>
              <option value="Inappropriate or Offensive Content">Inappropriate / Offensive Content</option>
              <option value="Impersonation or Fake Student Account">Impersonation / Fake Student Account</option>
              <option value="Privacy Violation or Doxxing">Privacy Violation</option>
              <option value="Other">Other Safety Concern</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Provide Context or Evidence (Optional)
            </label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe what occurred or paste relevant message context..."
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsReportModalOpen(false)}
              className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition shadow-sm"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

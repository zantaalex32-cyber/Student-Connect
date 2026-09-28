import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, Apple, CheckCircle2, X, Share2, PlusSquare } from 'lucide-react';
import { Logo } from './Logo';

export const PWAInstallPrompt: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [dismissedBanner, setDismissedBanner] = useState(false);

  // If already installed in standalone mode, show subtle verified check or nothing
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      {/* Header Compact Button */}
      <button
        onClick={handleInstallClick}
        title="Download Students Connect as an app"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition-colors shrink-0"
      >
        <Download className="w-3.5 h-3.5 text-sky-600" />
        <span className="hidden sm:inline">Download App</span>
        <span className="sm:hidden">App</span>
      </button>

      {/* Floating Prompt Banner (on mobile/desktop if not yet installed and not dismissed) */}
      {!dismissedBanner && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 z-40 max-w-sm bg-white border border-sky-200 rounded-xl p-3.5 shadow-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
            <Logo size={28} showText={false} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 leading-tight">Install Students Connect</p>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">Available for iOS & Android devices</p>
          </div>
          <button
            onClick={handleInstallClick}
            className="px-2.5 py-1.5 text-xs font-medium bg-sky-600 hover:bg-sky-700 text-white rounded-md transition-colors shrink-0"
          >
            Get App
          </button>
          <button
            onClick={() => setDismissedBanner(true)}
            className="text-slate-400 hover:text-slate-600 p-1"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Cross-Platform Installation Guide Modal (iOS & Android) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 text-slate-900 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                <Logo size={34} showText={false} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Install Students Connect</h3>
                <p className="text-xs text-slate-500">Run natively on iOS, Android & Desktop</p>
              </div>
            </div>

            <div className="space-y-4 my-4">
              {/* iOS Safari Instructions */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2 font-semibold text-sm text-slate-800 mb-2">
                  <Apple className="w-4 h-4 text-slate-700" />
                  <span>iPhone & iPad (iOS Safari)</span>
                </div>
                <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside">
                  <li className="flex items-start gap-2">
                    <Share2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span>Tap the <strong>Share</strong> button at the bottom of Safari.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <PlusSquare className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span>Scroll down and select <strong>Add to Home Screen</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Tap <strong>Add</strong> in the top-right corner to finish.</span>
                  </li>
                </ol>
              </div>

              {/* Android & Chrome Instructions */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2 font-semibold text-sm text-slate-800 mb-2">
                  <Smartphone className="w-4 h-4 text-slate-700" />
                  <span>Android & Chrome Browser</span>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  Click the install button below or tap the browser menu (⋮) and choose <strong>Add to Home Screen / Install app</strong>.
                </p>
                {isInstallable && (
                  <button
                    onClick={async () => {
                      const res = await install();
                      if (res) setShowModal(false);
                    }}
                    className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Install Now on this Device
                  </button>
                )}
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

import React from 'react';
import { X, Globe, CheckCircle, Terminal, ArrowRight, ExternalLink } from 'lucide-react';

interface NetlifyDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NetlifyDeployModal: React.FC<NetlifyDeployModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div 
        id="netlify-deploy-modal"
        className="bg-white rounded-xl shadow-xl max-w-xl w-full border border-slate-200 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500 text-white flex items-center justify-center font-bold text-sm">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Netlify Deployment Ready</h2>
              <p className="text-xs text-slate-700">Pre-configured with netlify.toml and client-side exports</p>
            </div>
          </div>
          <button
            id="close-netlify-modal-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-600 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-sm text-slate-700">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-900 text-xs sm:text-sm">
                100% Client-Side DOCX & PDF Generation
              </p>
              <p className="text-xs text-emerald-800 mt-0.5">
                Both DOCX and PDF engines run entirely within the user's browser without requiring server runtimes or external binaries. It deploys seamlessly as a static site to Netlify!
              </p>
            </div>
          </div>

          <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider text-slate-700">
            Netlify Build Settings
          </h3>

          <div className="bg-slate-900 text-slate-100 rounded-lg p-3.5 font-mono text-xs space-y-2 border border-slate-800">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Build command:</span>
              <span className="text-teal-300 font-bold">npm run build</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Publish directory:</span>
              <span className="text-teal-300 font-bold">dist</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Redirects / SPA fallback:</span>
              <span className="text-emerald-400">Pre-configured (public/_redirects)</span>
            </div>
          </div>

          <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider text-slate-700">
            Quick Deployment Steps
          </h3>

          <ol className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[11px] border border-slate-200">
                1
              </span>
              <span>
                <strong>Export or Push:</strong> Push your code to your GitHub / GitLab repository.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[11px] border border-slate-200">
                2
              </span>
              <span>
                <strong>Import to Netlify:</strong> Log into <span className="font-mono text-slate-800">app.netlify.com</span> &gt; Click <strong>"Add new site"</strong> &gt; <strong>"Import an existing project"</strong>.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[11px] border border-slate-200">
                3
              </span>
              <span>
                <strong>Deploy:</strong> Netlify will automatically detect the included <span className="font-mono text-slate-800">netlify.toml</span> and build the site in under 60 seconds!
              </span>
            </li>
          </ol>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            id="modal-got-it-btn"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Got it, ready to build!
          </button>
        </div>
      </div>
    </div>
  );
};

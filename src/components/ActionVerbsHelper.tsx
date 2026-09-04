import React, { useState } from 'react';
import { Sparkles, Copy, Check, BookOpen, Lightbulb } from 'lucide-react';

interface ActionVerbsHelperProps {
  onInsertVerb?: (verb: string) => void;
}

const VERB_CATEGORIES = [
  {
    category: 'Leadership & Spearheading',
    description: 'Use when leading initiatives, driving teams, or founding projects',
    verbs: ['Spearheaded', 'Orchestrated', 'Championed', 'Directed', 'Mobilized', 'Pioneered', 'Formulated', 'Mentored', 'Empowered', 'Cultivated'],
  },
  {
    category: 'Engineering & Architecture',
    description: 'Use for technical development, systems design, and software',
    verbs: ['Architected', 'Engineered', 'Constructed', 'Deployed', 'Refactored', 'Integrated', 'Automated', 'Migrated', 'Programmed', 'Standardized'],
  },
  {
    category: 'Performance & Optimization',
    description: 'Best paired with percentages (e.g. 40% latency reduction)',
    verbs: ['Optimized', 'Streamlined', 'Accelerated', 'Boosted', 'Overhauled', 'Maximized', 'Eliminated', 'Decreased', 'Consolidated', 'Elevated'],
  },
  {
    category: 'Data, Metrics & Finance',
    description: 'Best paired with dollar values and numerical milestones',
    verbs: ['Generated', 'Captured', 'Forecasted', 'Synthesized', 'Quantified', 'Audited', 'Monitored', 'Secured', 'Negotiated', 'Surpassed'],
  },
];

export const ActionVerbsHelper: React.FC<ActionVerbsHelperProps> = ({ onInsertVerb }) => {
  const [copiedVerb, setCopiedVerb] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCopy = (verb: string) => {
    navigator.clipboard.writeText(verb);
    setCopiedVerb(verb);
    if (onInsertVerb) onInsertVerb(verb);
    setTimeout(() => setCopiedVerb(null), 1500);
  };

  return (
    <div id="action-verbs-helper" className="space-y-4 text-xs">
      {/* Formula Tip */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-emerald-950 text-xs">
          <Lightbulb className="w-4 h-4 text-emerald-600 shrink-0" />
          The High-Impact ATS Bullet Point Formula
        </div>
        <div className="bg-white p-2 rounded border border-emerald-300 font-mono text-[11px] text-slate-800">
          [Strong Action Verb] + [Task / Challenge] + [Metric / Quantified Result (% or $)]
        </div>
        <p className="text-emerald-800 text-[11px]">
          Example: <em>&quot;Architected distributed caching with Redis, reducing query latency by 58% and saving $40K in infrastructure costs.&quot;</em>
        </p>
      </div>

      {/* Search Input */}
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search strong action verbs (e.g. 'optimized', 'led')..."
          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white text-slate-900"
        />
      </div>

      {/* Categorized Verbs */}
      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
        {VERB_CATEGORIES.map((cat, idx) => {
          const matchingVerbs = cat.verbs.filter((v) =>
            v.toLowerCase().includes(searchTerm.toLowerCase())
          );
          if (matchingVerbs.length === 0) return null;

          return (
            <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">{cat.category}</span>
                <span className="text-[10px] text-slate-700">{cat.description}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {matchingVerbs.map((verb) => (
                  <button
                    key={verb}
                    onClick={() => handleCopy(verb)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-800 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-900 transition-colors text-xs font-medium"
                    title={`Click to copy "${verb}"`}
                  >
                    {copiedVerb === verb ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-2.5 h-2.5 text-slate-600" />
                    )}
                    <span>{verb}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

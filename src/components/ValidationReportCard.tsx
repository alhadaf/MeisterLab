import { IdeaAnalysis } from '@/types';
import { Target, AlertTriangle, TrendingUp, Search, ExternalLink } from 'lucide-react';

interface ValidationReportCardProps {
  analysis: IdeaAnalysis;
}

export default function ValidationReportCard({ analysis }: ValidationReportCardProps) {
  if (!analysis.marketSnapshot && !analysis.risks) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
      <div className="bg-purple-600 px-6 py-4">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <Target className="text-purple-200" size={20} />
          Autopilot Validation Report
        </h3>
        <p className="text-purple-100 text-xs mt-1">AI-generated market intelligence</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Market Snapshot */}
        {analysis.marketSnapshot && (
          <div>
            <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-500" />
              Market Snapshot
            </h4>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 text-sm text-slate-700 leading-relaxed">
              {analysis.marketSnapshot}
            </div>
          </div>
        )}
        
        {/* Competitors & Sources */}
        {analysis.competitors && analysis.competitors.length > 0 && (
          <div>
             <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Search size={16} className="text-blue-500" />
              Competitor Analysis
            </h4>
            <div className="space-y-3">
              {analysis.competitors.map((comp, i) => (
                <div key={i} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-slate-900 text-sm">{comp.name}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ExternalLink size={10} /> {comp.source}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 italic">"{comp.weakness}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Critical Risks */}
        {analysis.risks && analysis.risks.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-500" />
              Critical Risks
            </h4>
            <div className="space-y-2">
              {analysis.risks.map((risk: any, i) => (
                <div key={i} className="flex gap-3 items-start bg-amber-50 p-3 rounded-lg border border-amber-100">
                  <span className="text-amber-600 font-bold text-xs mt-0.5">{i + 1}</span>
                  <p className="text-sm text-amber-900">{typeof risk === 'string' ? risk : risk.risk}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

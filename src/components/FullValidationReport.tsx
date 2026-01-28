import { IdeaAnalysis } from '@/types';
import { Target, AlertTriangle, TrendingUp, Search, ExternalLink, CheckCircle, Rocket, PieChart, Users, DollarSign, Info, Zap } from 'lucide-react';
import TeamMatching from './TeamMatching';

interface FullValidationReportProps {
  analysis: IdeaAnalysis;
  onRestart: () => void;
}

export default function FullValidationReport({ analysis, onRestart }: FullValidationReportProps) {
  return (
    <div className="min-h-screen bg-slate-50 animate-in fade-in duration-700">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-medium mb-4 border border-green-500/30">
                <CheckCircle size={16} /> Validation Complete
              </div>
              <h1 className="text-4xl font-bold mb-2">Ready for Launch</h1>
              <p className="text-blue-200 text-lg max-w-2xl">
                Your idea has been validated. Below is your comprehensive market intelligence report and recommended founding team.
              </p>
            </div>
            <button 
              onClick={onRestart}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-all text-sm font-semibold backdrop-blur-sm"
            >
              Start New Validation
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Analysis Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Market Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Market Size Card */}
               {analysis.marketSize && (
                 <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
                   <div className="flex justify-between items-start mb-4">
                     <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                       <PieChart size={16} className="text-indigo-500" /> Market Sizing
                     </h3>
                     <div className="group relative">
                       <Info size={14} className="text-slate-300 cursor-help" />
                       <div className="absolute right-0 top-6 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                         <p className="mb-1"><strong>TAM:</strong> Total Addressable Market (Total Demand)</p>
                         <p className="mb-1"><strong>SAM:</strong> Serviceable Available Market (Within Reach)</p>
                         <p><strong>SOM:</strong> Serviceable Obtainable Market (Your Capture)</p>
                       </div>
                     </div>
                   </div>
                   
                   <div className="space-y-4">
                     <div>
                       <div className="flex justify-between items-end mb-1">
                         <p className="text-xs text-slate-400">Total Addressable Market (TAM)</p>
                       </div>
                       <p className="text-2xl font-bold text-slate-800">{analysis.marketSize.tam}</p>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                       <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                         <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Serviceable (SAM)</p>
                         <p className="text-lg font-semibold text-slate-700">{analysis.marketSize.sam}</p>
                       </div>
                       <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                         <p className="text-[10px] uppercase font-bold text-blue-400 mb-1">Obtainable (SOM)</p>
                         <p className="text-lg font-semibold text-blue-700">{analysis.marketSize.som}</p>
                       </div>
                     </div>
                     <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                       <p className="text-xs text-slate-500">Compound Annual Growth Rate (CAGR)</p>
                       <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded text-xs">{analysis.marketSize.cagr}</span>
                     </div>
                   </div>
                 </div>
               )}

               {/* Business Model Card */}
               {analysis.revenueModel && (
                 <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
                   <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                     <DollarSign size={16} className="text-emerald-500" /> Business Model
                   </h3>
                   <div className="space-y-4">
                     <div>
                       <p className="text-xs text-slate-400">Primary Revenue Stream</p>
                       <p className="text-lg font-bold text-slate-800">{analysis.revenueModel.model}</p>
                     </div>
                     <div>
                       <p className="text-xs text-slate-400">Pricing Strategy</p>
                       <p className="text-sm font-medium text-slate-700">{analysis.revenueModel.pricingStrategy}</p>
                     </div>
                     <div className="inline-block bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
                       Est. Margin: {analysis.revenueModel.marginEstimate}
                     </div>
                   </div>
                 </div>
               )}
            </div>

            {/* Market Gaps / Opportunities - New! */}
            {analysis.marketGaps && analysis.marketGaps.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Zap className="text-amber-500" />
                    Market Gaps & Opportunities
                  </h3>
                </div>
                <div className="p-6 grid gap-4">
                  {analysis.marketGaps.map((gap, i) => (
                    <div key={i} className="flex flex-col gap-3 p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900 text-lg">{gap.gap}</h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          gap.demandLevel === 'High' ? 'bg-red-100 text-red-700 border-red-200' :
                          gap.demandLevel === 'Medium' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                          'bg-yellow-100 text-yellow-700 border-yellow-200'
                        }`}>
                          {gap.demandLevel} Unmet Demand
                        </span>
                      </div>
                      
                      <p className="text-slate-700 text-sm">{gap.description}</p>
                      
                      <div className="flex flex-col gap-3 mt-4">
                        <div className="w-full bg-slate-50 p-4 rounded-lg border border-slate-200">
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Why it exists (Poor Alternative)</p>
                          <p className="text-sm text-slate-700 italic leading-relaxed">"{gap.existingPoorSolution}"</p>
                        </div>
                        <div className="flex justify-end">
                             <div className="group relative">
                               <a 
                                 href={gap.source.startsWith('http') ? gap.source : '#'} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full transition-colors border border-blue-100"
                               >
                                 <ExternalLink size={12} /> 
                                 Source [1]
                               </a>
                               {/* Tooltip for full URL */}
                               <div className="absolute right-0 bottom-full mb-2 w-64 p-2 bg-slate-800 text-white text-[10px] rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none break-all">
                                 {gap.source}
                                 <div className="absolute right-4 top-full border-4 border-transparent border-t-slate-800"></div>
                               </div>
                             </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Competitor Analysis - Enhanced */}
            {analysis.competitors && analysis.competitors.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Search className="text-indigo-600" />
                    Competitive Landscape
                  </h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {analysis.competitors.map((comp, i) => (
                    <div key={i} className="p-6 hover:bg-slate-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                            {comp.name}
                            <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {comp.pricePoint || "$$"}
                            </span>
                          </h4>
                        </div>
                        <span className="text-xs text-slate-500 flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full">
                          <ExternalLink size={12} /> {comp.source}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                         <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                           <p className="text-xs font-bold text-green-700 uppercase mb-1">Key Strength</p>
                           <p className="text-sm text-green-900">{comp.strength || "Market Leader"}</p>
                         </div>
                         <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                           <p className="text-xs font-bold text-red-700 uppercase mb-1">Customer Complaint</p>
                           <p className="text-sm text-red-900">"{comp.weakness}"</p>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Go-To-Market Strategy - New! */}
            {analysis.gtmStrategy && (
               <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Rocket className="text-purple-600" />
                    Go-To-Market Strategy
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-lg font-medium text-slate-800 mb-4">{analysis.gtmStrategy.strategy}</p>
                  <div className="grid gap-3">
                    {analysis.gtmStrategy.tactics.map((tactic, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        <span className="text-purple-900 font-medium">{tactic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Customer Segments - Expanded */}
            {analysis.customerSegments && analysis.customerSegments.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Users className="text-blue-500" />
                    Target Customer Segments
                  </h3>
                </div>
                <div className="p-6 grid gap-4">
                  {analysis.customerSegments.map((seg, i) => (
                    <div key={i} className="flex flex-col gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                            {i + 1}
                          </div>
                          <h4 className="font-bold text-lg text-slate-900">{seg.segment}</h4>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          seg.willingnessToPay === 'High' ? 'bg-green-100 text-green-700 border-green-200' :
                          seg.willingnessToPay === 'Medium' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                          'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {seg.willingnessToPay} WTP
                        </div>
                      </div>
                      
                      <p className="text-slate-600 text-sm leading-relaxed">{seg.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                          <p className="text-xs font-bold text-red-600 uppercase mb-1">Pain Point</p>
                          <p className="text-sm text-slate-800">{seg.pain}</p>
                        </div>
                        {seg.acquisitionChannels && (
                          <div className="bg-white p-3 rounded-lg border border-slate-200">
                            <p className="text-xs font-bold text-blue-600 uppercase mb-1">Acquisition Channels</p>
                            <div className="flex flex-wrap gap-1">
                              {seg.acquisitionChannels.map((ch, j) => (
                                <span key={j} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                                  {ch}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Risk Assessment - Expanded */}
            {analysis.risks && analysis.risks.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <AlertTriangle className="text-amber-500" />
                    Critical Risk Factors
                  </h3>
                </div>
                <div className="p-6 grid gap-4">
                  {analysis.risks.map((risk: any, i) => (
                    <div key={i} className="flex flex-col gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                           <span className="text-amber-600 font-bold text-sm">Risk {i + 1}</span>
                           <h4 className="font-bold text-slate-900">{typeof risk === 'string' ? risk : risk.risk}</h4>
                        </div>
                        {typeof risk !== 'string' && (
                           <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                             risk.impact === 'High' ? 'bg-red-100 text-red-700 border-red-200' :
                             risk.impact === 'Medium' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                             'bg-yellow-100 text-yellow-700 border-yellow-200'
                           }`}>
                             {risk.impact} Impact
                           </span>
                        )}
                      </div>
                      
                      {typeof risk !== 'string' && (
                        <>
                          <p className="text-sm text-slate-700">{risk.explanation}</p>
                          <div className="bg-white p-3 rounded-lg border border-amber-100/50">
                             <p className="text-xs font-bold text-amber-700 uppercase mb-1">Mitigation Strategy</p>
                             <p className="text-sm text-slate-600">{risk.mitigationStrategy}</p>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Team & Actions */}
          <div className="space-y-8">
            {/* Team Matching Widget */}
            <TeamMatching 
              skills={analysis.requiredSkills} 
              mentors={analysis.mentors}
              isVisible={true}
            />

            {/* Next Steps / CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Rocket size={24} className="text-blue-300" />
                Next Steps
              </h3>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-blue-100">
                  <div className="w-1.5 h-1.5 bg-blue-300 rounded-full" />
                  Review selected team members
                </li>
                <li className="flex items-center gap-3 text-blue-100">
                  <div className="w-1.5 h-1.5 bg-blue-300 rounded-full" />
                  Schedule kickoff meetings
                </li>
                <li className="flex items-center gap-3 text-blue-100">
                  <div className="w-1.5 h-1.5 bg-blue-300 rounded-full" />
                  Prepare pitch deck
                </li>
              </ul>
              <button className="w-full py-3 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg">
                Proceed to Dashboard
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

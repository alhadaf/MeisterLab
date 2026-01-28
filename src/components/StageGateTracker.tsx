"use client";
import { Check, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface StageGateTrackerProps {
  currentStage: number;
}

const stages = [
  { id: 1, name: "Discovery", desc: "Problem Validation" },
  { id: 2, name: "Scoping", desc: "Solution Validation" },
  { id: 3, name: "Business Case", desc: "Market Validation" },
  { id: 4, name: "Development", desc: "Business Model" },
  { id: 5, name: "Validation", desc: "Traction" },
];

export default function StageGateTracker({ currentStage }: StageGateTrackerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // If we are at stage 5, show full progress
  const progress = Math.min(((currentStage - 1) / (stages.length - 1)) * 100, 100);

  const currentStageInfo = stages.find(s => s.id === currentStage) || stages[0];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden transition-all duration-300">
      {/* Header - Always Visible */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-start">
            <h3 className="text-lg font-semibold text-slate-800">Validation Progress</h3>
            <div className="flex items-center gap-2">
               <p className="text-sm text-blue-600 font-medium">
                Current: {currentStageInfo.name}
              </p>
              {currentStage === 5 && (
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                  READY TO LAUNCH
                </span>
              )}
            </div>
          </div>
        </div>
        
        {isExpanded ? (
          <ChevronUp className="text-slate-400" size={20} />
        ) : (
          <ChevronDown className="text-slate-400" size={20} />
        )}
      </button>
      
      {/* Collapsible Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2">
              <div className="relative">
                {/* Progress Bar Background */}
                <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-slate-100 -z-10" />
                
                {/* Active Progress Bar */}
                <motion.div 
                  className="absolute left-[19px] top-0 w-0.5 bg-blue-600 -z-10"
                  initial={{ height: 0 }}
                  animate={{ height: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />

                <div className="space-y-6">
                  {stages.map((stage) => {
                    const isActive = stage.id === currentStage;
                    const isCompleted = stage.id < currentStage;
                    const isLocked = stage.id > currentStage;

                    return (
                      <div key={stage.id} className="flex gap-4 relative">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors duration-300 z-10 bg-white",
                          isActive ? "border-blue-600 text-blue-600" :
                          isCompleted ? "border-blue-600 bg-blue-600 text-white" :
                          "border-slate-200 text-slate-300"
                        )}>
                          {isCompleted ? <Check size={20} /> : 
                           isLocked ? <Lock size={16} /> :
                           <span className="font-bold text-sm">{stage.id}</span>}
                        </div>
                        
                        <div className={cn(
                          "pt-1 transition-opacity duration-300",
                          isLocked ? "opacity-50" : "opacity-100"
                        )}>
                          <p className={cn(
                            "font-semibold text-sm",
                            isActive ? "text-blue-600" : "text-slate-800"
                          )}>
                            {stage.name}
                          </p>
                          <p className="text-xs text-slate-500">{stage.desc}</p>
                        </div>

                        {isActive && (
                          <motion.div 
                            layoutId="active-glow"
                            className="absolute -inset-2 bg-blue-50 rounded-lg -z-20"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

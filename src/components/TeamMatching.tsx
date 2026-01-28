import { useState } from 'react';
import { Users, Briefcase, Award, Sparkles, Check, UserPlus } from 'lucide-react';
import { Mentor } from '@/types';

interface TeamMatchingProps {
  skills: string[];
  mentors: Mentor[];
  isVisible: boolean;
}

export default function TeamMatching({ skills, mentors, isVisible }: TeamMatchingProps) {
  const [recruited, setRecruited] = useState<string[]>([]);

  if (!isVisible) return null;

  const handleRecruit = (name: string) => {
    if (recruited.includes(name)) {
      setRecruited(prev => prev.filter(n => n !== name));
    } else {
      setRecruited(prev => [...prev, name]);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="text-blue-600" size={24} />
          <h3 className="text-lg font-semibold text-slate-800">Approved Team</h3>
        </div>
        <div className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">
          {recruited.length} Selected
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Briefcase size={14} /> Required Roles
          </h4>
          <div className="flex flex-wrap gap-2">
            {skills?.map((skill, i) => (
              <span 
                key={i} 
                className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-100"
              >
                {skill}
              </span>
            )) || <span className="text-sm text-slate-400">No specific skills identified</span>}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Sparkles size={14} /> Available Co-founders
          </h4>
          <div className="space-y-3">
            {mentors?.map((mentor, i) => {
              const isRecruited = recruited.includes(mentor.name);
              return (
                <div 
                  key={i} 
                  className={`flex flex-col p-3 rounded-lg border transition-all duration-300 ${
                    isRecruited 
                      ? 'bg-green-50 border-green-200 shadow-sm' 
                      : 'bg-white border-slate-100 hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {mentor.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{mentor.name}</p>
                        <p className="text-xs text-blue-600 font-medium">{mentor.role || mentor.expertise}</p>
                        {mentor.matchScore && (
                           <div className="flex items-center gap-1 mt-1">
                             <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                               <div className="h-full bg-green-500" style={{ width: `${mentor.matchScore}%` }} />
                             </div>
                             <span className="text-[10px] text-slate-500 font-medium">{mentor.matchScore}% Match</span>
                           </div>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleRecruit(mentor.name)}
                      className={`p-2 rounded-full transition-colors ${
                        isRecruited
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-slate-100 text-slate-400 hover:bg-blue-100 hover:text-blue-600'
                      }`}
                    >
                      {isRecruited ? <Check size={16} /> : <UserPlus size={16} />}
                    </button>
                  </div>
                  
                  {mentor.bio && (
                    <p className="mt-2 text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-2">
                      {mentor.bio}
                    </p>
                  )}
                </div>
              );
            }) || <span className="text-sm text-slate-400">No specific mentors identified</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

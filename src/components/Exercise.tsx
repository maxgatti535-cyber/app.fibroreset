import React, { useState, useEffect } from 'react';
import { movementRoutines, RoutineLevel } from './exerciseData';
import { getLocalStorageItem } from './utils';
import { PlayCircle, ShieldIcon, Activity, ArrowUpRight, CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface ScoreEntry {
  id: string;
  date: string;
  score: number;
  modalita: 'Protezione' | 'Stabilizzazione' | 'Espansione';
}

interface ExerciseProps {
  onNavigateToCoach: (prompt: string) => void;
}

const Exercise: React.FC<ExerciseProps> = ({ onNavigateToCoach }) => {
  const [activeTab, setActiveTab] = useState<RoutineLevel>('stabilizzazione');
  const [todayScore, setTodayScore] = useState<ScoreEntry | null>(null);

  useEffect(() => {
    // Load Today's Score to auto-select the right tab
    const todayKey = new Date().toISOString().split('T')[0];
    const savedScores = getLocalStorageItem<ScoreEntry[]>('fibro_score_entries', []);
    const todayEntries = savedScores.filter(s => s.date === todayKey);
    if (todayEntries.length > 0) {
      setTodayScore(todayEntries[0]);
      setActiveTab(todayEntries[0].modalita.toLowerCase() as RoutineLevel);
    }
  }, []);

  const getLevelColor = (level: RoutineLevel) => {
    if (level === 'protezione') return 'border-orange-200 text-orange-800 bg-orange-100 hover:bg-orange-200';
    if (level === 'stabilizzazione') return 'border-blue-200 text-blue-800 bg-blue-100 hover:bg-blue-200';
    return 'border-green-200 text-green-800 bg-green-100 hover:bg-green-200';
  };

  const getLevelIcon = (level: RoutineLevel) => {
    if (level === 'protezione') return <ShieldIcon size={16} />;
    if (level === 'stabilizzazione') return <Activity size={16} />;
    return <ArrowUpRight size={16} />;
  };

  const routine = movementRoutines.find(r => r.level === activeTab)!;

  return (
    <div className="space-y-6 pb-12 fade-in">
      {/* Header Info */}
      <div className="bg-gradient-to-br from-brandPrimary to-brandPrimaryDark text-white p-6 rounded-3xl premium-shadow relative overflow-hidden">
        <PlayCircle className="absolute -right-4 -bottom-4 opacity-10" size={120} />
        <h2 className="text-3xl font-bold font-serif mb-2 leading-tight">Movimento Gentile</h2>
        <p className="text-white/90 text-sm leading-relaxed mb-4">
          La chiave è il Pacing: non arrivare mai al limite. Fermati al 70% delle tue energie.
        </p>
        {todayScore && (
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/20 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-widest opacity-80 mb-0.5">SCORE DI OGGI: {todayScore.score}</span>
              <span className="text-sm font-bold flex items-center gap-1.5"><CheckCircle2 size={16}/> Sei in {todayScore.modalita}</span>
            </div>
          </div>
        )}
      </div>

      {/* Routine Selector Tabs */}
      <div className="flex gap-2">
        {(['protezione', 'stabilizzazione', 'espansione'] as RoutineLevel[]).map(level => {
          const isActive = activeTab === level;
          return (
            <button
              key={level}
              onClick={() => setActiveTab(level)}
              className={`flex-1 py-3 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border-2
                ${isActive ? getLevelColor(level) : 'bg-white border-transparent text-textSecondary hover:bg-slate-50 opacity-60'}`}
            >
              {getLevelIcon(level)}
              <span className="text-xs font-bold uppercase tracking-wide">{level}</span>
            </button>
          )
        })}
      </div>

      {/* Routine Content */}
      <div className="bg-white p-6 rounded-3xl border border-brandPrimary/10 shadow-sm animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brandPrimaryTint/30 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        
        <h3 className="text-2xl font-bold font-serif text-brandPrimaryDark mb-1">{routine.title}</h3>
        <p className="text-sm font-bold text-textSecondary uppercase tracking-widest mb-4 flex items-center gap-2">
           <PlayCircle size={16} /> ~{routine.duration}
        </p>
        <p className="text-textPrimary text-[15px] leading-relaxed mb-6 bg-brandPrimaryTint/50 p-4 rounded-xl border border-brandPrimary/10">
          {routine.description}
        </p>

        {/* Safety Warning */}
        <div className="bg-orange-50 border border-orange-200 text-orange-900 p-4 rounded-xl flex items-start gap-3 mb-6 shadow-sm">
          <AlertCircle size={20} className="text-orange-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm font-medium leading-relaxed">{routine.safetyTip}</p>
        </div>

        {/* Exercises */}
        <div className="space-y-4">
          <h4 className="font-bold text-lg text-brandPrimaryDark mb-2 flex items-center gap-2">Protocollo Consigliato</h4>
          {routine.exercises.map((ex, idx) => (
            <div key={idx} className="bg-white border border-brandPrimary/10 p-4 rounded-2xl hover:border-brandPrimary/30 transition-all shadow-sm">
               <div className="flex items-start justify-between mb-2 gap-2">
                 <h5 className="font-bold text-[15px] text-textPrimary leading-tight">{ex.name}</h5>
                 <span className="text-xs font-bold text-brandPrimary bg-brandPrimaryTint px-2 py-1 rounded-md whitespace-nowrap">{ex.duration}</span>
               </div>
               <p className="text-[14px] text-textSecondary leading-relaxed mb-3">{ex.instruction}</p>
               <p className="text-xs font-medium text-brandPrimary bg-brandPrimary/5 px-2 py-1.5 rounded-lg inline-flex items-center gap-1.5">
                  <Info size={12}/> Focus: {ex.focus}
               </p>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-8">
           <button
            onClick={() => onNavigateToCoach(`Coach, sto provando la routine '${routine.title}'. Mi dai un consiglio su come farla senza superare la regola del 70% di sforzo?`)}
            className="w-full bg-brandPrimary text-white font-bold py-4 rounded-xl shadow-md hover:bg-brandPrimaryDark transition-all flex justify-center items-center gap-2"
           >
             <CheckCircle2 size={18} /> Chiedi consiglio al Coach
           </button>
        </div>
      </div>
    </div>
  );
};

export default Exercise;
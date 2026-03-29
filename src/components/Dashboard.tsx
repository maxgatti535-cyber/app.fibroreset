import React, { useState, useEffect, useMemo } from 'react';
import { getLocalStorageItem } from './utils';

// --- Types ---
type Unit = "mg" | "mcg" | "mL" | "tabs" | "drops" | "units";
type Slot = "Morning" | "Noon" | "Evening" | "Bedtime";

interface Medication {
  id: string;
  name: string;
  dose: number | '';
  unit: Unit;
  scheduleType: "times" | "slots";
  times?: string[]; 
  slots?: Slot[];
  slotTimes?: { [key in Slot]?: string };
  repeatDays: number[]; 
  startDateISO: string; 
  endDateISO?: string;
}

interface TakenRecord {
  medId: string;
  time: string;
}

interface TakenRecordsMap {
  [dateKey: string]: TakenRecord[];
}

interface ScoreEntry {
  id: string;
  date: string;
  score: number;
  modalita: 'Protezione' | 'Stabilizzazione' | 'Espansione';
}

const SLOT_TIMES: { [key in Slot]: string } = {
  Morning: '08:00',
  Noon: '12:00',
  Evening: '18:00',
  Bedtime: '22:00',
};

const getDailyKey = (date: Date) => date.toISOString().split('T')[0];

const dailyWins = [
  "Hai bevuto un bicchiere d'acqua in più oggi.",
  "Ti sei fermata a fare 5 respiri profondi.",
  "Hai ascoltato il tuo corpo e hai fatto una pausa.",
  "Hai scelto un pasto nutriente e antinfiammatorio.",
  "Hai ringraziato te stessa.",
  "Hai fatto un movimento dolce e gentile."
];

const Dashboard: React.FC<{ setScreen: (screen: string) => void }> = ({ setScreen }) => {
  const [waterCount, setWaterCount] = useState<number>(0);
  const [todayScore, setTodayScore] = useState<ScoreEntry | null>(null);
  const [nextMedInfo, setNextMedInfo] = useState<string>('Tutto preso per oggi.');
  
  const todayKey = getDailyKey(new Date());

  const dailyWin = useMemo(() => {
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    return dailyWins[dayOfYear % dailyWins.length];
  }, [todayKey]);

  useEffect(() => {
    setWaterCount(getLocalStorageItem(`water:${todayKey}`, 0));

    // Load today's score
    const savedScores = getLocalStorageItem<ScoreEntry[]>('fibro_score_entries', []);
    const todayEntries = savedScores.filter(s => s.date === todayKey);
    setTodayScore(todayEntries.length > 0 ? todayEntries[0] : null);

    // Load meds
    const savedMeds = getLocalStorageItem<Medication[]>('fibro_medications_v2', []);
    const savedTaken = getLocalStorageItem<TakenRecordsMap>('fibro_medsTaken_v2', {});

    if (savedMeds.length > 0) {
      const todaysTaken = savedTaken[todayKey] || [];
      const now = new Date();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayDay = today.getDay();
      const upcomingInstances: { name: string, time: string }[] = [];

      savedMeds.forEach(med => {
        const startDate = new Date(med.startDateISO + 'T00:00:00');
        const endDate = med.endDateISO ? new Date(med.endDateISO + 'T23:59:59') : null;
        const isActive = startDate <= today && (!endDate || today <= endDate) && med.repeatDays.includes(todayDay);
        if (!isActive) return;

        let times: string[] = [];
        if (med.scheduleType === 'times' && med.times) times = med.times;
        else if (med.scheduleType === 'slots' && med.slots) times = med.slots.map(slot => (med.slotTimes?.[slot]) || SLOT_TIMES[slot]);

        times.forEach(time => {
          if (!time) return;
          const [hours, minutes] = time.split(':').map(Number);
          const dueTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
          const wasTaken = todaysTaken.some(t => t.medId === med.id && t.time === time);

          if (!wasTaken && dueTime >= now) {
            upcomingInstances.push({ name: `${med.name} ${med.dose}${med.unit}`, time });
          }
        });
      });

      if (upcomingInstances.length > 0) {
        const nextDue = upcomingInstances.sort((a, b) => a.time.localeCompare(b.time))[0];
        setNextMedInfo(`${nextDue.name} alle ${nextDue.time}`);
      } else {
        setNextMedInfo('Tutto preso per oggi.');
      }
    } else {
      setNextMedInfo('Nessun farmaco inserito.');
    }

  }, [todayKey]);

  const updateWater = (newCount: number) => {
    const count = Math.max(0, newCount);
    setWaterCount(count);
    localStorage.setItem(`water:${todayKey}`, JSON.stringify(count));
  };

  const getScoreConfig = (mode: string) => {
    if (mode === 'Protezione') return { bg: 'from-orange-500/15 to-amber-400/10', badge: 'bg-orange-100 text-orange-700 border-orange-200', emoji: '🛡️', desc: "Il corpo ha bisogno di supporto. Riduci e proteggi." };
    if (mode === 'Stabilizzazione') return { bg: 'from-blue-500/15 to-cyan-400/10', badge: 'bg-blue-100 text-blue-700 border-blue-200', emoji: '⚖️', desc: "È possibile mantenere un ritmo gentile e sostenibile." };
    return { bg: 'from-emerald-500/15 to-green-400/10', badge: 'bg-green-100 text-green-700 border-green-200', emoji: '🌱', desc: "Il corpo è più disponibile. Pianifica piccoli obiettivi." };
  };

  // Water progress (goal: 8 glasses)
  const waterGoal = 8;
  const waterProgress = Math.min((waterCount / waterGoal) * 100, 100);

  return (
    <div className="space-y-4 pb-6">
      
      {/* Water Card */}
      <div className="glass-panel-strong p-5 rounded-2xl premium-shadow message-appear relative overflow-hidden">
        {/* Decorative water wave */}
        <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-cyan-300 transition-all duration-700 ease-out rounded-full"
            style={{ width: `${waterProgress}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-lg text-textPrimary flex items-center gap-2">
              <span className="text-xl">💧</span>Idratazione
            </h2>
            <p className="text-xs text-textMuted mt-0.5">L'acqua aiuta a sfiammare il corpo</p>
          </div>
          <span className="text-[11px] font-semibold text-textMuted bg-brandPrimaryTint/50 px-2 py-0.5 rounded-full">
            {waterCount}/{waterGoal}
          </span>
        </div>

        <div className="flex items-center justify-between glass-panel p-3 rounded-xl">
          <button
            onClick={() => updateWater(waterCount - 1)}
            className="bg-white text-brandPrimary rounded-xl h-11 w-11 flex items-center justify-center text-xl font-bold shadow-sm hover:shadow-md hover:bg-brandPrimaryTint active:scale-90 transition-all duration-200"
          >−</button>

          <div className="flex flex-col items-center">
            <span className="text-4xl font-black text-brandPrimary tabular-nums">{waterCount}</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-textMuted mt-0.5">Bicchieri</span>
          </div>

          <button
            onClick={() => updateWater(waterCount + 1)}
            className="bg-gradient-to-br from-brandPrimary to-brandPrimaryDark text-white rounded-xl h-11 w-11 flex items-center justify-center text-xl font-bold shadow-md hover:shadow-lg active:scale-90 transition-all duration-200"
          >+</button>
        </div>
      </div>

      {/* Score Card */}
      <div className="glass-panel-strong p-5 rounded-2xl premium-shadow message-appear" style={{ animationDelay: '100ms' }}>
        <h2 className="font-bold text-lg text-textPrimary mb-3 flex items-center gap-2">
          <span className="text-xl">⚡</span>Modalità di Oggi
        </h2>
        {todayScore ? (() => {
          const config = getScoreConfig(todayScore.modalita);
          return (
            <div className="flex flex-col items-center py-2">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${config.bg} flex flex-col items-center justify-center shadow-sm border border-white/50 mb-3`}>
                <span className="text-3xl font-black text-textPrimary">{todayScore.score}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-textMuted">/15</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${config.badge} flex items-center gap-1.5`}>
                <span>{config.emoji}</span>
                <span>{todayScore.modalita}</span>
              </div>
              <p className="text-center text-[13px] text-textSecondary mt-3 glass-panel p-3 rounded-xl leading-relaxed">
                {config.desc}
              </p>
            </div>
          );
        })() : (
          <div className="text-center py-5 glass-panel rounded-2xl">
            <p className="text-textMuted text-sm mb-3">Non hai ancora calcolato il tuo SCORE oggi.</p>
            <button
              onClick={() => setScreen('bp')}
              className="text-brandPrimary font-bold text-sm bg-white px-5 py-2 rounded-xl shadow-sm border border-brandPrimary/15 hover:shadow-md hover:border-brandPrimary/30 transition-all"
            >
              Calcola Ora →
            </button>
          </div>
        )}
      </div>

      {/* Medication Card */}
      <div className="glass-panel-strong p-4 rounded-2xl premium-shadow message-appear flex items-center gap-4" style={{ animationDelay: '200ms' }}>
        <div className="h-12 w-12 bg-gradient-to-br from-brandPrimary to-brandAccent rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="min-w-0">
          <h2 className="font-bold text-[11px] uppercase tracking-wider text-textMuted">Prossimo Farmaco</h2>
          <p className="text-[15px] font-bold text-textPrimary truncate">{nextMedInfo}</p>
        </div>
      </div>

      {/* Daily Win Card */}
      <div className="relative overflow-hidden rounded-2xl premium-shadow message-appear" style={{ animationDelay: '300ms' }}>
        <div className="bg-gradient-to-br from-brandPrimary via-brandPrimaryDark to-brandPrimary/90 text-white p-5 rounded-2xl">
          {/* Decorative circles */}
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/5"></div>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-white/5"></div>
          
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="p-2 bg-white/15 rounded-lg backdrop-blur-sm">
              <span className="text-xl">✨</span>
            </div>
            <h2 className="font-bold text-lg">Micro Vittoria</h2>
          </div>
          <p className="text-white/90 text-[15px] leading-relaxed font-medium relative z-10">"{dailyWin}"</p>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={() => setScreen('bp')}
        className="w-full btn-primary text-base flex items-center justify-center gap-2 animate-shimmer"
      >
        <span>⚡</span>
        <span>APRI FIBRO SCORE</span>
      </button>

    </div>
  );
};

export default Dashboard;

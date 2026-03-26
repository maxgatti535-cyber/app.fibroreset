import React, { useState, useEffect } from 'react';
import { getLocalStorageItem, setLocalStorageItem } from './utils';
import { Moon, Sun, CheckCircle2, ChevronRight, Check } from 'lucide-react';

interface ScoreEntry {
  id: string;
  date: string;
  score: number;
  modalita: 'Protezione' | 'Stabilizzazione' | 'Espansione';
}

interface SleepEntry {
  date: string; // YYYY-MM-DD
  ritualiScelti: string[];
  qualitaSonno?: number;
  energiaRisveglio?: number;
  doloreRisveglio?: number;
  note?: string;
}

const ritualiOptions = {
  ambienti: ["Luce soffusa o candele", "Temperatura stanza 18-20°C", "Silenzio o musica ambient"],
  corpo: ["Doccia o bagno caldo", "Stretching dolce 5 min", "Massaggio leggero a piedi/mani"],
  mente: ["Stop schermi 30 min prima", "Respiro 4-6 per 5 min", "Journaling serale (3 righe)"],
  nutrimento: ["Tisana rilassante", "Latte caldo con miele e cannella", "Qualche noce"]
};

const Progress: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sera' | 'mattina'>('sera');
  const [todayScore, setTodayScore] = useState<ScoreEntry | null>(null);
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([]);
  
  // States for Sera
  const [selectedRituals, setSelectedRituals] = useState<string[]>([]);
  
  // States for Mattina
  const [qualitaSonno, setQualitaSonno] = useState<number>(3);
  const [energiaRisveglio, setEnergiaRisveglio] = useState<number>(3);
  const [doloreRisveglio, setDoloreRisveglio] = useState<number>(3);
  const [noteRisveglio, setNoteRisveglio] = useState('');

  const todayKey = new Date().toISOString().split('T')[0];
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayKey = yesterdayDate.toISOString().split('T')[0];

  useEffect(() => {
    // Load Today's FIBRO SCORE
    const savedScores = getLocalStorageItem<ScoreEntry[]>('fibro_score_entries', []);
    const todayEntries = savedScores.filter(s => s.date === todayKey);
    if (todayEntries.length > 0) {
      setTodayScore(todayEntries[0]);
    }

    // Load Sleep Entries
    const savedSleep = getLocalStorageItem<SleepEntry[]>('fibro_sleep_entries', []);
    setSleepEntries(savedSleep);

    // Initial load for Sera
    const todaySleep = savedSleep.find(s => s.date === todayKey);
    if (todaySleep) {
      setSelectedRituals(todaySleep.ritualiScelti);
    }

    // Initial load for Mattina (checking yesterday's sleep to fill morning data)
    const yesterdaySleep = savedSleep.find(s => s.date === yesterdayKey);
    if (yesterdaySleep) {
      if (yesterdaySleep.qualitaSonno) setQualitaSonno(yesterdaySleep.qualitaSonno);
      if (yesterdaySleep.energiaRisveglio) setEnergiaRisveglio(yesterdaySleep.energiaRisveglio);
      if (yesterdaySleep.doloreRisveglio) setDoloreRisveglio(yesterdaySleep.doloreRisveglio);
      if (yesterdaySleep.note) setNoteRisveglio(yesterdaySleep.note);
    }
  }, [todayKey, yesterdayKey]);

  const toggleRitual = (ritual: string) => {
    setSelectedRituals(prev => 
      prev.includes(ritual) ? prev.filter(r => r !== ritual) : [...prev, ritual]
    );
  };

  const saveSera = () => {
    let newEntries = [...sleepEntries];
    const index = newEntries.findIndex(s => s.date === todayKey);
    if (index >= 0) {
      newEntries[index].ritualiScelti = selectedRituals;
    } else {
      newEntries.push({ date: todayKey, ritualiScelti: selectedRituals });
    }
    setLocalStorageItem('fibro_sleep_entries', newEntries);
    setSleepEntries(newEntries);
    alert('Rituali serali salvati! Domani mattina compila il risveglio.');
  };

  const saveMattina = () => {
    let newEntries = [...sleepEntries];
    const index = newEntries.findIndex(s => s.date === yesterdayKey);
    if (index >= 0) {
      newEntries[index] = {
        ...newEntries[index],
        qualitaSonno,
        energiaRisveglio,
        doloreRisveglio,
        note: noteRisveglio
      };
    } else {
      newEntries.push({
        date: yesterdayKey,
        ritualiScelti: [],
        qualitaSonno,
        energiaRisveglio,
        doloreRisveglio,
        note: noteRisveglio
      });
    }
    setLocalStorageItem('fibro_sleep_entries', newEntries);
    setSleepEntries(newEntries);
    alert('Risveglio salvato nel diario del sonno!');
  };

  const getRoutineSuggestion = () => {
    if (!todayScore) return { title: "Nessun punteggio oggi", desc: "Non hai calcolato il tuo Fibro Score oggi. Scegli comunque i rituali che preferisci se te la senti."};
    if (todayScore.modalita === 'Protezione') return { title: "Routine Minimale", desc: "Sei in Protezione. Scegli Calore e silenzio (3 passi, 5 minuti). Niente di più." };
    if (todayScore.modalita === 'Stabilizzazione') return { title: "Routine Completa", desc: "Sei in Stabilizzazione. Prepara il corpo: stop schermi, bevanda calda, stretch e respiro." };
    return { title: "Routine Mantenimento", desc: "Sei in Espansione. Anticipa l'orario, fai journaling, e compila il planner di domani." };
  };

  const routine = getRoutineSuggestion();

  return (
    <div className="space-y-6 pb-12 fade-in">
      {/* Header Info */}
      <div className="bg-gradient-to-br from-indigo-800 to-indigo-900 text-white p-6 rounded-3xl premium-shadow relative overflow-hidden">
        <Moon className="absolute -right-4 -bottom-4 opacity-10" size={100} />
        <h2 className="text-2xl font-bold font-serif mb-2">Sonno Riparatore</h2>
        <p className="text-white/80 text-sm leading-relaxed">
          Non serve farlo ogni sera. Scegli i rituali che preferisci. Piccoli gesti ripetuti nel tempo cambieranno la qualità del tuo sonno.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-brandPrimary/10 rounded-xl max-w-sm mx-auto">
        <button
          className={`flex-1 py-3 text-sm font-bold rounded-lg flex justify-center items-center gap-2 transition-all ${activeTab === 'sera' ? 'bg-white text-indigo-900 shadow-sm' : 'text-brandPrimary hover:bg-white/50'}`}
          onClick={() => setActiveTab('sera')}
        >
          <Moon size={16} /> Pagina Notte
        </button>
        <button
          className={`flex-1 py-3 text-sm font-bold rounded-lg flex justify-center items-center gap-2 transition-all ${activeTab === 'mattina' ? 'bg-white text-yellow-600 shadow-sm' : 'text-brandPrimary hover:bg-white/50'}`}
          onClick={() => setActiveTab('mattina')}
        >
          <Sun size={16} /> Al Risveglio
        </button>
      </div>

      {activeTab === 'sera' && (
        <div className="space-y-5 animate-fade-in">
          {/* Routine Suggestion */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-brandPrimary/10">
            <p className="text-[11px] font-bold uppercase tracking-widest text-textSecondary mb-1">Piano Consigliato in base allo Score</p>
            <h3 className="font-bold text-lg text-indigo-900 flex items-center gap-2">
              {routine.title}
            </h3>
            <p className="text-sm text-textSecondary mt-2">{routine.desc}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-brandPrimary/10 space-y-4">
            <h3 className="font-bold text-textPrimary text-lg mb-4">Checklist Rituali Serali</h3>
            
            {Object.entries(ritualiOptions).map(([categoria, rituals]) => (
              <div key={categoria} className="mb-4">
                <p className="text-xs font-bold uppercase text-brandPrimary mb-2">{categoria}</p>
                <div className="space-y-2">
                  {rituals.map(ritual => {
                    const isSelected = selectedRituals.includes(ritual);
                    return (
                      <button
                        key={ritual}
                        onClick={() => toggleRitual(ritual)}
                        className={`w-full text-left flex items-center gap-3 p-3 rounded-xl border transition-all ${isSelected ? 'border-indigo-500 bg-indigo-50 text-indigo-900 shadow-sm' : 'border-slate-200 bg-slate-50 text-textSecondary hover:bg-slate-100'}`}
                      >
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-transparent'}`}>
                          <Check size={14} />
                        </div>
                        <span className="text-[15px] font-medium leading-tight">{ritual}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={saveSera}
            className="w-full bg-indigo-800 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-indigo-900 active:scale-95 transition-all text-lg"
          >
            Salva Rituali di Oggi
          </button>
        </div>
      )}

      {activeTab === 'mattina' && (
        <div className="space-y-5 animate-fade-in">
           <div className="bg-yellow-50 p-5 rounded-2xl border border-yellow-200">
            <h3 className="font-bold text-lg text-yellow-800 mb-2">Il risveglio di oggi</h3>
            <p className="text-sm text-yellow-700/80 mb-6">Compilando questo pannello al mattino crei un collegamento tra la qualità dei rituali serali e la tua energia.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-yellow-900 mb-2">Qualità del sonno (1: pessima, 5: ottima)</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(v => (
                    <button 
                      key={v} onClick={() => setQualitaSonno(v)}
                      className={`flex-1 py-2 rounded-lg font-bold text-lg transition-all ${qualitaSonno === v ? 'bg-yellow-500 text-white shadow-md scale-105' : 'bg-white text-yellow-700 hover:bg-yellow-100'}`}
                    >{v}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-yellow-900 mb-2">Energia al risveglio (1: esaurita, 5: stabile)</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(v => (
                    <button 
                      key={v} onClick={() => setEnergiaRisveglio(v)}
                      className={`flex-1 py-2 rounded-lg font-bold text-lg transition-all ${energiaRisveglio === v ? 'bg-yellow-500 text-white shadow-md scale-105' : 'bg-white text-yellow-700 hover:bg-yellow-100'}`}
                    >{v}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-yellow-900 mb-2">Dolore al risveglio (1: intenso, 5: quasi assente)</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(v => (
                    <button 
                      key={v} onClick={() => setDoloreRisveglio(v)}
                      className={`flex-1 py-2 rounded-lg font-bold text-lg transition-all ${doloreRisveglio === v ? 'bg-yellow-500 text-white shadow-md scale-105' : 'bg-white text-yellow-700 hover:bg-yellow-100'}`}
                    >{v}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-yellow-900 mb-2">Note (Cosa ha funzionato / cosa no)</label>
                <textarea 
                  className="w-full p-3 bg-white rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none resize-none text-yellow-900" 
                  rows={3} 
                  value={noteRisveglio} 
                  onChange={e => setNoteRisveglio(e.target.value)} 
                  placeholder="Appunti per migliorare..."
                />
              </div>
            </div>
           </div>

           <button 
            onClick={saveMattina}
            className="w-full bg-yellow-500 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-yellow-600 active:scale-95 transition-all text-lg"
          >
            Salva Risveglio
          </button>
        </div>
      )}

      {/* Storico / Bilancio */}
      <div className="pt-6">
        <h3 className="font-bold text-lg text-textPrimary px-2 mb-4">Ultime Notti Registrate</h3>
        {sleepEntries.length === 0 ? (
          <p className="text-textSecondary text-sm p-4 bg-white/50 rounded-xl text-center border border-dashed border-brandPrimary/20">Non hai ancora compilato la pagina notte.</p>
        ) : (
          <div className="space-y-3">
            {sleepEntries.slice(0).reverse().map(entry => (
              <div key={entry.date} className="bg-white p-4 rounded-xl border border-brandPrimary/10 shadow-sm text-sm">
                <p className="font-bold text-brandPrimaryDark mb-2">{new Date(entry.date).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                <p className="text-textSecondary mb-2"><span className="font-semibold text-textPrimary">Rituali usati:</span> {entry.ritualiScelti.length > 0 ? entry.ritualiScelti.join(', ') : 'Nessuno'}</p>
                {entry.qualitaSonno && (
                  <div className="flex gap-4 mt-3 bg-brandPrimary/5 p-2 rounded-lg">
                    <span>Sonno: <b>{entry.qualitaSonno}</b></span>
                    <span>Energia: <b>{entry.energiaRisveglio}</b></span>
                    <span>Dolore: <b>{entry.doloreRisveglio}</b></span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Progress;
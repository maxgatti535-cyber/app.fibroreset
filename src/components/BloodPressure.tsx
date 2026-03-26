import React, { useState, useEffect } from 'react';
import { getLocalStorageItem, setLocalStorageItem } from './utils';
import { PlusCircle, Save, Calendar, ArrowLeft, Heart, Zap, Moon, Star, Target, Shield, ArrowUpRight, Activity } from 'lucide-react';

interface ScoreEntry {
  id: string;
  date: string;
  time: string;
  energia: number;
  recupero: number;
  dolore: number;
  score: number;
  modalita: 'Protezione' | 'Stabilizzazione' | 'Espansione';
  positiveMoment: string;
  microVictory: string;
}

const PainFatigueDiary: React.FC = () => {
  const [entries, setEntries] = useState<ScoreEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form State (1-5 scale)
  const [energia, setEnergia] = useState<number>(3);
  const [recupero, setRecupero] = useState<number>(3);
  const [dolore, setDolore] = useState<number>(3);
  const [positiveMoment, setPositiveMoment] = useState('');
  const [microVictory, setMicroVictory] = useState('');

  useEffect(() => {
    const saved = getLocalStorageItem<ScoreEntry[]>('fibro_score_entries', []);
    setEntries(saved.sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime()));
  }, []);

  const calculateScore = (e: number, r: number, d: number) => {
    // Invert dolcre so that 5 is best (Quasi assente) and 1 is worst (Molto intenso)
    // Wait, let's look at the PDF:
    // Energia: 1 (esaurita) to 5 (stabile)
    // Recupero: 1 (nessun) to 5 (profondo)
    // Dolore: 1 (molto intenso) to 5 (quasi assente)
    // Thus higher score is ALWAYS better!
    return e + r + d;
  };

  const currentScore = calculateScore(energia, recupero, dolore);
  let currentModalita: 'Protezione' | 'Stabilizzazione' | 'Espansione' = 'Stabilizzazione';
  if (currentScore <= 6) currentModalita = 'Protezione';
  else if (currentScore >= 11) currentModalita = 'Espansione';

  const handleSave = () => {
    const newEntry: ScoreEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      energia,
      recupero,
      dolore,
      score: currentScore,
      modalita: currentModalita,
      positiveMoment,
      microVictory,
    };

    const updated = [newEntry, ...entries];
    setLocalStorageItem('fibro_score_entries', updated);
    setEntries(updated);
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setEnergia(3);
    setRecupero(3);
    setDolore(3);
    setPositiveMoment('');
    setMicroVictory('');
  };

  const getScoreColor = (mode: string) => {
    if (mode === 'Protezione') return 'bg-orange-100 text-orange-800 border-orange-200';
    if (mode === 'Stabilizzazione') return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getScoreIcon = (mode: string) => {
    if (mode === 'Protezione') return <Shield size={16} />;
    if (mode === 'Stabilizzazione') return <Activity size={16} />;
    return <ArrowUpRight size={16} />;
  };

  const renderScale = (
    label: string, 
    value: number, 
    setValue: (v: number) => void, 
    icon: React.ReactNode, 
    desc1: string, 
    desc5: string
  ) => (
    <div className="mb-6 bg-white/50 p-5 rounded-2xl shadow-sm border border-brandPrimary/10">
      <div className="flex justify-between items-center mb-4">
        <label className="font-bold text-textPrimary flex items-center gap-2 text-lg">{icon} {label}</label>
        <div className="bg-brandPrimaryTint text-brandPrimary font-bold w-8 h-8 rounded-full flex items-center justify-center">
          {value}
        </div>
      </div>
      
      <div className="flex justify-between gap-1 mb-2">
        {[1, 2, 3, 4, 5].map(num => (
          <button
            key={num}
            onClick={() => setValue(num)}
            className={`flex-1 py-3 rounded-xl font-bold transition-all ${value === num ? 'bg-brandPrimary text-white shadow-md scale-105' : 'bg-white border border-brandPrimary/10 text-textSecondary hover:bg-brandPrimaryTint'}`}
          >
            {num}
          </button>
        ))}
      </div>
      
      <div className="flex justify-between text-xs text-textSecondary mt-2 font-medium px-1">
        <span className="w-1/3 text-left leading-tight">{desc1}</span>
        <span className="w-1/3 text-right leading-tight">{desc5}</span>
      </div>
    </div>
  );

  if (showForm) {
    return (
      <div className="p-4 space-y-4 pb-20 fade-in">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setShowForm(false)} className="bg-white p-2 rounded-full shadow-sm text-brandPrimary hover:scale-105 transition-all">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-bold font-serif text-brandPrimary">Nuovo Score</h2>
            <p className="text-sm text-textSecondary">Calcolatore RESET FIBRO SCORE™</p>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${getScoreColor(currentModalita)} flex items-center justify-between shadow-sm transition-colors duration-300`}>
          <div>
            <p className="text-xs uppercase tracking-widest font-bold opacity-70 mb-1">Score Attuale</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black">{currentScore}</span>
              <span className="text-sm font-bold bg-white/50 px-2 py-1 rounded-lg flex items-center gap-1">
                {getScoreIcon(currentModalita)} {currentModalita}
              </span>
            </div>
          </div>
        </div>

        {renderScale(
          "Livello di Energia", energia, setEnergia, 
          <Zap size={20} className="text-yellow-500"/>, 
          "1 - Esaurita, ogni gesto è uno sforzo", 
          "5 - Stabile, presente e funzionale"
        )}
        
        {renderScale(
          "Qualità del Recupero", recupero, setRecupero, 
          <Moon size={20} className="text-indigo-400"/>, 
          "1 - Nessun recupero, il riposo non ha aiutato", 
          "5 - Profondo, corpo rigenerato"
        )}

        {renderScale(
          "Dolore o Tensione", dolore, setDolore, 
          <Heart size={20} className="text-red-400"/>, 
          "1 - Molto intenso, domina la giornata", 
          "5 - Quasi assente, spazio per muoversi"
        )}

        <div className="bg-white/50 p-5 rounded-2xl shadow-sm border border-brandPrimary/10 space-y-4">
          <label className="font-bold text-textPrimary flex items-center gap-2 mb-2"><Star size={18} className="text-yellow-500"/> Momento positivo della giornata</label>
          <textarea 
            className="w-full p-3 bg-white border border-brandPrimary/20 rounded-xl focus:ring-2 focus:ring-brandPrimary/50 outline-none resize-none" 
            rows={2} 
            value={positiveMoment} 
            onChange={e => setPositiveMoment(e.target.value)} 
            placeholder="Opzionale..."/>

          <label className="font-bold text-textPrimary flex items-center gap-2 mb-2 mt-4"><Target size={18} className="text-brandPrimary"/> Micro-vittoria</label>
          <textarea 
            className="w-full p-3 bg-white border border-brandPrimary/20 rounded-xl focus:ring-2 focus:ring-brandPrimary/50 outline-none resize-none" 
            rows={2} 
            value={microVictory} 
            onChange={e => setMicroVictory(e.target.value)} 
            placeholder="Opzionale..."/>
        </div>

        <button 
          onClick={handleSave}
          className="w-full bg-brandPrimary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-brandPrimaryDark transition-colors active:scale-95"
        >
          <Save size={20} /> Salva Score
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 fade-in">
      <div className="text-center mb-8 bg-gradient-to-br from-brandPrimary to-brandPrimaryDark text-white p-6 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-bold font-serif mb-2">My FIBRO SCORE™</h2>
        <p className="text-white/90 text-sm">"Pochi secondi ogni giorno. Tre numeri. Un punteggio. Una direzione chiara."</p>
      </div>

      <button 
        onClick={() => setShowForm(true)}
        className="w-full bg-white text-brandPrimary border-2 border-brandPrimary py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:bg-brandPrimary hover:text-white transition-all group"
      >
        <PlusCircle size={20} className="group-hover:rotate-90 transition-transform" /> Calcola Score di Oggi
      </button>

      <div className="mt-8">
        <h3 className="text-lg font-bold text-textPrimary flex items-center gap-2 mb-4"><Calendar size={20}/> Storico (30 Giorni)</h3>
        
        {entries.length === 0 ? (
          <div className="text-center py-10 bg-white/50 rounded-2xl border border-dashed border-brandPrimary/30">
            <p className="text-textSecondary">Nessun punteggio ancora.<br/>Calcola il tuo primo SCORE oggi.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map(entry => (
              <div key={entry.id} className="bg-white p-5 rounded-2xl shadow-sm border border-brandPrimary/10 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center border-b border-brandPrimary/5 pb-3 mb-3">
                  <div className="font-bold text-textPrimary">
                    {new Date(entry.date).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </div>
                  <div className="text-xs text-textSecondary bg-brandPrimary/5 px-2 py-1 rounded-md">{entry.time}</div>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 ${getScoreColor(entry.modalita)}`}>
                    <span className="text-2xl font-black">{entry.score}</span>
                  </div>
                  <div>
                    <span className={`text-xs font-bold uppercase px-2 py-1 rounded-md mb-1 inline-block ${getScoreColor(entry.modalita)}`}>
                      {entry.modalita}
                    </span>
                    <div className="flex gap-3 text-xs text-textSecondary font-medium mt-1">
                      <span className="flex items-center gap-1"><Zap size={12}/> E:{entry.energia}</span>
                      <span className="flex items-center gap-1"><Moon size={12}/> R:{entry.recupero}</span>
                      <span className="flex items-center gap-1"><Heart size={12}/> D:{entry.dolore}</span>
                    </div>
                  </div>
                </div>

                {entry.microVictory && (
                  <div className="bg-brandPrimaryTint/30 p-3 rounded-xl border border-brandPrimary/10">
                    <p className="text-brandPrimaryDark font-semibold flex items-center gap-1 text-[11px] uppercase tracking-wider"><Star size={12}/> Micro-vittoria</p>
                    <p className="text-textSecondary mt-1 text-sm">{entry.microVictory}</p>
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

export default PainFatigueDiary;
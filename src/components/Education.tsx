import React, { useState } from 'react';
import { flareCards, FlareCard } from './educationData';
import { ArrowLeft, AlertCircle, Shield, CheckCircle2, Clock, Activity, MessageSquare } from 'lucide-react';

interface EducationProps {
  onNavigateToCoach: (prompt: string) => void;
}

const FlareDetail: React.FC<{ flare: FlareCard; onBack: () => void; onAskCoach: (prompt: string) => void }> = ({ flare, onBack, onAskCoach }) => {
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <header className="flex items-start gap-4 border-b border-brandPrimary/10 pb-4">
        <button
          onClick={onBack}
          className="p-2 bg-white text-brandPrimary rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all mt-1 flex-shrink-0"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <span className="text-sm font-bold text-brandAccent uppercase tracking-wider bg-brandAccent/10 px-3 py-1 rounded-full mb-2 inline-block">
            Scheda Flare {flare.id}
          </span>
          <h2 className="text-2xl font-bold font-serif text-brandPrimaryDark mb-1 leading-tight">{flare.title}</h2>
          <p className="text-textSecondary text-sm font-medium flex items-center gap-1"><Clock size={14}/> {flare.time}</p>
        </div>
      </header>

      {/* Segnali Comuni */}
      <div className="bg-[#FFF8F3] p-5 rounded-2xl shadow-sm border border-orange-200">
        <h3 className="font-bold text-lg text-orange-900 flex items-center gap-2 mb-3">
          <AlertCircle size={20} className="text-orange-500" /> Segnali comuni
        </h3>
        <ul className="space-y-2">
          {flare.signals.map((signal, idx) => (
            <li key={idx} className="flex items-start gap-2 text-orange-800/90 text-[15px]">
              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0"></div>
              <span>{signal}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Protocollo Rapido */}
      <div>
        <h3 className="font-bold text-xl text-brandPrimary flex items-center gap-2 mb-4 px-1">
          <Shield size={24} /> Protocollo Rapido 4 Passi
        </h3>
        <div className="space-y-3">
          {flare.protocol.map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-brandPrimary/10 flex gap-4 items-start group hover:border-brandPrimary/30 transition-colors">
              <div className="bg-brandPrimaryTint text-brandPrimary w-10 h-10 rounded-full flex items-center justify-center font-bold font-serif text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                {idx + 1}
              </div>
              <div className="pt-1">
                <p className="font-bold text-textPrimary text-[15px] mb-0.5">{item.step.replace(/^\d+\.\s*/, '')}</p>
                <p className="text-textSecondary text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Note Score e Journal */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-brandPrimary/10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-100 p-2 rounded-lg text-yellow-700">
            <Activity size={20} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-textSecondary font-bold">RESET FIBRO SCORE™ Consigliato</p>
            <p className="font-bold text-brandPrimaryDark">{flare.score}</p>
          </div>
        </div>
        <hr className="border-brandPrimary/5"/>
        <div className="flex items-start gap-3">
          <div className="bg-blue-50 p-2 rounded-lg text-blue-600 mt-1">
            <MessageSquare size={20} />
          </div>
          <div className="flex-1">
            <p className="text-[11px] uppercase tracking-wider text-textSecondary font-bold mb-1">Cosa annotare nel diario</p>
            <p className="font-medium text-textPrimary text-sm italic">"{flare.journalPrompt}"</p>
          </div>
        </div>
      </div>

      {/* Azione Coach */}
      <div className="pt-4">
        <button
          onClick={() => onAskCoach(`Coach, sto vivendo un ${flare.title}. Mi guidi nel protocollo?`)}
          className="w-full text-brandPrimary bg-brandPrimaryTint/50 font-bold py-4 px-4 rounded-xl hover:bg-brandPrimaryTint transition-colors flex justify-center items-center gap-2 border border-brandPrimary/20"
        >
          <CheckCircle2 size={20} /> Chiedi supporto al Coach
        </button>
        <p className="text-center text-xs text-textMuted mt-3">Anche un solo passo è già un gesto di cura verso te stessa.</p>
      </div>
    </div>
  );
};

const Education: React.FC<EducationProps> = ({ onNavigateToCoach }) => {
  const [activeFlareId, setActiveFlareId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const activeFlare = flareCards.find(f => f.id === activeFlareId);

  const filteredFlares = flareCards.filter(flare => {
    if (!searchTerm.trim()) return true;
    const lowerSearch = searchTerm.toLowerCase();
    return flare.title.toLowerCase().includes(lowerSearch) || flare.description.toLowerCase().includes(lowerSearch);
  });

  if (activeFlare) {
    return <FlareDetail flare={activeFlare} onBack={() => setActiveFlareId(null)} onAskCoach={onNavigateToCoach} />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-brandPrimary to-brandAccent text-white p-6 rounded-3xl premium-shadow message-appear relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 opacity-10">
          <Shield size={100} />
        </div>
        <h2 className="text-3xl font-bold font-serif mb-2">Kit Flare Reset</h2>
        <p className="text-white/90 text-sm leading-relaxed">
          Nei momenti in cui il dolore aumenta o l’energia crolla, questo kit ti offre sequenze semplici e guidate per rallentare il sovraccarico.
        </p>
        <p className="text-brandAccent mt-3 text-xs uppercase tracking-widest font-bold">Seleziona un'emergenza</p>
      </div>
      
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cerca un sintomo (es. 'Ansia' o 'Nebbia')"
          className="w-full px-4 py-4 rounded-2xl border border-brandPrimary/20 bg-white shadow-sm text-sm focus:border-brandPrimary focus:ring-1 focus:ring-brandPrimary outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filteredFlares.map((flare, i) => (
          <button
            key={flare.id}
            onClick={() => setActiveFlareId(flare.id)}
            className="bg-white p-4 rounded-2xl shadow-sm border border-brandPrimary/5 flex flex-col items-start hover:shadow-md hover:border-brandPrimary/30 transition-all text-left group"
            style={{ animationDelay: `${i * 30}ms` }}
          >
            <div className="flex justify-between items-start w-full mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brandPrimary/60 bg-brandPrimaryTint/50 px-2 py-0.5 rounded-md">
                Scheda {flare.id}
              </span>
            </div>
            <h3 className="font-bold text-textPrimary text-[15px] group-hover:text-brandPrimary transition-colors">{flare.title}</h3>
            <p className="text-textSecondary text-[13px] mt-1 line-clamp-2">{flare.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Education;
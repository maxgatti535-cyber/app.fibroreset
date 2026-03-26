import React from 'react';

interface LegalPageProps {
  setScreen: React.Dispatch<React.SetStateAction<any>>;
}

const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const TermsOfService: React.FC<LegalPageProps> = ({ setScreen }) => {
  return (
    <div className="space-y-4 pb-12 fade-in text-left">
      <button onClick={() => setScreen('home')} className="flex items-center gap-1 text-[15px] text-textSecondary font-bold hover:text-brandPrimary transition-colors mb-4 bg-transparent border-none p-0 cursor-pointer">
        <BackIcon /> Torna alla Home
      </button>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-brandPrimary/10 space-y-5">
        <h1 className="text-2xl font-bold font-serif text-brandPrimaryDark">Termini e Condizioni</h1>
        
        <div className="prose text-textSecondary text-[15px] leading-relaxed max-w-none space-y-4">
          <p><strong>Ultimo Aggiornamento:</strong> Maggio 2026</p>

          <p>
            Benvenuta nell'App <strong>Metodo RESET FIBRO™</strong> fornita da Equilibria Reset™. Accedendo o utilizzando l'applicazione, accetti di essere vincolata ai seguenti Termini d'Uso.
          </p>

          <h2 className="text-lg font-bold text-textPrimary mt-6 border-b border-slate-100 pb-2">1. Disclaimer Medico (MOLTO IMPORTANTE)</h2>
          <div className="font-medium text-amber-800 bg-amber-50 p-4 rounded-xl border border-amber-200 shadow-sm leading-relaxed">
            <p><strong>Questa applicazione è stata creata esclusivamente a scopo educativo, informativo e di benessere generale.</strong></p>
            <p className="mt-2">
              NON è un dispositivo medico e NON fornisce consulenze mediche, diagnosi o raccomandazioni terapeutiche per la fibromialgia o per altre patologie. Qualsiasi indicazione su farmaci, integratori, movimenti o diete è da considerarsi puramente orientativa.
            </p>
          </div>
          <p>
            Per qualsiasi decisione riguardante la tua salute, l'interruzione o l'inizio di una terapia, il cambio di farmaci o integratori, <strong>devi consultare sempre e solo il tuo medico curante</strong> o un reumatologo/specialista qualificato. Non ignorare o ritardare mai una visita medica a causa delle informazioni lette o suggerite da questa applicazione o dal "Coach AI".
          </p>

          <h2 className="text-lg font-bold text-textPrimary mt-6 border-b border-slate-100 pb-2">2. Utilizzo dell'App e Licenza</h2>
          <p>
            Ti viene concessa una licenza personale, non esclusiva e non trasferibile per utilizzare l'app a scopo privato e non commerciale. Qualsiasi tentativo di copiare, decompilare o rivendere i contenuti o il codice (incluso il Kit Flare, Ricettario o l'algoritmo del Fibro Score) è severamente vietato e protetto da copyright.
          </p>

          <h2 className="text-lg font-bold text-textPrimary mt-6 border-b border-slate-100 pb-2">3. Responsabilità sui Dati</h2>
          <p>
            I dati inseriti nell'app vengono archiviati solo nella memoria del tuo browser/telefono (local storage). Sei l'unica responsabile per i backup dei dati (tramite la funzione "Esporta" delle Impostazioni) e per la sicurezza fisica del tuo dispositivo. Equilibria Reset non può recuperare dati cancellati per errore o in caso di guasto del telefono, in quanto non salviamo nulla sui nostri server.
          </p>

          <h2 className="text-lg font-bold text-textPrimary mt-6 border-b border-slate-100 pb-2">4. Limitazione di Responsabilità</h2>
          <p>
            Nella misura massima consentita dalla legge, <strong>Equilibria Reset™</strong> e i suoi fondatori non potranno essere ritenuti responsabili per eventuali danni diretti, indiretti, temporanei o permanenti (inclusi peggioramenti dei sintomi della fibromialgia o perdite di dati) che potrebbero derivare dall'uso mal interpretato degli strumenti o dal malfunzionamento software dell'App.
          </p>

          <h2 className="text-lg font-bold text-textPrimary mt-6 border-b border-slate-100 pb-2">5. Contatti</h2>
          <p>
            Per qualsiasi chiarimento in merito a questi Termini legali:
            <br />
            <a href="mailto:supporto@equilibriareset.com" className="text-brandPrimary font-bold hover:underline">supporto@equilibriareset.com</a>
          </p>

          <div className="pt-6 pb-2 text-sm text-textMuted text-center">
             © 2026 Equilibria Reset™ — Tutti i diritti riservati
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;

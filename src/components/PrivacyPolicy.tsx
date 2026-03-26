import React from 'react';

interface LegalPageProps {
  setScreen: React.Dispatch<React.SetStateAction<any>>;
}

const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const PrivacyPolicy: React.FC<LegalPageProps> = ({ setScreen }) => {
  return (
    <div className="space-y-4 pb-12 fade-in">
      <button onClick={() => setScreen('home')} className="flex items-center gap-1 text-[15px] text-textSecondary font-bold hover:text-brandPrimary transition-colors bg-transparent border-none p-0 cursor-pointer">
        <BackIcon /> Torna alla Home
      </button>
      
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-brandPrimary/10 space-y-5 text-left">
        <h1 className="text-2xl font-bold font-serif text-brandPrimaryDark">Privacy Policy & Cookie Policy</h1>
        
        <div className="prose text-textSecondary text-[15px] leading-relaxed max-w-none space-y-4">
          <p><strong>Ultimo Aggiornamento:</strong> Maggio 2026</p>

          <p>
            In <strong>Equilibria Reset™</strong> la tua privacy è una priorità assoluta. Questa pagina spiega in modo trasparente e semplice come gestiamo i tuoi dati all'interno dell'app Metodo RESET FIBRO™.
          </p>

          <h2 className="text-lg font-bold text-textPrimary mt-6 border-b border-slate-100 pb-2">1. Archiviazione Dati (Solo in Locale)</h2>
          <p>
            Per garantirti la massima sicurezza e privacy, questa applicazione salva i tuoi dati (livelli di dolore, sintomi, diari del sonno, farmaci) <strong>esclusivamente sul tuo dispositivo</strong>. 
            Noi non abbiamo accesso ai tuoi dati. Nessuna informazione personale viene trasmessa o salvata sui nostri server.
          </p>

          <h2 className="text-lg font-bold text-textPrimary mt-6 border-b border-slate-100 pb-2">2. Condivisione dei Dati</h2>
          <p>
            Poiché i dati non lasciano mai il tuo telefono, noi <strong>non condividiamo, vendiamo o trasferiamo</strong> alcuna informazione a terze parti (come agenzie pubblicitarie o assicurazioni).
          </p>
          <p>
            Se hai inserito l'email all'inizio per iscriverti alla newsletter, quella viene gestita dal nostro provider di email marketing nel rispetto del GDPR e puoi disiscriverti in ogni momento. L'email non è collegata ai tuoi dati clinici dell'app.
          </p>

          <h2 className="text-lg font-bold text-textPrimary mt-6 border-b border-slate-100 pb-2">3. Cookie Policy & Tracciamento</h2>
          <p>
            Questa app <strong>non utilizza cookie di profilazione</strong> o tracker pubblicitari (es. Google Analytics o Meta Pixel).
          </p>
          <p>
            Utilizziamo esclusivamente tecnologie tecniche locali (chiamate <em>localStorage</em> o <em>IndexedDB</em>) strettamente necessarie per far funzionare l'applicazione, ad esempio per ricordare le tue preferenze di sistema, il tuo Fibro Score e i tuoi dati, affinché non scompaiano chiudendo l'app.
          </p>

          <h2 className="text-lg font-bold text-textPrimary mt-6 border-b border-slate-100 pb-2">4. I Tuoi Diritti (GDPR)</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Accesso e Modifica:</strong> Puoi visualizzare e modificare tutti i tuoi dati o impostazioni direttamente dall'app.</li>
            <li><strong>Cancellazione Totale:</strong> Andando in Impostazioni, puoi cliccare su "Elimina tutti i dati dell'app" per cancellare istantaneamente tutto dal tuo telefono.</li>
            <li><strong>Esportazione:</strong> Puoi creare un backup manuale (export in JSON) sempre dal menu Impostazioni.</li>
          </ul>

          <h2 className="text-lg font-bold text-textPrimary mt-6 border-b border-slate-100 pb-2">5. Intelligenza Artificiale (AI Coach)</h2>
          <p>
            Quando utilizzi la funzione "Coach Fibro", il testo che scrivi viene inviato in modo anonimo tramite un server sicuro all'Intelligenza Artificiale (Google Gemini) al solo scopo di generare la risposta. I dati inviati al Coach vengono distrutti subito dopo e non sono usati per allenare i modelli di Google. Non inserire dati personali (es. nome cognome) nelle chat con il Coach se vuoi la massima privacy.
          </p>

          <h2 className="text-lg font-bold text-textPrimary mt-6 border-b border-slate-100 pb-2">6. Contatti</h2>
          <p>
            Per qualsiasi dubbio riguardo alla tua privacy, scrivici a:
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

export default PrivacyPolicy;

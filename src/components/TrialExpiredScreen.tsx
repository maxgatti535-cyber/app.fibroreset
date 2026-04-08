import React from 'react';

const TrialExpiredScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden bg-background">
      {/* Decorative orbs */}
      <div className="orb orb-purple w-48 h-48 -top-20 -right-20 opacity-25"></div>
      <div className="orb orb-azure w-36 h-36 bottom-20 -left-16 opacity-20" style={{ animationDelay: '4s' }}></div>

      <div className="glass-panel-strong p-7 rounded-3xl premium-shadow-elevated w-full max-w-md text-center relative z-10 animate-scale-in gradient-border">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-2xl flex items-center justify-center mb-6 border border-brandPrimary/20">
          <svg className="w-10 h-10 text-brandPrimary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold gradient-text mb-3 font-serif leading-tight">
          Periodo di prova<br/>terminato
        </h1>
        
        <p className="text-[15px] text-textSecondary mb-6 leading-relaxed">
          Speriamo che le ultime 2 settimane con <strong>Metodo RESET FIBRO™</strong> ti abbiano aiutato a sentirti meglio.
        </p>

        <div className="bg-brandPrimary/5 border border-brandPrimary/10 rounded-2xl p-4 mb-8 text-left">
          <p className="text-sm text-textPrimary leading-relaxed">
            Per continuare ad usare l'app, sblocca la versione completa o lasciaci una videorecensione raccontandoci i tuoi progressi!
          </p>
        </div>

        <div className="space-y-3">
          <button className="w-full btn-primary text-base py-3.5 min-h-[52px]">
            Sblocca Accesso
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrialExpiredScreen;

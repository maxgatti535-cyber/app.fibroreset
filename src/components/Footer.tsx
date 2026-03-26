import React from 'react';

interface FooterProps {
  setScreen: (screen: string) => void;
}

const Footer: React.FC<FooterProps> = ({ setScreen }) => {
  return (
    <footer
      className="w-full px-4 pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] mt-auto"
      style={{
        background: 'rgba(255, 255, 255, 0.45)',
        backdropFilter: 'blur(24px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
        borderTop: '1px solid rgba(108, 63, 153, 0.06)',
      }}
      aria-label="App footer"
    >
      <div className="max-w-[430px] mx-auto text-center space-y-3">
        {/* Brand */}
        <p className="text-sm font-bold gradient-text tracking-wide">
          Metodo RESET FIBRO™ · v1.0
        </p>

        {/* Disclaimer */}
        <p className="text-xs text-textMuted leading-relaxed px-2">
          L'app ha finalità educative e di benessere. Non sostituisce il parere medico, diagnosi o terapie.
          In caso di emergenza, contatta il tuo medico curante o il pronto soccorso.
        </p>

        {/* Links */}
        <div className="flex justify-center items-center gap-3 pt-1">
          <button 
            onClick={() => setScreen('privacy')} 
            className="text-xs font-semibold text-brandPrimary/70 hover:text-brandPrimary transition-colors focus:outline-none"
          >
            Privacy & Cookie
          </button>
          <span className="text-brandPrimary/20 text-xs" aria-hidden="true">·</span>
          <button 
            onClick={() => setScreen('terms')} 
            className="text-xs font-semibold text-brandPrimary/70 hover:text-brandPrimary transition-colors focus:outline-none"
          >
            Termini
          </button>
          <span className="text-brandPrimary/20 text-xs" aria-hidden="true">·</span>
          <a 
            href="mailto:supporto@equilibriareset.com" 
            className="text-xs font-semibold text-brandPrimary/70 hover:text-brandPrimary transition-colors focus:outline-none"
          >
            Contatti
          </a>
        </div>

        {/* Copyright */}
        <p className="text-[11px] text-textMuted/60 pt-1">
          © 2026 equilibriareset.com
        </p>
      </div>
    </footer>
  );
};

export default Footer;
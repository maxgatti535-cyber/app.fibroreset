import React, { useState } from 'react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && consentChecked && !isSubmitting) {
      setIsSubmitting(true);
      localStorage.setItem('profile.name', JSON.stringify(name));
      localStorage.setItem('profile.email', JSON.stringify(email));
      // Save trial start date only if not already set (avoid resetting on re-registration)
      if (!localStorage.getItem('trial.startDate')) {
        localStorage.setItem('trial.startDate', JSON.stringify(new Date().toISOString()));
      }
      setIsSubmitting(false);
      onComplete();
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = 'none';
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="orb orb-purple w-48 h-48 -top-20 -right-20 opacity-25"></div>
      <div className="orb orb-azure w-36 h-36 bottom-20 -left-16 opacity-20" style={{ animationDelay: '4s' }}></div>
      <div className="orb orb-pink w-28 h-28 bottom-40 right-10 opacity-15" style={{ animationDelay: '8s' }}></div>

      <div className="glass-panel-strong p-7 rounded-3xl premium-shadow-elevated w-full max-w-md text-center relative z-10 animate-scale-in gradient-border">
        <img 
          src="/logo.png" 
          alt="Equilibria Reset logo" 
          className="h-20 w-auto mb-5 mx-auto drop-shadow-md"
          onError={handleImageError}
        />

        <h1 className="text-3xl font-extrabold gradient-text mb-2 font-serif leading-tight">
          Benvenuto in<br/>Metodo RESET FIBRO™
        </h1>
        <p className="text-base text-textSecondary mb-7 max-w-sm mx-auto leading-relaxed">
          Un approccio gentile e progressivo per riprendere il controllo della tua vita.
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-4 text-left">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-textSecondary mb-1.5">Nome Completo</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full rounded-xl border border-border bg-white/60 backdrop-blur-sm shadow-sm text-[15px] h-12 px-4 text-textPrimary placeholder:text-textMuted/50 focus:border-brandPrimary/30 focus:ring-2 focus:ring-brandPrimary/15 transition-all"
              placeholder="Il tuo nome..."
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-textSecondary mb-1.5">Indirizzo Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-xl border border-border bg-white/60 backdrop-blur-sm shadow-sm text-[15px] h-12 px-4 text-textPrimary placeholder:text-textMuted/50 focus:border-brandPrimary/30 focus:ring-2 focus:ring-brandPrimary/15 transition-all"
              placeholder="la-tua@email.com"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-start gap-3 pt-1">
            <input
              type="checkbox"
              id="consent"
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              className="h-5 w-5 rounded border-border text-brandPrimary focus:ring-brandPrimary mt-0.5 accent-brandPrimary"
              required
              disabled={isSubmitting}
            />
            <label htmlFor="consent" className="text-[13px] text-textMuted leading-relaxed">
              Comprendo che questa app ha fini educativi e di benessere e non sostituisce il parere medico. I miei dati sono salvati solo su questo dispositivo. Accetto i <a href="/terms" target="_blank" className="text-brandPrimary underline font-medium">Termini</a> e la <a href="/privacy" target="_blank" className="text-brandPrimary underline font-medium">Privacy Policy</a>.
            </label>
          </div>

          <button
            type="submit"
            disabled={!name || !email || !consentChecked || isSubmitting}
            className="w-full btn-primary text-base py-3.5 min-h-[52px] disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Salvataggio...
              </span>
            ) : 'Inizia il tuo Percorso →'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WelcomeScreen;
import React, { useState, useEffect } from 'react';
import { getLocalStorageItem } from './utils';
import { SettingsIcon } from './icons';

interface HeaderProps {
  screen: string;
  setScreen: (screen: string) => void;
  title?: string;
}

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  e.currentTarget.style.display = 'none';
};

type ThemeSetting = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

const resolveHeaderTheme = (setting: ThemeSetting): ResolvedTheme => {
  if (setting === 'dark') return 'dark';
  if (setting === 'system') {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }
  return 'light';
};

const Header: React.FC<HeaderProps> = ({ screen, setScreen, title }) => {
  const [headerTheme, setHeaderTheme] = useState<ResolvedTheme>(() => {
    const initialSetting = getLocalStorageItem<ThemeSetting>('display.theme', 'light');
    return resolveHeaderTheme(initialSetting);
  });

  useEffect(() => {
    const updateTheme = () => {
      const storedTheme = getLocalStorageItem<ThemeSetting>('display.theme', 'light');
      setHeaderTheme(resolveHeaderTheme(storedTheme));
    };

    window.addEventListener('settings-changed', updateTheme);
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateTheme);
    }

    return () => {
      window.removeEventListener('settings-changed', updateTheme);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updateTheme);
      }
    };
  }, []);

  const isDark = headerTheme === 'dark';

  const Logo = () => (
    <img
      src="/logo.png"
      alt="Equilibria Reset logo"
      className={`h-[36px] w-auto flex-shrink-0 transition-all duration-300 hover:scale-105 ${isDark ? 'brightness-0 invert' : ''}`}
      onError={handleImageError}
    />
  );

  const BackButton = () => (
    <button
      onClick={() => setScreen('home')}
      className={`p-2.5 -ml-2 rounded-xl transition-all duration-300 active:scale-90 ${
        isDark 
          ? 'text-white/90 hover:bg-white/10' 
          : 'text-textPrimary hover:bg-brandPrimary/5'
      }`}
      aria-label="Indietro"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );

  const SettingsButton = () => (
    <button
      onClick={() => setScreen('settings')}
      className={`p-2.5 rounded-xl transition-all duration-300 active:scale-90 ${
        isDark 
          ? 'text-white/80 hover:bg-white/10 hover:text-white' 
          : 'text-textMuted hover:bg-brandPrimary/5 hover:text-brandPrimary'
      }`}
      aria-label="Impostazioni"
      role="button"
    >
      <SettingsIcon className="h-[22px] w-[22px]" />
    </button>
  );

  return (
    <header
      className={`sticky top-0 z-30 px-4 transition-all duration-500 ${
        isDark 
          ? 'text-white' 
          : 'text-textPrimary'
      }`}
      style={{ 
        paddingTop: `env(safe-area-inset-top)`,
        background: isDark 
          ? 'rgba(25, 22, 35, 0.82)' 
          : 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(24px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
        borderBottom: isDark 
          ? '1px solid rgba(255,255,255,0.08)' 
          : '1px solid rgba(108, 63, 153, 0.08)',
      }}
    >
      <div className="h-14 flex items-center justify-between">
        {screen !== 'home' ? (
          <>
            {/* Left: Back button */}
            <div className="flex-shrink-0 w-10 flex justify-start">
              <BackButton />
            </div>

            {/* Center: Logo + Title */}
            <div className="flex-grow flex justify-center overflow-hidden">
              <button
                onClick={() => setScreen('home')}
                className="flex items-center gap-x-2 group"
                aria-label="Torna alla home"
              >
                <Logo />
                <h1 className="text-lg font-bold truncate group-hover:text-brandPrimary transition-colors">{title}</h1>
              </button>
            </div>

            {/* Right: Settings */}
            <div className="flex-shrink-0 w-10 flex justify-end">
              <SettingsButton />
            </div>
          </>
        ) : (
          <>
            {/* Home: Logo & title left, settings right */}
            <button
              onClick={() => setScreen('home')}
              className="flex items-center gap-x-2.5 group"
              aria-label="Metodo RESET FIBRO Home"
            >
              <Logo />
              <div className="flex flex-col">
                <h1 className="text-lg font-extrabold font-serif gradient-text leading-tight">Metodo RESET FIBRO</h1>
              </div>
            </button>
            <SettingsButton />
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
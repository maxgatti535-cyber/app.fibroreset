import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import WelcomeScreen from './components/WelcomeScreen'; // Direct import for faster startup
import { getLocalStorageItem } from './components/utils';
import {
  DashboardIcon,
  CoachIcon,
  BPIcon,
  MedsIcon,
  MealIcon,
  EducationIcon,
  ExerciseIcon,
  ProgressIcon,
  RemindersIcon,
  ChevronRightIcon
} from './components/icons';

// Lazy load other components
const Dashboard = lazy(() => import('./components/Dashboard'));
const AICoach = lazy(() => import('./components/AIChat'));
const BloodPressure = lazy(() => import('./components/BloodPressure'));
const Medications = lazy(() => import('./components/Medications'));
const MealPlan = lazy(() => import('./components/Meals'));
const Education = lazy(() => import('./components/Education'));
const Exercise = lazy(() => import('./components/Exercise'));
const Progress = lazy(() => import('./components/Progress'));
const Settings = lazy(() => import('./components/Settings'));
const ProfileSetupScreen = lazy(() => import('./components/ProfileSetupScreen'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));
const Reminders = lazy(() => import('./components/Reminders'));

// Function to apply settings from localStorage to the document
const applyGlobalSettings = () => {
  try {
    const root = document.documentElement;

    // Font Scale
    root.classList.remove('font-sm', 'font-lg');
    const fontScale = getLocalStorageItem<'sm' | 'md' | 'lg'>('display.fontScale', 'md');
    if (fontScale === 'sm') root.classList.add('font-sm');
    if (fontScale === 'lg') root.classList.add('font-lg');

    // Accessibility
    const highContrast = getLocalStorageItem('accessibility.highContrast', false);
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    const reduceMotion = getLocalStorageItem('accessibility.reduceMotion', false);
    if (reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Theme (Light/Dark/System)
    root.classList.remove('dark-theme', 'light-theme');
    const themeSetting = getLocalStorageItem<'light' | 'dark' | 'system'>('display.theme', 'light');
    if (themeSetting === 'dark') {
      root.classList.add('dark-theme');
    } else if (themeSetting === 'light') {
      root.classList.add('light-theme');
    }
    if (themeSetting === 'system') {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark-theme');
      } else {
        root.classList.add('light-theme');
      }
    }
  } catch (e) {
    console.warn("Failed to apply global settings:", e);
  }
};

type OnboardingState = 'welcome' | 'profileSetup' | 'complete';

// Greeting helper
const getGreeting = (): { text: string; emoji: string; period: string } => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { text: 'Buongiorno', emoji: '🌅', period: 'Mattina' };
  if (hour >= 12 && hour < 18) return { text: 'Buon pomeriggio', emoji: '☀️', period: 'Pomeriggio' };
  if (hour >= 18 && hour < 22) return { text: 'Buonasera', emoji: '🌙', period: 'Sera' };
  return { text: 'Buonanotte', emoji: '✨', period: 'Notte' };
};

// Icon gradient backgrounds for each menu item
const iconGradients = [
  'from-purple-500/20 to-violet-500/20',
  'from-blue-400/20 to-cyan-400/20',
  'from-amber-400/20 to-orange-400/20',
  'from-rose-400/20 to-pink-400/20',
  'from-emerald-400/20 to-green-400/20',
  'from-red-400/20 to-orange-400/20',
  'from-teal-400/20 to-cyan-400/20',
  'from-indigo-400/20 to-purple-400/20',
];

const App: React.FC = () => {
  const [screen, setScreen] = useState('home');
  const [initialAiPrompt, setInitialAiPrompt] = useState('');

  // Initialize state lazily from localStorage to avoid async delays and timeouts
  const [onboardingState, setOnboardingState] = useState<OnboardingState>(() => {
    try {
      const isComplete = getLocalStorageItem('onboardingCompleted', false);
      return isComplete ? 'complete' : 'welcome';
    } catch (e) {
      console.warn("Error reading onboarding state, defaulting to welcome:", e);
      return 'welcome';
    }
  });

  const userName = useMemo(() => {
    try {
      const name = getLocalStorageItem<string>('profile.name', '');
      return name ? name.split(' ')[0] : '';
    } catch { return ''; }
  }, [onboardingState]);

  useEffect(() => {
    applyGlobalSettings(); // Apply on initial load

    const handleSettingsChange = () => applyGlobalSettings();
    window.addEventListener('settings-changed', handleSettingsChange);

    return () => {
      window.removeEventListener('settings-changed', handleSettingsChange);
    };
  }, []);

  const handleNavigateToCoach = (prompt: string) => {
    setInitialAiPrompt(prompt);
    setScreen('ai_coach');
  };

  const menuItems = [
    { id: 'dashboard', title: 'La tua Giornata', description: 'Riepilogo e check-in veloce', Icon: DashboardIcon, component: <Dashboard setScreen={setScreen} /> },
    { id: 'ai_coach', title: 'Coach Fibro', description: 'Supporto e risposte h24', Icon: CoachIcon, component: <AICoach initialPrompt={initialAiPrompt} clearInitialPrompt={() => setInitialAiPrompt('')} /> },
    { id: 'bp', title: 'Il Mio SCORE', description: 'Calcola la tua energia (1-15)', Icon: BPIcon, component: <BloodPressure /> },
    { id: 'meds', title: 'Farmaci & Integratori', description: 'La tua routine quotidiana', Icon: MedsIcon, component: <Medications /> },
    { id: 'reminders', title: 'Promemoria Farmaci', description: 'Avvisi e notifiche orario', Icon: RemindersIcon, component: <Reminders /> },
    { id: 'meals', title: 'Ricettario', description: 'Ricette facili e salva-energia', Icon: MealIcon, component: <MealPlan onNavigateToCoach={handleNavigateToCoach} /> },
    { id: 'education', title: 'Kit Flare Reset', description: 'Protocolli per 20 emergenze', Icon: EducationIcon, component: <Education onNavigateToCoach={handleNavigateToCoach} /> },
    { id: 'exercise', title: 'Movimento Gentile', description: 'Esercizi per non affaticarti', Icon: ExerciseIcon, component: <Exercise onNavigateToCoach={handleNavigateToCoach} /> },
    { id: 'progress', title: 'Planner Sonno', description: 'Rituali serali e risveglio', Icon: ProgressIcon, component: <Progress /> },
  ];

  // Robust screen finding
  const activeMenuItem = menuItems.find(item => item.id === screen);

  const screenTitleMap: { [key: string]: string | undefined } = {
    ...Object.fromEntries(menuItems.map(item => [item.id, item.title])),
    settings: 'Impostazioni',
    privacy: 'Privacy & Cookie',
    terms: 'Termini di Servizio',
  };
  const screenTitle = screenTitleMap[screen];

  const LoadingFallback = () => (
    <div className="flex flex-col justify-center items-center h-64">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-brandPrimaryTint"></div>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brandPrimary animate-spin"></div>
      </div>
      <p className="text-brandPrimary font-semibold text-sm tracking-wide">Caricamento...</p>
    </div>
  );

  // WelcomeScreen is NOT suspended now
  if (onboardingState === 'welcome') {
    return <WelcomeScreen onComplete={() => setOnboardingState('profileSetup')} />;
  }

  if (onboardingState === 'profileSetup') {
    return <Suspense fallback={<LoadingFallback />}><ProfileSetupScreen onComplete={() => {
      localStorage.setItem('onboardingCompleted', 'true');
      setOnboardingState('complete');
    }} /></Suspense>;
  }

  const greeting = getGreeting();

  const renderScreen = () => {
    try {
      if (screen === 'settings') return <Settings setScreen={setScreen} />;
      if (screen === 'privacy') return <PrivacyPolicy setScreen={setScreen} />;
      if (screen === 'terms') return <TermsOfService setScreen={setScreen} />;

      if (screen === 'home') {
        return (
          <div className="space-y-5 pb-8 relative">
            {/* Decorative floating orbs */}
            <div className="orb orb-purple w-32 h-32 -top-10 -right-10 opacity-20" style={{ animationDelay: '0s' }}></div>
            <div className="orb orb-teal w-24 h-24 top-40 -left-12 opacity-15" style={{ animationDelay: '4s' }}></div>

            {/* Greeting Section */}
            <div className="px-1 pt-1 pb-2 animate-fade-in">
              <div className="flex items-center gap-2 mb-1">
                <span className="time-badge">
                  <span>{greeting.emoji}</span>
                  <span>{greeting.period}</span>
                </span>
              </div>
              <h1 className="text-3xl font-extrabold font-serif gradient-text leading-tight tracking-tight">
                {greeting.text}{userName ? `, ${userName}` : ''}!
              </h1>
              <p className="text-textSecondary text-sm mt-1.5 leading-relaxed opacity-80">
                Ogni piccolo passo conta. Cosa ti fa stare bene oggi?
              </p>
            </div>

            {/* Menu Cards Grid */}
            <div className="grid grid-cols-1 gap-3 stagger-children">
              {menuItems.map(({ id, title, description, Icon }, index) => (
                <button
                  key={id}
                  onClick={() => setScreen(id)}
                  className={`menu-card w-full glass-panel-strong p-4 rounded-2xl flex items-center gap-4 text-left group relative overflow-hidden`}
                  aria-label={`Vai a ${title}`}
                >
                  {/* Subtle left accent line */}
                  <div className="absolute left-0 top-0 w-[3px] h-full rounded-r-full bg-gradient-to-b from-brandPrimary via-brandAccent to-brandPrimaryLight opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Icon container with gradient */}
                  <div className={`icon-ring flex-shrink-0 w-12 h-12 bg-gradient-to-br ${iconGradients[index]} rounded-xl flex items-center justify-center shadow-sm border border-white/40`}>
                    <Icon />
                  </div>

                  {/* Text */}
                  <div className="flex-grow min-w-0">
                    <p className="font-bold text-textPrimary text-[15px] truncate group-hover:text-brandPrimary transition-colors duration-300">{title}</p>
                    <p className="text-textMuted text-[13px] leading-snug truncate">{description}</p>
                  </div>

                  {/* Chevron */}
                  <div className="flex-shrink-0 text-textMuted/40 group-hover:text-brandPrimary group-hover:translate-x-1 transition-all duration-300">
                    <ChevronRightIcon />
                  </div>
                </button>
              ))}
            </div>

            {/* Daily Motivation */}
            <div className="animate-fade-in" style={{ animationDelay: '500ms' }}>
              <div className="glass-panel p-4 rounded-2xl border border-brandPrimaryLight/20 animate-shimmer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brandPrimary/15 to-brandAccent/15 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">💜</span>
                  </div>
                  <p className="text-[13px] text-textSecondary leading-relaxed italic">
                    "Un corpo che si ascolta è un corpo che guarisce."
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // Fallback for defined menu items
      if (activeMenuItem) {
        return activeMenuItem.component;
      }

      // Final Fallback if screen ID is unknown
      return (
        <div className="text-center p-10">
          <p className="text-textSecondary">Schermata non trovata.</p>
          <button onClick={() => setScreen('home')} className="text-brandPrimary underline mt-4 font-bold">Torna alla Home</button>
        </div>
      );
    } catch (error) {
      console.error("Error rendering screen:", error);
      return <div className="p-4 text-red-600">Errore nel caricamento della schermata. Per favore torna alla Home.</div>;
    }
  };


  return (
    <div className="bg-transparent max-w-[430px] mx-auto min-h-screen flex flex-col font-sans text-textPrimary leading-relaxed relative">
      <Header screen={screen} setScreen={setScreen} title={screenTitle} />

      <main className="flex-grow px-4 pt-4 pb-20">
        <div key={screen} className="animate-fade-in">
          <Suspense fallback={<LoadingFallback />}>
            {renderScreen()}
          </Suspense>
        </div>
      </main>
      <Footer setScreen={setScreen} />
    </div>
  );
};

export default App;

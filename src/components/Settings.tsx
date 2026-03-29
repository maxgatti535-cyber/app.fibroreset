import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { getLocalStorageItem, setLocalStorageItem } from './utils';

// --- Type Definitions ---
type SettingsType = {
  profile: {
    name: string;
    age: number | '';
    sex: 'female' | 'male' | 'other' | '';
    diagnosisStatus: string;
    painLevel: string;
    mainGoal: string;
    otherSymptoms: string;
  };
  notifications: {
    medNotificationsOn: boolean;
  };
  display: {
    theme: 'light' | 'dark' | 'system';
    fontScale: 'sm' | 'md' | 'lg';
  };
  accessibility: {
    highContrast: boolean;
  };
};

const APP_DATA_KEYS_PREFIXES = [
  'dash_', 'fibro_', 'profile.name', 'profile.age', 'profile.sex', 
  'profile.diagnosisStatus', 'profile.painLevel', 'profile.mainGoal', 'profile.otherSymptoms',
  'notifications.medNotificationsOn', 'display.theme', 'display.fontScale',
  'accessibility.highContrast', 'onboardingCompleted'
];

const SuccessIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-white" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const WarningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8.257 3.099c.636-1.21 2.38-1.21 3.016 0l6.248 11.916c.64 1.22-.22 2.735-1.508 2.735H3.517c-1.288 0-2.148-1.515-1.508-2.735L8.257 3.099zM9 13a1 1 0 112 0 1 1 0 01-2 0zm0-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
  </svg>
);


// --- Reusable sub-components ---
const SettingsCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-brandPrimary/10">
    <h2 className="text-xl font-bold font-serif text-brandPrimaryDark mb-6">{title}</h2>
    <div className="space-y-6">{children}</div>
  </div>
);

const SettingsRow: React.FC<{ label: string; helper?: string; children: React.ReactNode }> = ({ label, helper, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
    <div>
      <label className="block text-[15px] font-bold text-textPrimary">{label}</label>
      {helper && <p className="text-sm text-textSecondary mt-0.5">{helper}</p>}
    </div>
    <div className="flex-shrink-0 w-full sm:w-auto">{children}</div>
  </div>
);

const SegmentedControl: React.FC<{ options: { label: string, value: string }[], value: string, onChange: (value: string) => void }> = ({ options, value, onChange }) => (
  <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
    {options.map(opt => (
      <button key={opt.value} onClick={() => onChange(opt.value)} className={`flex-1 sm:flex-none py-2 px-4 rounded-lg font-bold text-sm transition-colors ${value === opt.value ? 'bg-brandPrimary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}>
        {opt.label}
      </button>
    ))}
  </div>
);

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }> = ({ checked, onChange, disabled }) => (
  <button onClick={() => onChange(!checked)} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${checked ? 'bg-brandPrimary' : 'bg-slate-200'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} justify-start`} disabled={disabled}>
    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);


// --- Main Settings Component ---
const Settings: React.FC<{ setScreen: (screen: string) => void }> = ({ setScreen }) => {
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetInput, setResetInput] = useState('');
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [isNotificationApiSupported, setIsNotificationApiSupported] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstalled(true);
    }
  };

  useEffect(() => {
    const notificationsSupported = 'Notification' in window;
    setIsNotificationApiSupported(notificationsSupported);

    const loadedSettings: SettingsType = {
      profile: {
        name: getLocalStorageItem('profile.name', ''),
        age: getLocalStorageItem('profile.age', ''),
        sex: getLocalStorageItem('profile.sex', ''),
        diagnosisStatus: getLocalStorageItem('profile.diagnosisStatus', ''),
        painLevel: getLocalStorageItem('profile.painLevel', ''),
        mainGoal: getLocalStorageItem('profile.mainGoal', ''),
        otherSymptoms: getLocalStorageItem('profile.otherSymptoms', ''),
      },
      notifications: {
        medNotificationsOn: notificationsSupported ? getLocalStorageItem('notifications.medNotificationsOn', false) : false,
      },
      display: {
        theme: getLocalStorageItem('display.theme', 'light'),
        fontScale: getLocalStorageItem('display.fontScale', 'md'),
      },
      accessibility: {
        highContrast: getLocalStorageItem('accessibility.highContrast', false),
      },
    };

    setSettings(loadedSettings);
    if (notificationsSupported) setNotificationPermission(Notification.permission);
  }, []);

  const handleSettingChange = useCallback((key: string, value: any) => {
    const path = key.split('.');
    setSettings(prev => {
      if (!prev) return null;
      const newState = JSON.parse(JSON.stringify(prev));
      let currentLevel: any = newState;
      for (let i = 0; i < path.length - 1; i++) currentLevel = currentLevel[path[i]];
      currentLevel[path[path.length - 1]] = value;
      return newState;
    });

    setLocalStorageItem(key, value);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
    window.dispatchEvent(new CustomEvent('settings-changed'));
  }, []);

  const handleRequestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if(permission === 'granted') {
          handleSettingChange('notifications.medNotificationsOn', true);
      }
    }
  };

  const exportData = () => {
    const data: { [key: string]: any } = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && APP_DATA_KEYS_PREFIXES.some(prefix => key.startsWith(prefix))) {
        data[key] = getLocalStorageItem(key, null);
      }
    }
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `reset_fibro_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const importData = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error('File content is not a string');
        const data = JSON.parse(text);
        if (window.confirm('I dati esistenti verranno sovrascritti. Sei sicura di voler importare?')) {
          Object.keys(data).forEach(key => setLocalStorageItem(key, data[key]));
          alert('Dati importati con successo! L\'app verrà ricaricata.');
          window.location.reload();
        }
      } catch (error) {
        alert('Errore di importazione. Verifica che il file sia corretto.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleResetApp = () => {
    if (resetInput === 'RESET') {
      if (window.confirm('Conferma finale: tutti i tuoi dati andranno persi per sempre. Procedo?')) {
        APP_DATA_KEYS_PREFIXES.forEach(prefix => {
          for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key && key.startsWith(prefix)) {
              localStorage.removeItem(key);
            }
          }
        });
        alert('Dati resettati. L\'app verrà ricaricata.');
        window.location.reload();
      }
    } else {
      alert('Digita "RESET" in maiuscolo per confermare.');
    }
  };

  if (!settings) return <div className="text-center p-8">Caricamento impostazioni...</div>;

  return (
    <div className="space-y-6 pb-12 fade-in">
      <SettingsCard title="Il tuo Profilo Fibro">
        <SettingsRow label="Nome">
          <input type="text" value={settings.profile.name} onChange={e => handleSettingChange('profile.name', e.target.value)} className="w-full sm:w-64 p-3 rounded-xl border border-border bg-slate-50 text-[15px] focus:ring-2 focus:ring-brandPrimary outline-none text-right" />
        </SettingsRow>
        <SettingsRow label="Età">
          <input type="number" value={settings.profile.age} onChange={e => handleSettingChange('profile.age', e.target.value ? parseInt(e.target.value, 10) : '')} className="w-full sm:w-32 p-3 rounded-xl border border-border bg-slate-50 text-[15px] focus:ring-2 focus:ring-brandPrimary outline-none text-right" />
        </SettingsRow>
        <SettingsRow label="Sesso">
          <select value={settings.profile.sex} onChange={e => handleSettingChange('profile.sex', e.target.value)} className="w-full sm:w-48 p-3 rounded-xl border border-border bg-slate-50 text-[15px] focus:ring-2 focus:ring-brandPrimary outline-none text-right">
            <option value="">Seleziona...</option>
            <option value="female">Donna</option>
            <option value="male">Uomo</option>
            <option value="other">Altro</option>
          </select>
        </SettingsRow>
        <SettingsRow label="Stato Diagnosi">
          <select value={settings.profile.diagnosisStatus} onChange={e => handleSettingChange('profile.diagnosisStatus', e.target.value)} className="w-full sm:w-64 p-3 rounded-xl border border-border bg-slate-50 text-[15px] focus:ring-2 focus:ring-brandPrimary outline-none text-right">
             <option value="">Seleziona...</option>
             <option value="diagnosed_years">Diagnosticata da anni</option>
             <option value="diagnosed_recent">Diagnosticata di recente</option>
             <option value="suspected">Sospetta ma non diagnosticata</option>
             <option value="chronic_fatigue">Sindrome Stanchezza Cronica</option>
          </select>
        </SettingsRow>
        <SettingsRow label="Livello di Stanchezza/Dolore">
          <select value={settings.profile.painLevel} onChange={e => handleSettingChange('profile.painLevel', e.target.value)} className="w-full sm:w-64 p-3 rounded-xl border border-border bg-slate-50 text-[15px] focus:ring-2 focus:ring-brandPrimary outline-none text-right">
             <option value="">Seleziona...</option>
             <option value="mild">1-3 (Lieve, gestibile)</option>
             <option value="moderate">4-6 (Moderato, molto fastidioso)</option>
             <option value="severe">7-8 (Grave, limitante)</option>
             <option value="extreme">9-10 (Estremo, bloccante)</option>
          </select>
        </SettingsRow>
      </SettingsCard>

      <SettingsCard title="App e Installazione">
        {isInstalled ? (
           <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-center gap-3">
             <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">✓</div>
             <p className="text-sm font-bold text-green-800">L'app è già installata sul tuo dispositivo.</p>
           </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-textSecondary leading-relaxed">Installa l'app sulla tua Home Screen per un accesso rapido e per far funzionare correttamente gli allarmi dei farmaci.</p>
            
            {deferredPrompt ? (
               <button onClick={handleInstallClick} className="w-full bg-brandPrimary text-white font-bold py-4 rounded-xl shadow-lg hover:bg-brandPrimaryDark transition-all">
                 Installa Ora sul Telefono
               </button>
            ) : (
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p className="text-sm font-bold text-blue-800 mb-2">Come installare:</p>
                <ul className="text-xs text-blue-700 space-y-1 ml-4 list-disc">
                  <li><b>Su iPhone/iPad:</b> Clicca l'icona "Condividi" in Safari e poi "Aggiungi alla schermata Home".</li>
                  <li><b>Su Android:</b> Clicca i tre puntini in alto a destra in Chrome e seleziona "Installa applicazione".</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </SettingsCard>

      <SettingsCard title="Display e Accessibilità">
        <SettingsRow label="Tema Visuale">
          <SegmentedControl options={[{ label: 'Chiaro', value: 'light' }, { label: 'Scuro', value: 'dark' }, { label: 'Auto', value: 'system' }]} value={settings.display.theme} onChange={val => handleSettingChange('display.theme', val)} />
        </SettingsRow>
        <SettingsRow label="Dimensione Testo">
          <SegmentedControl options={[{ label: 'Piccolo', value: 'sm' }, { label: 'Normale', value: 'md' }, { label: 'Grande', value: 'lg' }]} value={settings.display.fontScale} onChange={val => handleSettingChange('display.fontScale', val)} />
        </SettingsRow>
        <SettingsRow label="Alta Opacità (Contrasto)">
          <ToggleSwitch checked={settings.accessibility.highContrast} onChange={val => handleSettingChange('accessibility.highContrast', val)} />
        </SettingsRow>
      </SettingsCard>

      <SettingsCard title="Notifiche">
        <SettingsRow label="Promemoria Farmaci e Integratori">
          <ToggleSwitch
            checked={settings.notifications.medNotificationsOn}
            onChange={(val) => {
                if(val && notificationPermission !== 'granted') handleRequestPermission();
                else handleSettingChange('notifications.medNotificationsOn', val);
            }}
            disabled={!isNotificationApiSupported}
          />
        </SettingsRow>
        {!isNotificationApiSupported ? (
          <p className="text-sm text-textMuted text-center mt-2">Le notifiche push non sono supportate da questo browser (su iOS, aggiungi l'app alla Home Screen per attivarle).</p>
        ) : settings.notifications.medNotificationsOn ? (
           <div className="mt-4">
            {notificationPermission === 'denied' && (
              <div className="bg-orange-50 text-orange-800 p-3 rounded-xl flex items-center gap-3 text-sm border border-orange-200">
                <WarningIcon />
                <span>Permesso negato. Devi attivare le notifiche nelle impostazioni del dispositivo o browser.</span>
              </div>
            )}
            {notificationPermission === 'granted' && (
              <div className="bg-green-50 text-green-800 p-3 rounded-xl flex items-center gap-3 text-sm border border-green-200">
                <SuccessIcon />
                <span>Notifiche attive! Riceverai un promemoria all'orario fissato.</span>
              </div>
            )}
           </div>
        ) : null}
      </SettingsCard>

      <SettingsCard title="Gestione Dati Sincronizzati">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button onClick={exportData} className="w-full text-[15px] text-brandPrimary bg-white border-2 border-brandPrimary font-bold py-4 rounded-xl hover:bg-brandPrimary hover:text-white transition-all">
            Scarica Backup Dati
          </button>
          <label className="w-full text-[15px] text-brandPrimary bg-white border-2 border-brandPrimary font-bold py-4 rounded-xl hover:bg-brandPrimary hover:text-white transition-all text-center cursor-pointer flex items-center justify-center">
            Importa Backup
            <input type="file" accept=".json" onChange={importData} className="hidden" />
          </label>
        </div>
        <button onClick={() => setResetModalOpen(true)} className="w-full mt-4 text-[15px] bg-red-100 text-red-600 font-bold py-4 rounded-xl hover:bg-red-200 transition-all border border-red-200">
          Elimina tutti i dati dell'app
        </button>
      </SettingsCard>

      <div className="text-center space-y-2 mt-8 opacity-80">
        <div className="flex justify-center items-center space-x-3 text-sm">
          <button onClick={() => setScreen('privacy')} className="text-brandPrimary font-bold hover:underline bg-transparent border-none p-0 cursor-pointer">Privacy</button>
          <span className="text-slate-300">•</span>
          <button onClick={() => setScreen('terms')} className="text-brandPrimary font-bold hover:underline bg-transparent border-none p-0 cursor-pointer">Termini</button>
          <span className="text-slate-300">•</span>
          <a href="mailto:supporto@equilibriareset.com" className="text-brandPrimary font-bold hover:underline">Supporto</a>
        </div>
        <p className="text-[13px] text-slate-500 font-medium">© 2026 Equilibria Reset™ · Metodo RESET FIBRO™ v1.0</p>
      </div>

      {showToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-800 text-white py-2 px-6 rounded-full shadow-lg text-sm font-bold animate-fade-in-out">
          Impostazioni Salvate
        </div>
      )}

      {resetModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-sm text-center animate-fade-in">
            <h3 className="text-2xl font-bold font-serif text-red-600">Reset Totale</h3>
            <p className="my-4 text-textSecondary text-[15px] leading-relaxed">Attenzione: questa azione è irreversibile. Tutti i tuoi diari, punteggi e preferenze verranno eliminati dal telefono. Scrivi "RESET" per confermare.</p>
            <input 
               type="text" 
               value={resetInput} 
               onChange={e => setResetInput(e.target.value)} 
               className="w-full p-3 rounded-xl border border-red-200 bg-red-50 text-center text-red-900 font-bold text-lg outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent uppercase placeholder:text-red-300 placeholder:font-normal mb-6" 
               placeholder='Scrivi RESET' 
            />
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setResetModalOpen(false)} className="font-bold bg-slate-100 text-slate-600 py-4 rounded-xl hover:bg-slate-200 transition-all text-sm">Annulla</button>
              <button 
                onClick={handleResetApp} 
                disabled={resetInput !== 'RESET'} 
                className="font-bold bg-red-600 text-white py-4 rounded-xl disabled:bg-red-300 hover:bg-red-700 transition-all text-sm shadow-md"
              >
                Cancella Tutto
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Settings;

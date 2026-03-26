import React, { useState, useRef, useEffect } from 'react';
import { getLocalStorageItem, markdownToHtml } from './utils';
import { Send, Mic, Volume2, VolumeX, StopCircle, Loader2 } from 'lucide-react';

interface AICoachProps {
  initialPrompt?: string;
  clearInitialPrompt?: () => void;
}

const quickActionMap = {
  checkin: 'Check-in Livello Dolore e Stanchezza',
  plan3d: 'Idee per pasti antinfiammatori (3 giorni)',
  flare: 'Aiuto! Ho un flare intensificato',
  movement: 'Movimento gentile (10 min)',
  sleep: 'Consigli per riposare stanotte',
};
type QuickActionKey = keyof typeof quickActionMap;

const AICoach: React.FC<AICoachProps> = ({ initialPrompt, clearInitialPrompt }) => {
  const [messages, setMessages] = useState([{ text: "Ciao! Sono il tuo Coach del Metodo RESET FIBRO. Come ti senti oggi?", sender: 'ai' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeQuickActions, setActiveQuickActions] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const setting = getLocalStorageItem<string>('display.theme', 'light');
    if (setting === 'dark') return true;
    if (setting === 'system') return window.matchMedia('(prefers-color-scheme: dark)').matches;
    return false;
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const startInputRef = useRef(''); // Store input value when listening starts
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);

  useEffect(() => {
    const updateQuickActions = () => {
      const coachSettings = getLocalStorageItem('preferences.coachQuickActions', {
        checkin: true,
        plan3d: true,
        flare: true,
        movement: true,
        sleep: true,
      });

      const enabledActions = (Object.keys(quickActionMap) as QuickActionKey[])
        .filter(key => coachSettings[key])
        .map(key => quickActionMap[key]);

      setActiveQuickActions(enabledActions);
    };

    const updateTheme = () => {
      const setting = getLocalStorageItem<'light' | 'dark' | 'system'>('display.theme', 'light');
      if (setting === 'dark') setIsDark(true);
      else if (setting === 'system') setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
      else setIsDark(false);
    };

    updateQuickActions();
    updateTheme();
    window.addEventListener('settings-changed', () => {
      updateQuickActions();
      updateTheme();
    });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = () => {
      if (getLocalStorageItem<'light' | 'dark' | 'system'>('display.theme', 'light') === 'system') {
        updateTheme();
      }
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true; // Enable continuous listening
      recognitionRef.current.interimResults = true; // Enable real-time feedback
      recognitionRef.current.lang = 'it-IT'; // Default to Italian

      recognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }

        // Combine with the input we had before we started listening
        const prefix = startInputRef.current;
        const separator = prefix && transcript ? ' ' : '';
        setInput(prefix + separator + transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      window.removeEventListener('settings-changed', updateQuickActions);
      if (isSpeaking) {
        synthRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (initialPrompt) {
      sendMessage(initialPrompt);
      if (clearInitialPrompt) clearInitialPrompt();
    }
  }, [initialPrompt]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      startInputRef.current = input; // Capture current input before starting
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speakText = (text: string) => {
    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      return;
    }

    // Strip markdown for cleaner speech
    const cleanText = text.replace(/[*#_]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'it-IT'; // Default to Italian

    // Try to find a more natural/human-sounding voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice =>
      (voice.name.includes('Google') && voice.lang.startsWith('it')) ||
      (voice.name.includes('Natural') && voice.lang.startsWith('it')) ||
      (voice.lang === 'it-IT')
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => setIsSpeaking(false);

    setIsSpeaking(true);
    synthRef.current.speak(utterance);
  };

  const addBPContext = () => {
    setInput(prev => "CONTESTO: Oggi il mio livello di dolore/stanchezza è aumentato.\n\n" + (prev ? prev.trim() : "Puoi aiutarmi a capire come gestire la situazione?"));
    inputRef.current?.focus();
  };

  const sendMessage = async (messageText: string): Promise<boolean> => {
    if (!messageText.trim()) return true;

    const userMessage = { text: messageText, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    let success = false;

    try {
      const profile = {
        name: getLocalStorageItem('profile.name', ''),
        age: getLocalStorageItem('profile.age', ''),
        sex: getLocalStorageItem('profile.sex', ''),
        diagnosisStatus: getLocalStorageItem('profile.diagnosisStatus', ''),
        painLevel: getLocalStorageItem('profile.painLevel', ''),
        mainGoal: getLocalStorageItem('profile.mainGoal', ''),
        otherSymptoms: getLocalStorageItem('profile.otherSymptoms', ''),
      };
      const medications: any[] = getLocalStorageItem('dash_medications_v2', []);

      let contextString = `\n\n--- PROFILO PAZIENTE & CONTESTO ---\n`;
      if (profile.name) contextString += `Nome: ${profile.name}\n`;
      if (profile.age) contextString += `Età: ${profile.age}\n`;
      if (profile.sex) contextString += `Sesso: ${profile.sex}\n`;
      if (profile.diagnosisStatus) contextString += `Diagnosi: ${profile.diagnosisStatus}\n`;
      if (profile.painLevel) contextString += `Livello base Dolore/Stanchezza: ${profile.painLevel}\n`;
      if (profile.mainGoal) contextString += `Obiettivo Principale a 30 giorni: ${profile.mainGoal}\n`;
      if (profile.otherSymptoms) contextString += `Sintomi secondari: ${profile.otherSymptoms}\n`;
      
      if (medications.length > 0) {
        contextString += `\nFarmaci/Integratori attuali:\n`;
        medications.forEach(med => {
          contextString += `- ${med.name} ${med.dose}${med.unit}\n`;
        });
      } else {
        contextString += `\nFarmaci: Nessuno aggiunto.\n`;
      }
      contextString += `----------------------------\n`;

      const SHORT_SYSTEM_PROMPT = `IDENTITÀ E RUOLO
Sei l'AI Coach ufficiale del "Metodo RESET FIBRO™", del "Ricettario" e del "Kit Flare Reset" di Equilibria Reset.

LIMITAZIONI CRITICHE E LINEE GUIDA
Non sei un medico. Ti limiti a consigliare strategie educative (Pacing, Respirazione 4-6, Igiene del sonno).
ALIMENTAZIONE: Consiglia ricette facili e antinfiammatorie (es. Zuppa di Zucca, Porridge, Salmone). Enfatizza le strategie salva-energia (verdure surgelate, legumi precotti).
FLARE RESET: Quando l'utente ha un "Flare" (crisi da sovraccarico, sbalzi meteo, stress, ciclo, ecc.), guidalo passo passo nei 4 step del Kit: (1) Calma/Sicurezza (es. Respiro, calore), (2) Riduzione stimoli (es. Buio, riposo), (3) Idratazione/Nutrimento leggero, (4) Azione passiva (es. Riposo, scrittura veloce nel diario).

STILE DI COMUNICAZIONE
Rispondi sempre e SOLO in ITALIANO. Empatico, validante e rassicurante. Messaggi brevi.`;

      // Forced sync to Vercel - ensuring variables are defined
      const fullPrompt = messageText;
      const coachConfigPrompt = SHORT_SYSTEM_PROMPT + "\n\n" + contextString;

      // Use our secure Vercel proxy instead of direct client-side call
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          system: coachConfigPrompt
        })
      });

      const rawText = await response.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        throw new Error(`Risposta non valida dal server: ${rawText.substring(0, 100)}`);
      }

      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      const responseText = data.answer;

      if (!responseText) {
        throw new Error("Empty response from Coach.");
      }

      const aiMessage = { text: responseText, sender: 'ai' };
      setMessages(prev => [...prev, aiMessage]);
      success = true;
    } catch (error) {
      console.error('Gemini API error:', error);
      const errorMsg = error instanceof Error ? error.message : "Internal error";
      const errorMessage = { text: `⚠️ Coach: ${errorMsg}`, sender: 'ai' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      // Ensure loading flag is cleared even after unexpected errors
      setIsListening(false);
      setIsSpeaking(false);
    }
    return success;
  };

  const handleSend = async () => {
    const messageToSend = input;
    if (!messageToSend.trim()) return;

    setInput('');
    const success = await sendMessage(messageToSend);

    if (!success) {
      setInput(messageToSend);
    }
  };

  const handleQuickAction = (action: string) => {
    const prompt = quickActionMap[action as keyof typeof quickActionMap] || action;
    sendMessage(prompt);
  };

  return (
    <div className="coach-container flex flex-col h-full bg-transparent overflow-hidden">
      {/* Messaggi */}
      <div className="flex-grow p-4 space-y-6 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} message-appear`}
          >
            <div className={`p-4 rounded-3xl max-w-[85%] md:max-w-[75%] premium-shadow transition-all duration-300 ${msg.sender === 'user'
              ? 'bg-gradient-to-br from-brandPrimary to-brandPrimaryDark text-white rounded-tr-none'
              : `${isDark ? 'glass-panel-dark text-white' : 'glass-panel text-textPrimary'} rounded-tl-none border-l-4 border-brandPrimary`
              }`}>
              <div
                className={`prose ${msg.sender === 'user' ? 'prose-invert' : ''} text-lg leading-relaxed`}
                dangerouslySetInnerHTML={{ __html: markdownToHtml(msg.text) }}
              ></div>

              {msg.sender === 'ai' && (
                <button
                  onClick={() => speakText(msg.text)}
                  className="mt-3 text-brandPrimary hover:text-brandPrimaryDark transition-all flex items-center gap-2 text-sm font-medium bg-white/50 px-3 py-1 rounded-full border border-brandPrimary/10 shadow-sm"
                  title="Read aloud"
                >
                  {isSpeaking ? <VolumeX size={18} className="animate-pulse" /> : <Volume2 size={18} />}
                  <span>{isSpeaking ? 'Stop Listening' : 'Listen to Coach'}</span>
                </button>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start message-appear">
            <div className={`p-4 rounded-3xl ${isDark ? 'glass-panel-dark' : 'glass-panel'} rounded-tl-none border-l-4 border-brandPrimary flex items-center gap-2`}>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-brandPrimary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-brandPrimary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-brandPrimary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Area Input & Azioni */}
      <div className={`p-4 border-t border-white/10 premium-shadow ${isDark ? 'glass-panel-dark' : 'glass-panel'}`}>
        <div className="pb-4">
          <button
            onClick={addBPContext}
            className="w-full text-brandPrimary font-bold text-center py-2.5 px-4 rounded-xl border-2 border-dashed border-brandPrimary/30 hover:border-brandPrimary hover:bg-brandPrimary/5 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <span className="text-xl group-hover:scale-125 transition-transform">+</span>
            Includi un messaggio sul tuo dolore attuale
          </button>
        </div>

        {/* Azioni Rapide */}
        <div className="flex overflow-x-auto whitespace-nowrap gap-3 mb-4 pb-2 no-scrollbar">
          {activeQuickActions.map(action => (
            <button
              key={action}
              onClick={() => handleQuickAction(action)}
              className="px-5 py-2.5 bg-white/80 text-brandPrimary border border-brandPrimary/10 rounded-full text-base font-semibold hover:bg-brandPrimary hover:text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
              {action}
            </button>
          ))}
        </div>

        {/* Input area */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleListening}
            className={`p-4 rounded-2xl transition-all duration-300 flex-shrink-0 border-2 ${isListening
              ? 'bg-red-500 text-white border-red-400 animate-pulse shadow-lg ring-4 ring-red-500/20'
              : 'bg-white text-brandPrimary border-brandPrimary/5 hover:bg-brandPrimaryTint hover:border-brandPrimary/20 shadow-sm'
              }`}
            title="Speak now"
          >
            {isListening ? <StopCircle size={26} /> : <Mic size={26} />}
          </button>

          <div className="relative flex-grow">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="w-full p-4 pl-5 pr-12 bg-white/80 border border-brandPrimary/10 rounded-2xl h-14 text-lg focus:outline-none focus:ring-2 focus:ring-brandPrimary/30 focus:bg-white transition-all shadow-inner"
              placeholder={isListening ? "In ascolto..." : "Chiedi al Coach Fibro o scrivi..."}
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="absolute right-2 top-2 bg-brandPrimary text-white rounded-xl h-10 w-10 flex items-center justify-center disabled:opacity-30 disabled:grayscale transition-all hover:bg-brandPrimaryDark hover:scale-105 active:scale-95 shadow-md"
              aria-label="Send"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICoach;

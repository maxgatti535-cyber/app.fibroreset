import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { getLocalStorageItem, setLocalStorageItem } from './utils';
import { Pill, PlusCircle, CheckCircle2, Clock, AlertTriangle, Bell, BellOff, Info, Trash2, Calendar } from 'lucide-react';

// --- Types ---
type Unit = "mg" | "mcg" | "mL" | "capsule" | "gocce" | "unità";
type Slot = "Mattina" | "Pranzo" | "Sera" | "Prima di dormire";

type Medication = {
  id: string;
  name: string;
  dose: number | '';
  unit: Unit;
  scheduleType: "times" | "slots";
  times?: string[]; 
  slots?: Slot[];
  slotTimes?: Partial<Record<Slot,string>>;
  repeatDays: number[]; 
  startDateISO: string; 
  endDateISO?: string;
  alarmsEnabled: boolean;
  remindMinutes?: 0 | 5 | 10 | 15;
  notes?: string;
};

type DoseInstance = {
  medId: string;
  name: string;
  dose: number | '';
  unit: Unit;
  time: string; // "HH:mm"
  originalTime: string;
  status: 'In arrivo' | 'Tra poco' | 'Ora' | 'Saltato' | 'Preso';
  isTaken: boolean;
  snoozedUntil?: Date;
};

const SLOT_TIMES: { [key in Slot]: string } = {
  Mattina: '08:00',
  Pranzo: '13:00',
  Sera: '19:30',
  "Prima di dormire": '22:30',
};

const getTodayDateISO = () => new Date().toISOString().split('T')[0];
const getDayKey = (date: Date) => date.toISOString().split('T')[0];
const isString = (v: unknown): v is string => typeof v === "string";

const parseHHmm = (hhmm: unknown): {h:number;m:number}|null => {
  if (!isString(hhmm)) return null;
  const m = /^(\d{2}):(\d{2})$/.exec(hhmm.trim());
  if (!m) return null;
  const h = Number(m[1]), mm = Number(m[2]);
  return (h>=0 && h<24 && mm>=0 && mm<60) ? {h, m:mm} : null;
};

// --- Suono della Notifica ---
const playAlarmSound = () => {
    try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.type = 'triangle'; // Suono dolce ma percepibile
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // Do
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.2); // Mi
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.4); // Sol
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
    } catch (e) {
        console.error("Audio block:", e);
    }
};

const Medications: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [takenRecords, setTakenRecords] = useState<{ [key: string]: { medId: string; time: string; takenAtISO: string }[] }>({});
  const [snoozeRecords, setSnoozeRecords] = useState<{ [key: string]: { medId: string; originalTime: string; snoozedUntilISO: string }[] }>({});
  const [showForm, setShowForm] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Stati per le Notifiche
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [medNotificationsOn, setMedNotificationsOn] = useState(false);
  const notificationTimersRef = useRef<number[]>([]);

  useEffect(() => {
    setMedications(getLocalStorageItem<Medication[]>('dash_medications_v2', []));
    setTakenRecords(getLocalStorageItem('dash_medsTaken_v2', {}));
    setSnoozeRecords(getLocalStorageItem('dash_medsSnoozed_v2', {}));
    setMedNotificationsOn(getLocalStorageItem('notifications.medNotificationsOn', false));
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000); 
    return () => clearInterval(timer);
  }, []);

  const handleSaveMed = (med: Medication) => {
    const newMeds = [...medications];
    const existingIndex = newMeds.findIndex(m => m.id === med.id);
    if (existingIndex > -1) newMeds[existingIndex] = med;
    else newMeds.push(med);
    
    setMedications(newMeds);
    setLocalStorageItem('dash_medications_v2', newMeds);
    setShowForm(false);
    setEditingMed(null);
  };

  const handleDeleteMed = (medId: string) => {
    if (window.confirm("Sei sicura di voler eliminare questo farmaco?")) {
        const newMeds = medications.filter(m => m.id !== medId);
        setMedications(newMeds);
        setLocalStorageItem('dash_medications_v2', newMeds);
        setShowForm(false);
        setEditingMed(null);
    }
  };

  const todayKey = getDayKey(currentTime);
  const todaysTaken = takenRecords[todayKey] || [];
  const todaysSnoozed = snoozeRecords[todayKey] || [];

  const todaysInstances = useMemo<DoseInstance[]>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayDay = today.getDay();

    const instances: DoseInstance[] = [];

    medications.forEach(med => {
      const startDate = new Date(med.startDateISO + 'T00:00:00');
      const endDate = med.endDateISO ? new Date(med.endDateISO + 'T23:59:59') : null;
      
      const isActive = startDate <= today && (!endDate || today <= endDate) && med.repeatDays.includes(todayDay);
      if (!isActive) return;

      let times: string[] = [];
      if (med.scheduleType === 'times' && med.times) times = med.times;
      else if (med.scheduleType === 'slots' && med.slots) times = med.slots.map(slot => (med.slotTimes?.[slot]) || SLOT_TIMES[slot]);
      
      times.forEach(time => {
        const parsedTime = parseHHmm(time);
        if (!parsedTime) return; 

        const originalTime = time.trim();
        const { h: hours, m: minutes } = parsedTime;
        
        const snoozed = todaysSnoozed.find(s => s.medId === med.id && s.originalTime === originalTime);
        const snoozedUntil = snoozed ? new Date(snoozed.snoozedUntilISO) : undefined;
        const taken = todaysTaken.find(t => t.medId === med.id && t.time === originalTime);

        const dueTime = snoozedUntil || new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);

        let status: DoseInstance['status'] = 'In arrivo';
        const now = currentTime;
        const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
        const remindMinutes = med.alarmsEnabled ? (med.remindMinutes || 0) : 0;
        const remindTime = new Date(dueTime.getTime() - remindMinutes * 60 * 1000);

        if (taken) status = 'Preso';
        else if (now > dueTime) status = dueTime > twoHoursAgo ? 'Ora' : 'Saltato';
        else if (now >= remindTime) status = 'Tra poco';
        
        instances.push({
          medId: med.id, name: med.name, dose: med.dose, unit: med.unit,
          time: originalTime, originalTime, status,
          isTaken: !!taken, snoozedUntil
        });
      });
    });

    return instances.sort((a, b) => a.time.localeCompare(b.time));
  }, [medications, currentTime, todaysTaken, todaysSnoozed]);

  // Gestione Notifiche Push
  const scheduleNotifications = useCallback((instances: DoseInstance[]) => {
    notificationTimersRef.current.forEach(clearTimeout);
    notificationTimersRef.current = [];

    if (Notification.permission !== 'granted' || !medNotificationsOn) return;

    const now = new Date();
    const todayISO = getTodayDateISO();
    
    instances.forEach(instance => {
      if (instance.isTaken || ['Preso', 'Saltato'].includes(instance.status)) return;
      
      const med = medications.find(m => m.id === instance.medId);
      if (!med || !med.alarmsEnabled) return;
      if (!parseHHmm(instance.time)) return; 

      const dueTime = new Date(`${todayISO}T${instance.time}`);
      const remindMinutes = med.remindMinutes ?? 0;
      const notificationTime = new Date(dueTime.getTime() - remindMinutes * 60 * 1000);

      if (notificationTime > now) {
        const delay = notificationTime.getTime() - now.getTime();
        const timerId = window.setTimeout(() => {
          const currentTaken = getLocalStorageItem<{ [key: string]: { medId: string; time: string }[] }>('dash_medsTaken_v2', {});
          const currentDayKey = getDayKey(new Date());
          const isNowTaken = (currentTaken[currentDayKey] || []).some(t => t.medId === instance.medId && t.time === instance.originalTime);
          
          if (!isNowTaken) {
            playAlarmSound(); // Suona la campanella
            if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]); // Vibra
            
            new Notification(`Promemoria: ${instance.name}`, {
              body: `È il momento di prendere ${instance.dose} ${instance.unit}.`,
              tag: `med-alarm-${instance.medId}-${instance.originalTime}-${todayISO}`,
              icon: '/icons/icon-192x192.png',
            });
          }
        }, delay);
        notificationTimersRef.current.push(timerId);
      }
    });
  }, [medications, medNotificationsOn]);

  useEffect(() => {
    if (notificationPermission === 'granted') scheduleNotifications(todaysInstances);
    return () => notificationTimersRef.current.forEach(clearTimeout);
  }, [todaysInstances, notificationPermission, scheduleNotifications]);

  const handleRequestPermission = async () => {
    let newStatus = medNotificationsOn;
    
    if (!medNotificationsOn) {
        if (!('Notification' in window)) {
           alert('Il tuo browser non supporta le notifiche desktop.');
           return;
        }
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        if (permission === 'granted') {
           setLocalStorageItem('notifications.medNotificationsOn', true);
           setMedNotificationsOn(true);
           playAlarmSound(); // Test sound
           alert("Notifiche e suono attivati con successo!");
        } else {
           alert("Devi concedere i permessi dal browser per ricevere gli allarmi.");
        }
    } else {
        setLocalStorageItem('notifications.medNotificationsOn', false);
        setMedNotificationsOn(false);
    }
  };


  const handleToggleTaken = (instance: DoseInstance) => {
    const newTaken = { ...takenRecords };
    let dayTaken = newTaken[todayKey] || [];
    
    if (instance.isTaken) {
      dayTaken = dayTaken.filter(t => !(t.medId === instance.medId && t.time === instance.originalTime));
    } else {
      dayTaken.push({ medId: instance.medId, time: instance.originalTime, takenAtISO: new Date().toISOString() });
    }
    
    newTaken[todayKey] = dayTaken;
    setTakenRecords(newTaken);
    setLocalStorageItem('dash_medsTaken_v2', newTaken);
  };
  
  const handleSnooze = (instance: DoseInstance, minutes: number) => {
      const newSnoozed = { ...snoozeRecords };
      let daySnoozed = newSnoozed[todayKey] || [];
      const snoozedUntil = new Date(currentTime.getTime() + minutes * 60 * 1000);
      
      const existingSnoozeIndex = daySnoozed.findIndex(s => s.medId === instance.medId && s.originalTime === instance.originalTime);
      if (existingSnoozeIndex > -1) daySnoozed[existingSnoozeIndex].snoozedUntilISO = snoozedUntil.toISOString();
      else daySnoozed.push({ medId: instance.medId, originalTime: instance.originalTime, snoozedUntilISO: snoozedUntil.toISOString() });

      newSnoozed[todayKey] = daySnoozed;
      setSnoozeRecords(newSnoozed);
      setLocalStorageItem('dash_medsSnoozed_v2', newSnoozed);
  };

  const AdherenceSummary = useMemo(() => {
    let takenCount = 0;
    let scheduledCount = 0;

    for (let i = 0; i < 7; i++) {
      const date = new Date(currentTime);
      date.setDate(date.getDate() - i);
      const dayKey = getDayKey(date);
      const dayOfWeek = date.getDay();
      const takenOnDay = takenRecords[dayKey] || [];

      medications.forEach(med => {
        const startDate = new Date(med.startDateISO + 'T00:00:00');
        const endDate = med.endDateISO ? new Date(med.endDateISO + 'T23:59:59') : null;
        if (!(startDate <= date && (!endDate || date <= endDate) && med.repeatDays.includes(dayOfWeek))) return;

        let times: string[] = [];
        if (med.scheduleType === 'times' && med.times) times = med.times;
        else if (med.scheduleType === 'slots' && med.slots) times = med.slots.map(slot => med.slotTimes?.[slot] || SLOT_TIMES[slot]);

        times.forEach(time => {
          if (!parseHHmm(time)) return; 
          scheduledCount++;
          if (takenOnDay.some(t => t.medId === med.id && t.time === time)) takenCount++;
        });
      });
    }

    if (scheduledCount === 0) return <p className="text-textSecondary text-sm">Nessuna dose programmata negli ultimi 7 giorni.</p>;
    
    const percentage = Math.round((takenCount / scheduledCount) * 100) || 0;
    return (
        <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg text-white ${percentage > 75 ? 'bg-green-500' : percentage > 50 ? 'bg-yellow-500' : 'bg-orange-500'}`}>
               {percentage}%
            </div>
            <div>
               <p className="font-bold text-textPrimary">Aderenza Settimanale</p>
               <p className="text-sm text-textSecondary">{takenCount} dosi prese su {scheduledCount} totali.</p>
            </div>
        </div>
    );
  }, [medications, takenRecords, currentTime]);

  return (
    <div className="space-y-6 pb-12 fade-in">
      
      <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 text-white p-6 rounded-3xl premium-shadow relative overflow-hidden">
        <Pill className="absolute -right-4 -bottom-4 opacity-10" size={120} />
        <h2 className="text-3xl font-bold font-serif mb-2 leading-tight">Farmaci & Integratori</h2>
        <p className="text-white/90 text-sm leading-relaxed mb-4">
          Un corpo infiammato ha bisogno di costanza. Gli integratori non sono magie, ma mattoni per ricostruire l'equilibrio.
        </p>

        {/* Pulsante Notifiche */}
        <button 
          onClick={handleRequestPermission}
          className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-between transition-all backdrop-blur-sm border shadow-sm ${medNotificationsOn && notificationPermission === 'granted' ? 'bg-white/20 border-white/40 text-white' : 'bg-orange-400 text-white border-orange-300'}`}
        >
           <div className="flex items-center gap-2">
             {medNotificationsOn && notificationPermission === 'granted' ? <Bell size={20} /> : <BellOff size={20} />}
             <span>{medNotificationsOn && notificationPermission === 'granted' ? 'Allarmi & Notifiche Attivi' : 'Attiva Allarmi e Suoni'}</span>
           </div>
           {(!medNotificationsOn || notificationPermission !== 'granted') && <div className="text-xs uppercase bg-white/20 px-2 py-1 rounded">Disattivato</div>}
        </button>

      </div>

      {showForm ? (
        <MedicationForm
          med={editingMed}
          onSave={handleSaveMed}
          onCancel={() => { setShowForm(false); setEditingMed(null); }}
          onDelete={handleDeleteMed}
        />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-serif text-textPrimary">Previsioni di Oggi</h2>
            <button 
                onClick={() => { setEditingMed(null); setShowForm(true); }}
                className="bg-brandPrimary text-white p-2 rounded-xl shadow-sm hover:scale-105 transition-all text-xs font-bold flex items-center gap-1"
            >
              <PlusCircle size={16}/> Nuovo
            </button>
          </div>

          <div className="space-y-3">
            {todaysInstances.length === 0 ? (
                <div className="text-center py-10 bg-white/50 rounded-2xl border border-dashed border-brandPrimary/30">
                  <p className="text-textSecondary">Nessun farmaco in programma per oggi.</p>
                </div>
            ) : todaysInstances.map((instance, index) => (
              <DoseInstanceRow key={index} instance={instance} onToggleTaken={handleToggleTaken} onSnooze={handleSnooze} />
            ))}
          </div>
          
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-brandPrimary/10 mt-6">
             {AdherenceSummary}
          </div>
        </>
      )}
      
      {!showForm && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl flex items-start gap-3 mt-8 shadow-sm">
            <AlertTriangle className="text-yellow-600 mt-0.5 flex-shrink-0" size={20} />
            <p className="text-[13px] font-medium leading-relaxed">Nota di Sicurezza: Qualsiasi integratore o farmaco nuovo deve essere approvato dal tuo medico. L'app serve solo per ricordarti gli orari.</p>
        </div>
      )}
    </div>
  );
};

const DoseInstanceRow: React.FC<{ instance: DoseInstance, onToggleTaken: (i: DoseInstance) => void, onSnooze: (i: DoseInstance, m: number) => void }> = ({ instance, onToggleTaken, onSnooze }) => {
    const statusStyles = {
        'Preso': 'bg-green-100 text-green-700 border border-green-200',
        'Ora': 'bg-red-500 text-white shadow-md animate-pulse border border-red-600',
        'Tra poco': 'bg-yellow-100 text-yellow-700 border border-yellow-200',
        'Saltato': 'bg-slate-100 text-slate-500 border border-slate-200 line-through opacity-70',
        'In arrivo': 'bg-brandPrimaryTint text-brandPrimary border border-brandPrimary/20',
    };

    return (
        <div className={`p-4 rounded-2xl flex items-center justify-between transition-all border ${instance.isTaken ? 'bg-slate-50 border-slate-200' : 'bg-white shadow-sm border-brandPrimary/10'}`}>
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                   {instance.isTaken ? <CheckCircle2 size={24}/> : <Pill size={24}/>}
                </div>
                <div>
                    <p className={`font-bold text-[15px] ${instance.isTaken ? 'text-textSecondary line-through' : 'text-textPrimary'}`}>
                      {instance.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-bold text-textSecondary">{instance.dose} {instance.unit}</span>
                      <span className="text-xs text-textMuted">•</span>
                      <span className="text-xs font-medium text-textSecondary flex items-center gap-1"><Clock size={10}/> {instance.originalTime}</span>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
                <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-md ${statusStyles[instance.status]}`}>
                  {instance.status}
                </span>
                <button 
                  onClick={() => onToggleTaken(instance)} 
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-transform active:scale-95 ${instance.isTaken ? 'bg-slate-200 text-slate-600' : 'bg-brandPrimary text-white shadow-sm'}`}
                >
                  {instance.isTaken ? 'Annulla' : 'Segna Preso'}
                </button>
            </div>
        </div>
    );
};

const MedicationForm: React.FC<{ med: Medication | null; onSave: (med: Medication) => void; onCancel: () => void; onDelete: (id: string) => void; }> = ({ med, onSave, onCancel, onDelete }) => {
  const [form, setForm] = useState<Medication>(med || {
    id: `med_${Date.now()}`,
    name: '',
    dose: '',
    unit: 'mg',
    scheduleType: 'times',
    times: ['08:00'],
    slots: [],
    slotTimes: {},
    repeatDays: [0, 1, 2, 3, 4, 5, 6],
    startDateISO: new Date().toISOString().split('T')[0],
    endDateISO: '',
    alarmsEnabled: true,
    remindMinutes: 0,
    notes: '',
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as any;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const addTime = () => setForm(prev => ({...prev, times: [...(prev.times || []), '20:00']}));
  const removeTime = (index: number) => setForm(prev => ({...prev, times: (prev.times || []).filter((_, i) => i !== index)}));

  const handleDayToggle = (dayIndex: number) => {
    const currentDays = form.repeatDays || [];
    const newDays = currentDays.includes(dayIndex) ? currentDays.filter(d => d !== dayIndex) : [...currentDays, dayIndex];
    setForm(prev => ({ ...prev, repeatDays: newDays.sort() }));
  };

  const daysOfWeek = ['D', 'L', 'M', 'M', 'G', 'V', 'S'];

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="bg-white p-6 rounded-3xl shadow-lg border border-brandPrimary/10 space-y-5 animate-fade-in relative z-10 text-left">
      <h3 className="text-xl font-bold font-serif text-brandPrimaryDark mb-4">{med ? 'Modifica Farmaco' : 'Aggiungi Farmaco'}</h3>
      
      <div>
        <label className="block text-sm font-bold text-textPrimary mb-1">Nome Farmaco/Integratore</label>
        <input type="text" name="name" value={form.name} onChange={handleInput} className="w-full p-3 rounded-xl border border-border bg-slate-50 focus:ring-2 focus:ring-brandPrimary outline-none text-[15px]" placeholder="es. Magnesio Supremo, Paracetamolo..." required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-textPrimary mb-1">Dose / Quantità</label>
          <input type="number" name="dose" value={form.dose} onChange={handleInput} className="w-full p-3 rounded-xl border border-border bg-slate-50 focus:ring-2 focus:ring-brandPrimary outline-none text-[15px]" placeholder="es. 1" required />
        </div>
        <div>
          <label className="block text-sm font-bold text-textPrimary mb-1">Unità di misura</label>
          <select name="unit" value={form.unit} onChange={handleInput} className="w-full p-3 rounded-xl border border-border bg-slate-50 focus:ring-2 focus:ring-brandPrimary outline-none text-[15px]">
              <option value="mg">mg</option>
              <option value="mcg">mcg</option>
              <option value="mL">mL</option>
              <option value="capsule">capsula/e</option>
              <option value="gocce">gocce</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-textPrimary mb-2">Orari di assunzione</label>
        <div className="space-y-2">
            {(form.times || []).map((time, index) => (
                <div key={index} className="flex items-center gap-2">
                    <input type="time" value={time} onChange={e => {
                        const newTimes = [...(form.times || [])];
                        newTimes[index] = e.target.value;
                        setForm(p => ({...p, times: newTimes}));
                    }} className="flex-1 p-3 rounded-xl border border-border bg-slate-50 focus:ring-2 focus:ring-brandPrimary outline-none text-[15px]" />
                    {(form.times || []).length > 1 && <button type="button" onClick={() => removeTime(index)} className="text-red-500 font-bold p-3 bg-red-50 rounded-xl hover:bg-red-100"><Trash2 size={20}/></button>}
                </div>
            ))}
            <button type="button" onClick={addTime} className="text-brandPrimary text-sm font-bold flex items-center gap-1 mt-2 hover:underline"><PlusCircle size={16}/> Aggiungi un altro orario</button>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-textSecondary"/>
            <span className="text-sm font-bold text-textPrimary">Vuoi un allarme per questo farmaco?</span>
          </div>
          <input type="checkbox" name="alarmsEnabled" checked={form.alarmsEnabled} onChange={handleInput} className="w-5 h-5 accent-brandPrimary" />
      </div>

      <div>
          <label className="block text-sm font-bold text-textPrimary mb-2">Giorni della settimana</label>
          <div className="flex justify-between gap-1">
              {daysOfWeek.map((day, index) => (
                  <button type="button" key={index} onClick={() => handleDayToggle(index)} className={`w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center transition-colors hover:scale-105 ${(form.repeatDays || []).includes(index) ? 'bg-brandPrimary text-white shadow-sm' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                      {day}
                  </button>
              ))}
          </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-brandPrimary/10">
        <button type="button" onClick={onCancel} className="flex-1 font-bold text-textPrimary bg-slate-100 py-4 rounded-xl hover:bg-slate-200 active:scale-95 transition-all text-sm">Annulla</button>
        <button type="submit" className="flex-1 bg-brandPrimary text-white font-bold py-4 rounded-xl hover:bg-brandPrimaryDark shadow-md active:scale-95 transition-all text-sm">{med ? 'Aggiorna' : 'Salva'}</button>
      </div>
      {med && <button type="button" onClick={() => onDelete(med.id)} className="w-full font-bold text-red-500 bg-red-50 py-3 rounded-xl hover:bg-red-100 active:scale-95 transition-all mt-3 text-sm flex justify-center items-center gap-2"><Trash2 size={16}/> Elimina Farmaco</button>}
    </form>
  );
};

export default Medications;

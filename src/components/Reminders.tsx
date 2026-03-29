import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getLocalStorageItem, setLocalStorageItem } from './utils';

// --- Types ---
type Repeat = 'none' | 'hourly' | 'daily';
type Reminder = {
  id: string;
  text: string;
  time: string;
  repeat: Repeat;
  enabled: boolean;
};

// --- Icons ---
const WarningIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 9v4" />
        <path d="M10.24 3.957l-8.24 14.043a1.914 1.914 0 0 0 1.64 2.957h16.48a1.914 1.914 0 0 0 1.64 -2.957l-8.24 -14.043a1.914 1.914 0 0 0 -3.28 0z" />
        <path d="M12 17h.01" />
    </svg>
);

const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
    <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
  </svg>
);

const STORAGE_KEY = 'fibro_reminders';

const Reminders: React.FC = () => {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
    const notificationTimersRef = useRef<number[]>([]);
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
    const [notifSupported, setNotifSupported] = useState(true);

    useEffect(() => {
        const supported = 'Notification' in window;
        setNotifSupported(supported);
        const savedReminders = getLocalStorageItem<Reminder[]>(STORAGE_KEY, []);
        setReminders(savedReminders);
        if (supported) {
            setNotificationPermission(Notification.permission);
        }
    }, []);

    const scheduleNotifications = useCallback((allReminders: Reminder[]) => {
        notificationTimersRef.current.forEach(clearTimeout);
        notificationTimersRef.current = [];
        if (!('Notification' in window) || Notification.permission !== 'granted') return;

        const now = new Date();
        const todayKey = now.toISOString().split('T')[0];

        allReminders.forEach(reminder => {
            if (!reminder.enabled) return;
            const [hours, minutes] = reminder.time.split(':').map(Number);
            const baseNotificationTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

            if (reminder.repeat === 'hourly') {
                for (let h = now.getHours(); h < 24; h++) {
                    const notificationTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, minutes);
                    if (notificationTime > now) {
                        const delay = notificationTime.getTime() - now.getTime();
                        const timerId = window.setTimeout(() => {
                            new Notification('⏰ Promemoria Farmaci', { body: reminder.text, tag: `reminder-${reminder.id}-${h}`, icon: '/icon-192.png' });
                        }, delay);
                        notificationTimersRef.current.push(timerId);
                    }
                }
            } else {
                const lastTriggered = getLocalStorageItem(`reminder_triggered_${reminder.id}`, '');
                if (reminder.repeat === 'daily' && lastTriggered === todayKey) return;
                if (baseNotificationTime > now) {
                    const delay = baseNotificationTime.getTime() - now.getTime();
                    const timerId = window.setTimeout(() => {
                        new Notification('⏰ Promemoria Farmaci', { body: reminder.text, tag: `reminder-${reminder.id}`, icon: '/icon-192.png' });
                        setLocalStorageItem(`reminder_triggered_${reminder.id}`, todayKey);
                    }, delay);
                    notificationTimersRef.current.push(timerId);
                }
            }
        });
    }, []);

    useEffect(() => {
        scheduleNotifications(reminders);
        return () => { notificationTimersRef.current.forEach(clearTimeout); };
    }, [reminders, scheduleNotifications]);

    const handleSave = (reminder: Reminder) => {
        const newReminders = [...reminders];
        const index = newReminders.findIndex(r => r.id === reminder.id);
        if (index > -1) newReminders[index] = reminder;
        else newReminders.push(reminder);
        setReminders(newReminders);
        setLocalStorageItem(STORAGE_KEY, newReminders);
        setShowForm(false);
        setEditingReminder(null);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Sei sicura di voler eliminare questo promemoria?")) {
            const newReminders = reminders.filter(r => r.id !== id);
            setReminders(newReminders);
            setLocalStorageItem(STORAGE_KEY, newReminders);
        }
    };

    const handleToggleEnable = (id: string) => {
        const newReminders = reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r);
        setReminders(newReminders);
        setLocalStorageItem(STORAGE_KEY, newReminders);
    };

    const handleRequestPermission = async () => {
        if (!('Notification' in window)) {
            alert("Questo browser non supporta le notifiche. Su iPhone, aggiungi l'app alla schermata Home e riprova.");
            return;
        }
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        if (permission === 'granted') scheduleNotifications(reminders);
    };

    return (
        <div className="space-y-4">

            {/* Banner: browser non supporta notifiche */}
            {!notifSupported && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl flex items-start gap-3">
                    <WarningIcon />
                    <div>
                        <p className="font-bold text-base">Notifiche non disponibili</p>
                        <p className="text-sm mt-1">Su iPhone/iPad aggiungi l'app alla <strong>schermata Home</strong> (icona Condividi → "Aggiungi a schermata Home") e poi torna qui.</p>
                    </div>
                </div>
            )}

            {/* Banner: permesso non ancora richiesto */}
            {notifSupported && notificationPermission === 'default' && (
                <div className="bg-purple-50 border border-purple-200 text-purple-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <BellIcon />
                        <p className="font-semibold text-base">Abilita le notifiche per ricevere i promemoria farmaci.</p>
                    </div>
                    <button
                        onClick={handleRequestPermission}
                        className="bg-purple-600 text-white font-bold py-2 px-5 rounded-xl hover:bg-purple-700 transition-colors flex-shrink-0 min-h-[44px] active:scale-95"
                    >
                        Abilita ora
                    </button>
                </div>
            )}

            {/* Banner: permesso negato */}
            {notifSupported && notificationPermission === 'denied' && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl flex items-start gap-3">
                    <WarningIcon />
                    <div>
                        <p className="font-bold text-base">Permesso negato dal browser</p>
                        <p className="text-sm mt-1">Vai nelle <strong>Impostazioni del browser → Notifiche</strong> e sblocca questo sito per ricevere i promemoria.</p>
                    </div>
                </div>
            )}

            {/* Banner: notifiche attive */}
            {notifSupported && notificationPermission === 'granted' && (
                <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-2xl flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm font-semibold">Notifiche attive! Riceverai un avviso all'orario programmato.</p>
                </div>
            )}

            {showForm ? (
                <ReminderForm
                    reminder={editingReminder}
                    onSave={handleSave}
                    onCancel={() => { setShowForm(false); setEditingReminder(null); }}
                />
            ) : (
                <>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-purple-100 space-y-3">
                        <h2 className="text-xl font-bold text-purple-900">I tuoi Promemoria</h2>
                        {reminders.length === 0 ? (
                            <p className="text-slate-500 py-4 text-center text-base">Nessun promemoria impostato. Aggiungine uno!</p>
                        ) : (
                            reminders.map(reminder => (
                                <div key={reminder.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex justify-between items-center gap-2">
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-base font-bold truncate ${!reminder.enabled ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{reminder.text}</p>
                                        <p className="text-sm text-slate-500">
                                            🕐 {reminder.time} · {reminder.repeat === 'none' ? 'Una volta' : reminder.repeat === 'daily' ? 'Ogni giorno' : 'Ogni ora'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button onClick={() => { setEditingReminder(reminder); setShowForm(true); }} className="text-purple-600 font-semibold text-sm">Modifica</button>
                                        <button onClick={() => handleDelete(reminder.id)} className="text-red-400 font-semibold text-sm">Elimina</button>
                                        <button
                                            onClick={() => handleToggleEnable(reminder.id)}
                                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${reminder.enabled ? 'bg-purple-600' : 'bg-slate-300'}`}
                                        >
                                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow ${reminder.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <button
                        onClick={() => { setEditingReminder(null); setShowForm(true); }}
                        className="w-full mt-2 text-base bg-purple-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-purple-700 transition-colors min-h-[52px] active:scale-95"
                    >
                        + Aggiungi Promemoria
                    </button>
                </>
            )}

            <div className="bg-amber-50 border border-amber-100 text-amber-800 p-3 rounded-2xl flex items-start gap-3">
                <WarningIcon />
                <div>
                    <p className="font-bold text-sm">Nota Importante</p>
                    <p className="text-xs mt-0.5">I promemoria funzionano solo quando l'app è aperta nel browser. Per farmaci critici, usa anche l'allarme del telefono come backup.</p>
                </div>
            </div>
        </div>
    );
};

const ReminderForm: React.FC<{ reminder: Reminder | null; onSave: (r: Reminder) => void; onCancel: () => void; }> = ({ reminder, onSave, onCancel }) => {
    const [form, setForm] = useState<Reminder>(reminder || {
        id: `reminder_${Date.now()}`,
        text: '',
        time: new Date().toTimeString().substring(0, 5),
        repeat: 'daily',
        enabled: true,
    });

    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl shadow-sm border border-purple-100 space-y-5">
            <h3 className="text-xl font-bold text-purple-900">{reminder ? 'Modifica Promemoria' : 'Nuovo Promemoria'}</h3>

            <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Testo del promemoria</label>
                <input
                    type="text" name="text" value={form.text} onChange={handleInput} required
                    className="p-3 block w-full rounded-xl border border-slate-200 bg-slate-50 text-base focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none"
                    placeholder="es. Prendere la Melatonina"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">Orario</label>
                    <input type="time" name="time" value={form.time} onChange={handleInput}
                        className="p-3 block w-full rounded-xl border border-slate-200 bg-slate-50 text-base focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">Ripetizione</label>
                    <select name="repeat" value={form.repeat} onChange={handleInput}
                        className="p-3 block w-full rounded-xl border border-slate-200 bg-slate-50 text-base focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none">
                        <option value="none">Una volta</option>
                        <option value="hourly">Ogni ora</option>
                        <option value="daily">Ogni giorno</option>
                    </select>
                </div>
            </div>

            <div className="flex gap-3">
                <button type="button" onClick={onCancel} className="flex-1 text-purple-700 bg-purple-50 border border-purple-200 font-bold py-3 px-4 rounded-xl hover:bg-purple-100 min-h-[52px] active:scale-95">
                    Annulla
                </button>
                <button type="submit" className="flex-1 bg-purple-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-purple-700 min-h-[52px] active:scale-95">
                    {reminder ? 'Aggiorna' : 'Salva'}
                </button>
            </div>
        </form>
    );
};

export default Reminders;
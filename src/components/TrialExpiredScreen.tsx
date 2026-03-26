import React, { useState } from 'react';
import { Lock, AlertCircle } from 'lucide-react';
import { unlockPremium } from './utils';

interface TrialExpiredScreenProps {
    onUnlock: () => void;
}

const TrialExpiredScreen: React.FC<TrialExpiredScreenProps> = ({ onUnlock }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const handleUnlock = () => {
        if (unlockPremium(code)) {
            onUnlock();
        } else {
            setError('Codice non valido. Controlla la tua email.');
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-6 text-center font-sans">
            <div className="max-w-md w-full">
                <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                        <Lock className="text-gray-400 w-10 h-10" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Periodo di prova terminato
                </h1>

                <p className="text-gray-600 mb-8">
                    Per continuare a utilizzare l'applicazione, inserisci il codice di attivazione che hai ricevuto via email dopo l'acquisto.
                </p>

                <div className="space-y-4 w-full">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Inserisci il tuo codice"
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brandPrimary/20 text-center text-lg"
                    />

                    <button
                        onClick={handleUnlock}
                        className="w-full bg-brandPrimary text-white py-4 rounded-xl font-bold text-lg hover:bg-brandPrimaryDark transition-all active:scale-95"
                    >
                        Attiva Applicazione
                    </button>

                    {error && (
                        <div className="text-red-500 text-sm flex items-center justify-center gap-1">
                            <AlertCircle size={14} /> {error}
                        </div>
                    )}
                </div>

                <div className="mt-12 text-sm text-gray-500">
                    Non hai ricevuto il codice? <br />
                    Controlla lo spam o contatta il supporto.
                </div>
            </div>
        </div>
    );
};

export default TrialExpiredScreen;

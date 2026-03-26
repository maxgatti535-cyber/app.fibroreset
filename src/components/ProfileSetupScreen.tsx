import React, { useState, useEffect } from 'react';
import { getLocalStorageItem } from './utils';

interface ProfileSetupScreenProps {
  onComplete: () => void;
}

const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({ onComplete }) => {
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [diagnosisStatus, setDiagnosisStatus] = useState('');
  const [painLevel, setPainLevel] = useState('');
  const [mainGoal, setMainGoal] = useState('');
  const [otherSymptoms, setOtherSymptoms] = useState('');

  useEffect(() => {
    setAge(getLocalStorageItem('profile.age', ''));
    setSex(getLocalStorageItem('profile.sex', ''));
    setDiagnosisStatus(getLocalStorageItem('profile.diagnosisStatus', ''));
    setPainLevel(getLocalStorageItem('profile.painLevel', ''));
    setMainGoal(getLocalStorageItem('profile.mainGoal', ''));
    setOtherSymptoms(getLocalStorageItem('profile.otherSymptoms', ''));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('profile.age', JSON.stringify(age));
    localStorage.setItem('profile.sex', JSON.stringify(sex));
    localStorage.setItem('profile.diagnosisStatus', JSON.stringify(diagnosisStatus));
    localStorage.setItem('profile.painLevel', JSON.stringify(painLevel));
    localStorage.setItem('profile.mainGoal', JSON.stringify(mainGoal));
    localStorage.setItem('profile.otherSymptoms', JSON.stringify(otherSymptoms));
    onComplete();
  };

  const isFormValid = age && sex && diagnosisStatus && painLevel && mainGoal;

  return (
    <div className="bg-creamBg min-h-screen flex flex-col justify-center items-center p-4">
      <div className="bg-surface p-6 rounded-2xl shadow-sm shadow-shadowSoft border border-brandPrimaryDark w-full max-w-md text-center">
          <h1 className="text-3xl font-bold text-brandPrimary mb-2 font-serif">
            Parlaci di Te
          </h1>
          <p className="text-lg text-textSecondary mb-8 max-w-md mx-auto">
            Queste informazioni aiuteranno il tuo Coach a personalizzare il Metodo RESET FIBRO in base ai tuoi sintomi.
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-4 text-left">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className="block text-lg font-medium text-textSecondary mb-1">Età</label>
                <input
                  type="number"
                  id="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="block w-full rounded-lg border-border bg-creamBg shadow-sm text-lg h-12 px-3 text-textPrimary placeholder:text-textMuted focus:border-transparent focus:ring-2 focus:ring-brandPrimary"
                  required
                />
              </div>
              <div>
                <label htmlFor="sex" className="block text-lg font-medium text-textSecondary mb-1">Sesso</label>
                <select id="sex" value={sex} onChange={(e) => setSex(e.target.value)} className="block w-full rounded-lg border-border bg-creamBg shadow-sm text-lg h-12 px-3 text-textPrimary placeholder:text-textMuted focus:border-transparent focus:ring-2 focus:ring-brandPrimary" required>
                  <option value="">Seleziona...</option>
                  <option value="female">Donna</option>
                  <option value="male">Uomo</option>
                  <option value="other">Altro</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="diagnosisStatus" className="block text-lg font-medium text-textSecondary mb-1">Diagnosi</label>
              <select id="diagnosisStatus" value={diagnosisStatus} onChange={(e) => setDiagnosisStatus(e.target.value)} className="block w-full rounded-lg border-border bg-creamBg shadow-sm text-lg h-12 px-3 text-textPrimary placeholder:text-textMuted focus:border-transparent focus:ring-2 focus:ring-brandPrimary" required>
                <option value="">Seleziona...</option>
                <option value="diagnosed_years">Diagnosticata da anni</option>
                <option value="diagnosed_recent">Diagnosticata di recente</option>
                <option value="suspected">Sospetta ma non diagnosticata</option>
                <option value="chronic_fatigue">Sindrome Stanchezza Cronica</option>
              </select>
            </div>

            <div>
              <label htmlFor="painLevel" className="block text-lg font-medium text-textSecondary mb-1">Livello Dolore / Stanchezza</label>
              <select id="painLevel" value={painLevel} onChange={(e) => setPainLevel(e.target.value)} className="block w-full rounded-lg border-border bg-creamBg shadow-sm text-lg h-12 px-3 text-textPrimary placeholder:text-textMuted focus:border-transparent focus:ring-2 focus:ring-brandPrimary" required>
                <option value="">Seleziona da 1 a 10...</option>
                <option value="mild">1-3 (Lieve, gestibile)</option>
                <option value="moderate">4-6 (Moderato, molto fastidioso)</option>
                <option value="severe">7-8 (Grave, ti limita spesso)</option>
                <option value="extreme">9-10 (Estremo, bloccante)</option>
              </select>
            </div>

            <div>
              <label htmlFor="mainGoal" className="block text-lg font-medium text-textSecondary mb-1">Obiettivo Principale</label>
              <select id="mainGoal" value={mainGoal} onChange={(e) => setMainGoal(e.target.value)} className="block w-full rounded-lg border-border bg-creamBg shadow-sm text-lg h-12 px-3 text-textPrimary placeholder:text-textMuted focus:border-transparent focus:ring-2 focus:ring-brandPrimary" required>
                <option value="">Seleziona...</option>
                <option value="reduce_pain">Ridurre il dolore neuromuscolare</option>
                <option value="more_energy">Aumentare le energie (no stanchezza)</option>
                <option value="better_sleep">Migliorare la qualità del sonno</option>
                <option value="brain_fog">Ridurre la nebbia mentale (Brain Fog)</option>
              </select>
            </div>

            <div>
              <label htmlFor="otherSymptoms" className="block text-lg font-medium text-textSecondary mb-1">Altri Sintomi o Condizioni</label>
              <textarea
                id="otherSymptoms"
                value={otherSymptoms}
                onChange={(e) => setOtherSymptoms(e.target.value)}
                className="block w-full rounded-lg border-border bg-creamBg shadow-sm text-lg p-3 text-textPrimary placeholder:text-textMuted focus:border-transparent focus:ring-2 focus:ring-brandPrimary"
                rows={2}
                placeholder="es. Colon irritabile, Emicranie, Ansia... (opzionale)"
              />
            </div>

            <button
              type="submit"
              disabled={!isFormValid}
              className="w-full text-lg bg-brandPrimary text-white font-bold py-3 px-4 rounded-lg hover:bg-brandPrimaryDark transition-colors disabled:bg-textMuted min-h-[52px] mt-4"
            >
              Inizia il Percorso
            </button>
          </form>
      </div>
    </div>
  );
};

export default ProfileSetupScreen;
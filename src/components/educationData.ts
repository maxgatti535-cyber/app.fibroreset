export interface FlareCard {
  id: string;
  title: string;
  description: string;
  time: string;
  signals: string[];
  protocol: { step: string; desc: string }[];
  score: string;
  journalPrompt: string;
}

export const flareCards: FlareCard[] = [
  {
    id: "01",
    title: "Flare da Sovraccarico Mentale",
    description: "Confusione, irritabilità, pensieri accelerati.",
    time: "10 minuti",
    signals: [
      "Mente confusa o annebbiata (fibro fog)",
      "Irritabilità e difficoltà di concentrazione",
      "Sensazione di sovrastimolazione",
      "Pensieri accelerati o ripetitivi"
    ],
    protocol: [
      { step: "1. Respiro lento", desc: "3 min — inspira 4 sec, espira 6 sec" },
      { step: "2. Riduci stimoli", desc: "Allontana telefono, spegni rumori, abbassa luci" },
      { step: "3. Idratazione calda", desc: "Bevi acqua o tisana lentamente" },
      { step: "4. Riposo passivo", desc: "Sdraiati, occhi chiusi, senza agenda" }
    ],
    score: "Protezione (3–6)",
    journalPrompt: "Cosa mi ha aiutato questa volta:"
  },
  {
    id: "02",
    title: "Flare da Freddo e Tensione Muscolare",
    description: "Rigidità, freddo interno, dolori al tatto.",
    time: "10 minuti",
    signals: [
      "Rigidità aumentata a collo e spalle",
      "Sensazione di freddo interno",
      "Muscoli contratti o doloranti al tatto",
      "Difficoltà nei movimenti semplici"
    ],
    protocol: [
      { step: "1. Calore locale", desc: "Coperta, borsa d’acqua calda o piastra" },
      { step: "2. Micro movimento", desc: "Rotazioni lente spalle e collo — senza forzare" },
      { step: "3. Respiro profondo", desc: "Espira immaginando il calore che si diffonde" },
      { step: "4. Bevanda calda", desc: "Tisana allo zenzero o brodo caldo" }
    ],
    score: "Protezione (3–6)",
    journalPrompt: "Il calore che ha funzionato meglio:"
  },
  {
    id: "03",
    title: "Flare da Fatigue Improvvisa",
    description: "Calo di energia, gambe pesanti.",
    time: "10 minuti",
    signals: [
      "Calo improvviso di energia",
      "Gambe pesanti, braccia senza forza",
      "Difficoltà a restare in piedi o seduta",
      "Mente rallentata, parole difficili da trovare"
    ],
    protocol: [
      { step: "1. Fermati subito", desc: "Siediti o sdraiati — non resistere al segnale" },
      { step: "2. Occhi chiusi", desc: "5 minuti al buio o con luce soffusa" },
      { step: "3. Audio Reset", desc: "Ascolta un audio rilassante breve" },
      { step: "4. Snack semplice", desc: "Banana, noci o crackers integrali" }
    ],
    score: "Protezione (3–6)",
    journalPrompt: "Lo snack che mi ha dato più energia:"
  },
  {
    id: "04",
    title: "Flare Emotivo e da Stress",
    description: "Pianto, ansia, peso nel petto.",
    time: "10 minuti",
    signals: [
      "Tensione emotiva o pianto improvviso",
      "Sensazione di peso nel petto",
      "Ansia o agitazione interiore",
      "Dolore che aumenta con lo stress"
    ],
    protocol: [
      { step: "1. Mano sul petto", desc: "Senti il ritmo del cuore — gesto di sicurezza" },
      { step: "2. Espirazione lunga", desc: "Espira 3 volte più a lungo dell’inspirazione" },
      { step: "3. Scrivi nel diario", desc: "Una sola frase su come ti senti adesso" },
      { step: "4. Riduci richieste", desc: "Cancella tutto il non essenziale di oggi" }
    ],
    score: "Protezione (3–6)",
    journalPrompt: "La frase che ho scritto nel diario:"
  },
  {
    id: "05",
    title: "Flare da Sonno Non Riparatore",
    description: "Rigidità al mattino, umore basso.",
    time: "10 minuti",
    signals: [
      "Risveglio con sensazione di non aver dormito",
      "Rigidità intensa al mattino",
      "Testa pesante, visione offuscata",
      "Umore basso già dal risveglio"
    ],
    protocol: [
      { step: "1. Stretch leggero", desc: "Rotazioni lente caviglie e spalle nel letto" },
      { step: "2. Luce naturale", desc: "Siediti vicino a una finestra 5 minuti" },
      { step: "3. Bevanda tiepida", desc: "Acqua calda con limone o tisana" },
      { step: "4. Una sola azione", desc: "Pianifica solo 1 cosa — niente liste lunghe" }
    ],
    score: "Protezione (3–6)",
    journalPrompt: "Come mi sono sentita dopo la prima ora:"
  },
  {
    id: "06",
    title: "Flare da Sforzo Fisico Eccessivo",
    description: "Senso di aver esagerato, dolore post-attività.",
    time: "10 minuti",
    signals: [
      "Dolore diffuso dopo attività fisica",
      "Stanchezza intensa nelle ore successive",
      "Senso di ‘aver esagerato’",
      "Rigidità aumentata il giorno dopo"
    ],
    protocol: [
      { step: "1. Fermati e riposa", desc: "Nessuna attività aggiuntiva per le prossime ore" },
      { step: "2. Calore o ghiaccio", desc: "Sul muscolo più dolorante per 10 minuti" },
      { step: "3. Idratazione", desc: "Almeno 2 bicchieri d’acqua subito" },
      { step: "4. Nota nel diario", desc: "Cosa ho fatto — per riconoscere il limite" }
    ],
    score: "Protezione (3–6)",
    journalPrompt: "Cosa farei diversamente la prossima volta:"
  },
  {
    id: "07",
    title: "Flare da Cambiamento Meteo",
    description: "Pressione nel corpo, dolore da pioggia/umidità.",
    time: "10 minuti",
    signals: [
      "Dolore che aumenta con pioggia o umidità",
      "Rigidità mattutina in giornate fredde",
      "Sensazione di ‘pressione’ nel corpo",
      "Affaticamento senza causa apparente"
    ],
    protocol: [
      { step: "1. Protezione termica", desc: "Vesti a strati, copri le articolazioni" },
      { step: "2. Doccia calda", desc: "10 minuti di calore diffuso sul corpo" },
      { step: "3. Riduzione attività", desc: "Giornata in modalità Protezione" },
      { step: "4. Tisana", desc: "Zenzero + curcuma + miele" }
    ],
    score: "Protezione (3–6)",
    journalPrompt: "Che tempo fa oggi e come mi sento:"
  },
  {
    id: "08",
    title: "Flare da Ciclo Mestruale",
    description: "Gonfiore, sensibilità emotiva, stanchezza.",
    time: "10 minuti",
    signals: [
      "Aumento dolore nei giorni del ciclo",
      "Stanchezza amplificata",
      "Sensibilità emotiva maggiore",
      "Gonfiore e tensione addominale"
    ],
    protocol: [
      { step: "1. Calore addominale", desc: "Borsa d’acqua calda sull’addome" },
      { step: "2. Riposo prioritario", desc: "Riduci impegni al minimo in questi giorni" },
      { step: "3. Pasto leggero", desc: "Evita cibi freddi e zuccheri" },
      { step: "4. Gentilezza", desc: "Abbassa le aspettative su te stessa" }
    ],
    score: "Protezione (3–6)",
    journalPrompt: "Come mi sento rispetto al solito:"
  },
  {
    id: "09",
    title: "Flare da Sovrastimolazione Sensoriale",
    description: "Luci e rumori fastidiosi, troppo tutto.",
    time: "10 minuti",
    signals: [
      "Rumori normali sembrano insopportabili",
      "Luci fastidiose o abbacinanti",
      "Sensibilità al tatto aumentata",
      "Sensazione di ‘troppo tutto’"
    ],
    protocol: [
      { step: "1. Silenzio immediato", desc: "Allontanati da rumori e schermi" },
      { step: "2. Luce soffusa", desc: "Tende chiuse, luce calda e bassa" },
      { step: "3. Touch minimo", desc: "Evita abiti stretti, prediligi tessuti morbidi" },
      { step: "4. Respiro 4-6", desc: "5 cicli lenti in ambiente tranquillo" }
    ],
    score: "Protezione (3–6)",
    journalPrompt: "Cosa riduce la mia sensibilità sensoriale:"
  },
  {
    id: "10",
    title: "Flare da Isolamento e Solitudine",
    description: "Tristezza, vogia di isolarsi e piangere.",
    time: "10 minuti",
    signals: [
      "Senso di incomprensione da parte degli altri",
      "Tristezza o malinconia improvvisa",
      "Voglia di isolarsi ma anche di connessione",
      "Dolore amplificato dalla solitudine emotiva"
    ],
    protocol: [
      { step: "1. Connessione gentile", desc: "Scrivi un messaggio a una persona fidata" },
      { step: "2. Attività piacevole", desc: "Musica, film o lettura leggera" },
      { step: "3. Diario emotivo", desc: "Scrivi senza filtri come ti senti" },
      { step: "4. Ricorda", desc: "Non sei sola — questo passa" }
    ],
    score: "Protezione (3–6)",
    journalPrompt: "Chi mi fa sentire capita:"
  },
  {
    id: "11",
    title: "Flare da Digestione Pesante",
    description: "Gonfiore, nausea, stanchezza post-prandiale.",
    time: "10 minuti",
    signals: [
      "Gonfiore e digestione lenta",
      "Nausea o pesantezza dopo i pasti",
      "Stanchezza post-prandiale intensa",
      "Dolore addominale o crampi"
    ],
    protocol: [
      { step: "1. Sdraiati sul fianco sx", desc: "Aiuta la digestione naturalmente" },
      { step: "2. Tisana digestiva", desc: "Finocchio, menta o zenzero" },
      { step: "3. Niente sforzi", desc: "Riposo per almeno 30 minuti" },
      { step: "4. Nota il trigger", desc: "Cosa hai mangiato che ha causato questo" }
    ],
    score: "Protezione (3–6)",
    journalPrompt: "Alimento che sembra avermi appesantita:"
  },
  {
    id: "12",
    title: "Flare da Ansia Anticipatoria",
    description: "Preoccupazione, tensione muscolare.",
    time: "10 minuti",
    signals: [
      "Preoccupazione per eventi futuri",
      "Tensione muscolare senza causa fisica",
      "Difficoltà a dormire per i pensieri",
      "Dolore che aumenta con l’ansia"
    ],
    protocol: [
      { step: "1. Grounding 5-4-3-2-1", desc: "5 cose che vedi, 4 che tocchi, 3 che senti" },
      { step: "2. Scrivi l'ansia", desc: "Esternalizzarla riduce il peso mentale" },
      { step: "3. Respiro 4-6", desc: "8 cicli lenti e consapevoli" },
      { step: "4. Una sola cosa", desc: "Torna al presente con una piccola azione" }
    ],
    score: "Protezione (3–6)",
    journalPrompt: "La preoccupazione che pesava di più:"
  },
  {
    id: "13",
    title: "Flare da Postura e Sedentarietà",
    description: "Rigidità, dolore cambiando posizione.",
    time: "10 minuti",
    signals: [
      "Dolore dopo lunga posizione seduta o sdraiata",
      "Rigidità localizzata a schiena e anche",
      "Senso di ‘incarognimento’ muscolare",
      "Difficoltà ad alzarsi o cambiare posizione"
    ],
    protocol: [
      { step: "1. Alzati lentamente", desc: "Senza scatti — rotola su un lato prima" },
      { step: "2. Micro movimento", desc: "2 minuti di cammino lento in casa" },
      { step: "3. Stretching dolce", desc: "Collo, spalle, anche — 20 sec per zona" },
      { step: "4. Cambia posizione", desc: "Ogni 30 minuti — programma un promemoria" }
    ],
    score: "Protezione (3–6)",
    journalPrompt: "La posizione che mi causa più disagio:"
  },
  {
    id: "14",
    title: "Flare da Senso di Colpa",
    description: "Sensazione di essere un peso, confronto.",
    time: "10 minuti",
    signals: [
      "Pensieri del tipo ‘dovrei fare di più’",
      "Confronto con la versione prima della fibromialgia",
      "Sensazione di essere un peso",
      "Dolore amplificato dall’autocritica"
    ],
    protocol: [
      { step: "1. Fermati", desc: "Non stai sbagliando. Stai gestendo il dolore." },
      { step: "2. Frase di compassione", desc: "Scrivi: ‘Sto facendo del mio meglio oggi’" },
      { step: "3. Lista 3 cose", desc: "Tre piccole cose fatte oggi — anche minime" },
      { step: "4. Respira", desc: "3 respiri profondi — la colpa non è un fatto" }
    ],
    score: "Protezione (3–6)",
    journalPrompt: "Una cosa di cui posso essere fiera :"
  },
  {
    id: "15",
    title: "Flare da Interruzione del Sonno",
    description: "Risvegli notturni, difficoltà a riaddormentarsi.",
    time: "10 minuti",
    signals: [
      "Risvegli frequenti durante la notte",
      "Difficoltà a riaddormentarsi",
      "Pensieri che girano senza fermarsi",
      "Dolore che aumenta nelle ore notturne"
    ],
    protocol: [
      { step: "1. Non guardare l’orologio", desc: "Coprilo — controllarlo aumenta l’ansia" },
      { step: "2. Respiro 4-6", desc: "10 cicli lenti nel buio" },
      { step: "3. Body scan", desc: "Porta attenzione a ogni parte del corpo" },
      { step: "4. Se non dormi", desc: "Dopo 20 min alzati, tisana calda, poi ritorna" }
    ],
    score: "Protezione (3–6)",
    journalPrompt: "Cosa mi aiuta a riaddormentarmi:"
  },
  {
    id: "16",
    title: "Flare da Mal di Testa e Nebbia",
    description: "Cefalea, fibro fog intenso.",
    time: "10 minuti",
    signals: [
      "Cefalea tensiva o pulsante",
      "Sensazione di pressione alla testa",
      "Fibro fog intenso",
      "Sensibilità alla luce e ai rumori"
    ],
    protocol: [
      { step: "1. Buio e silenzio", desc: "Stanza oscurata, elimina tutti gli stimoli" },
      { step: "2. Freddo o caldo", desc: "Impacco freddo sulla fronte o caldo al collo" },
      { step: "3. Idratazione", desc: "2 bicchieri d’acqua — l'acqua riduce la cefalea" },
      { step: "4. Riposo orizzontale", desc: "Sdraiati senza schermi per almeno 20 minuti" }
    ],
    score: "Protezione (3–6)",
    journalPrompt: "Cosa ha ridotto il mal di testa:"
  },
  {
    id: "17",
    title: "Flare da Sovraccarico Sociale",
    description: "Stanchezza dopo eventi, irritabilità.",
    time: "10 minuti",
    signals: [
      "Stanchezza dopo interazioni sociali",
      "Irritabilità verso le persone care",
      "Voglia di isolarsi completamente",
      "Dolore che aumenta dopo eventi sociali"
    ],
    protocol: [
      { step: "1. Spazio solo tuo", desc: "30 minuti senza dover parlare con nessuno" },
      { step: "2. Silenzio attivo", desc: "Niente telefono, niente notifiche" },
      { step: "3. Attività solitaria", desc: "Lettura, musica, passeggiata sola" },
      { step: "4. Confine gentile", desc: "Annulla o rimanda ciò che puoi rimandare" }
    ],
    score: "Protezione (3–6)",
    journalPrompt: "Di quanto silenzio ho bisogno oggi:"
  },
  {
    id: "18",
    title: "Flare da Alimentazione Irregolare",
    description: "Calo di energia per pasto saltato, digestione lenta.",
    time: "10 minuti",
    signals: [
      "Calo di energia per pasto saltato",
      "Gonfiore o stanchezza post-pasto",
      "Irritabilità da ipoglicemia",
      "Digestione lenta e pesante"
    ],
    protocol: [
      { step: "1. Snack immediato", desc: "Qualcosa di semplice: noci, banana, crackers" },
      { step: "2. Pasto leggero successivo", desc: "Niente recupero con pasto abbondante" },
      { step: "3. Orario fisso", desc: "Ripristina l’orario regolare" },
      { step: "4. Nota nel diario", desc: "Cosa ha causato il salto del pasto" }
    ],
    score: "Protezione (3–6)",
    journalPrompt: "Lo snack di emergenza che funziona meglio per me:"
  },
  {
    id: "19",
    title: "Flare da Ansia da Prestazione",
    description: "Pressione per dover fare cose, aspettative.",
    time: "10 minuti",
    signals: [
      "Pressione interna per dover fare cose",
      "Confronto con le aspettative di ieri",
      "Difficoltà a rallentare",
      "Dolore che aumenta sotto pressione"
    ],
    protocol: [
      { step: "1. Regola del 70%", desc: "Usa solo il 70% dell’energia disponibile oggi" },
      { step: "2. Riscrivi la lista", desc: "Tieni solo 1 cosa — cancella il resto" },
      { step: "3. Pausa non negoziabile", desc: "15 minuti di riposo programmato adesso" },
      { step: "4. Frase ancora", desc: "'Fare meno oggi mi protegge per domani'" }
    ],
    score: "Protezione (3–6)",
    journalPrompt: "La cosa che posso rimandare senza colpa:"
  },
  {
    id: "20",
    title: "Flare da Perdita di Motivazione",
    description: "Sensazione di sforzi vani, voglia di mollare.",
    time: "10 minuti",
    signals: [
      "Sensazione che gli sforzi non portino frutti",
      "Difficoltà a trovare energia anche emotiva",
      "Voglia di mollare il percorso",
      "Dolore che sembra non migliorare mai"
    ],
    protocol: [
      { step: "1. Rileggi il Giorno 1", desc: "Confronta come stavi all’inizio con oggi" },
      { step: "2. Micro-vittoria", desc: "Trova 1 sola cosa migliorata — anche piccola" },
      { step: "3. Contatta qualcuno", desc: "Una persona che capisce il percorso" },
      { step: "4. Ricorda", desc: "Il progresso nella fibromialgia è lento e reale" }
    ],
    score: "Stabilizzazione (7–10)",
    journalPrompt: "Una cosa che è migliorata rispetto a un mese fa:"
  }
];
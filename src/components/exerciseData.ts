export type RoutineLevel = 'protezione' | 'stabilizzazione' | 'espansione';

export interface ExerciseStep {
  name: string;
  duration: string;
  instruction: string;
  focus: string;
}

export interface FibroRoutine {
  level: RoutineLevel;
  title: string;
  subtitle: string;
  duration: string;
  description: string;
  safetyTip: string;
  exercises: ExerciseStep[];
}

export const movementRoutines: FibroRoutine[] = [
  {
    level: "protezione",
    title: "Movimento a Letto",
    subtitle: "Giorni a energia zero",
    duration: "3 - 5 minuti",
    description: "Quando il corpo è bloccato, il movimento deve essere invisibile. L'obiettivo qui non è 'allenarsi', ma comunicare al sistema nervoso che il corpo è un posto sicuro, sciogliendo la rigidità senza usare la gravità.",
    safetyTip: "Se un movimento aumenta il dolore, fermati subito e torna solo a respirare. Non devi forzare nulla.",
    exercises: [
      {
        name: "1. Scanner del Respiro",
        duration: "1 minuto",
        instruction: "Sdraiata a pancia in su. Metti una mano sull'addome e una sul petto. Nota quale si muove di più senza cercare di cambiarlo. Senti il peso del corpo sostenuto dal materasso.",
        focus: "Calma il sistema nervoso"
      },
      {
        name: "2. Micro-Rotazioni delle Caviglie",
        duration: "1 minuto",
        instruction: "Senza sollevare le gambe, ruota dolcemente le caviglie verso l'esterno per 5 volte, e poi verso l'interno. Il movimento deve essere lento, fluido e indolore.",
        focus: "Migliora la circolazione"
      },
      {
        name: "3. Scioglimento Polsi e Dita",
        duration: "1 minuto",
        instruction: "Apri e chiudi le mani a pugno molto lentamente. Poi fai delle piccole rotazioni con i polsi. Immagina di muoverti sott'acqua.",
        focus: "Riduce la rigidità mattutina"
      },
      {
        name: "4. Dondolio Lento",
        duration: "2 minuti",
        instruction: "Piega le ginocchia mantenendo i piedi sul letto. Fai cadere dolcemente entrambe le ginocchia di pochi centimetri verso destra, poi torna al centro e vai verso sinistra. Un minuscolo dondolio pelvico.",
        focus: "Rilassa la zona lombare bassa"
      }
    ]
  },
  {
    level: "stabilizzazione",
    title: "Stretching su Sedia",
    subtitle: "Per mantenere elasticità e ritmo",
    duration: "5 - 10 minuti",
    description: "Ideale quando hai un po' di energia ma stare in piedi richiede troppo sforzo. Usa una sedia stabile, senza rotelle. Non arrivare mai al limite massimo dell'allungamento (regola del 70%).",
    safetyTip: "Tieni sempre i piedi ben piantati a terra per dare sicurezza alla colonna vertebrale.",
    exercises: [
      {
        name: "1. Allungamento del Collo",
        duration: "1 minuto",
        instruction: "Incrocia le mani, appoggiale dietro la testa e abbassa dolcemente il mento verso lo sterno col solo peso delle braccia, senza tirare. Tieni la posizione per 3 respiri, poi rilascia.",
        focus: "Scioglie la tensione cervicale"
      },
      {
        name: "2. Gatto-Mucca da Seduta",
        duration: "2 minuti",
        instruction: "Mani sulle ginocchia. Inspirando, inarca leggermente la schiena, apri il petto e guarda su. Espirando, curva la colonna all'indietro e guarda l'ombelico. Ripeti 5 volte fluidamente.",
        focus: "Mobilizza la colonna vertebrale"
      },
      {
        name: "3. Torsione Gentile",
        duration: "2 minuti (1 per lato)",
        instruction: "Mano destra sul ginocchio sinistro. Guarda lentamente dietro la tua spalla sinistra senza forzare. Tieni 3 respiri, torna al centro e ripeti dall'altro lato.",
        focus: "Migliora la mobilità dorsale"
      },
      {
        name: "4. Estensione Gamba Alternata",
        duration: "2 minuti",
        instruction: "Allunga una gamba in avanti sollevando il piede da terra di pochi centimetri. Tieni per 3 secondi, poi riappoggialo. Alterna le gambe 5-6 volte. Non sforzare l'anca.",
        focus: "Attivazione dolce dei quadricipiti"
      }
    ]
  },
  {
    level: "espansione",
    title: "Passeggiata Consapevole",
    subtitle: "Rinforzo gentile e respiro",
    duration: "10 - 15 minuti",
    description: "Quando lo Score ti permette di uscire in modalità Espansione. La camminata non è per dimagrire, è per ossigenare i muscoli e ripristinare il tono dell'umore. Fermati prima di sentirti stanca.",
    safetyTip: "Usa scarpe molto ammortizzate per proteggere le articolazioni. Imposta un timer a 5 minuti per ricordarti di tornare indietro senza esagerare.",
    exercises: [
      {
        name: "1. Preparazione Articolare",
        duration: "2 minuti prima di uscire",
        instruction: "In piedi, sollevati lentamente sulle punte dei piedi e torna giù. Fai 10 piccole rotazioni delle spalle all'indietro. Così 'riscaldi' il fluido tra le articolazioni.",
        focus: "Previene dolori da freddo"
      },
      {
        name: "2. Camminata a Ritmo Naturale",
        duration: "5 - 10 minuti",
        instruction: "Inizia a camminare. Concentrati sul ritmo dei tuoi piedi. Immagina una postura 'aperta', senza incurvare le spalle, ma mantieni le braccia rilassate ai lati.",
        focus: "Equilibrio cardiovascolare leggero"
      },
      {
        name: "3. Respiro in Cammino",
        duration: "Ogni 2 minuti",
        instruction: "Prova a contare i passi sul respiro: inspira per 3 passi, espira per 4 passi (o ciò che ti è comodo). L'espirazione leggermente più lunga calma il nervo vago.",
        focus: "Ossigena senza iperventilare"
      },
      {
        name: "4. Allungamento Finale Appoggiato",
        duration: "2 minuti (al ritorno)",
        instruction: "Appoggia le mani a un muro o a un albero. Fai un passo indietro con una gamba e spingi il tallone verso il terreno mantenendo la gamba dritta (strech del polpaccio). 30 sec per gamba.",
        focus: "Scarica le tensioni delle gambe"
      }
    ]
  }
];
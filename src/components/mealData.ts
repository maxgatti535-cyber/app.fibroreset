export interface Recipe {
  id: string;
  title: string;
  category: 'Colazione' | 'Pranzo' | 'Cena' | 'Snack';
  prepTime: string;
  cookTime: string;
  energyLevel: 'Basso Sforzo' | 'Medio Sforzo';
  ingredients: string[];
  instructions: string[];
  fibroTip: string;
}

export const fibroRecipes: Recipe[] = [
  // --- COLAZIONI ---
  {
    id: "col-1",
    title: "Porridge Calmante alla Cannella",
    category: "Colazione",
    prepTime: "2 min",
    cookTime: "5 min",
    energyLevel: "Basso Sforzo",
    ingredients: [
      "4 cucchiai di fiocchi d'avena",
      "1 tazza di latte vegetale (mandorla o avena)",
      "1 pizzico di cannella e curcuma",
      "1 cucchiaino di semi di chia",
      "3 noci spezzettate"
    ],
    instructions: [
      "In un pentolino, unisci l'avena, il latte vegetale, la cannella e la curcuma.",
      "Cuoci a fuoco basso per circa 5 minuti, mescolando dolcemente finché diventa cremoso.",
      "Spegni il fuoco, aggiungi i semi di chia e lascia riposare un minuto.",
      "Versa in una tazza o ciotola e guarnisci con le noci."
    ],
    fibroTip: "L'avena stabilizza l'energia mattutina, mentre curcuma e cannella spengono l'infiammazione senza pesare sullo stomaco."
  },
  {
    id: "col-2",
    title: "Crema di Avena Overnight (Zero Cottura)",
    category: "Colazione",
    prepTime: "5 min (la sera prima)",
    cookTime: "0 min",
    energyLevel: "Basso Sforzo",
    ingredients: [
      "40g di fiocchi d'avena",
      "1 vasetto di yogurt di soia o greco senza lattosio",
      "Mezza mela grattugiata",
      "Un pizzico di zenzero in polvere"
    ],
    instructions: [
      "La sera prima, in un barattolo o tazza, mescola lo yogurt, l'avena, la mela e lo zenzero.",
      "Copri e lascia riposare in frigorifero tutta la notte.",
      "Al mattino è pronto da mangiare, senza accendere i fornelli."
    ],
    fibroTip: "Ideale da preparare quando la sera hai ancora uno spiraglio di energia, ti salva nelle mattinate dominate dal fibro-fog."
  },
  {
    id: "col-3",
    title: "Muffin Salato in Tazza ai Ceci",
    category: "Colazione",
    prepTime: "2 min",
    cookTime: "3 min",
    energyLevel: "Basso Sforzo",
    ingredients: [
      "3 cucchiai di farina di ceci",
      "Acqua q.b. per creare una pastella",
      "1 cucchiaino d'olio extravergine",
      "Un pizzico di sale e curcuma",
      "Lievito istantaneo (punta di cucchiaino)"
    ],
    instructions: [
      "In una tazza adatta al microonde, sbatti la farina di ceci con acqua, olio, sale, curcuma e lievito.",
      "Metti nel microonde per 2-3 minuti alla massima potenza.",
      "Sforma e mangia tiepido, magari con un filo di crema di sesamo (tahina) o avocado."
    ],
    fibroTip: "Se la mattina hai bisogno di salato e proteine ma non riesci a stare in piedi ai fornelli, il microonde è un alleato prezioso."
  },
  {
    id: "col-4",
    title: "Toast di Segale, Avocado e Salmone",
    category: "Colazione",
    prepTime: "2 min",
    cookTime: "2 min",
    energyLevel: "Basso Sforzo",
    ingredients: [
      "1 fetta di pane di segale (ottimo per la glicemia)",
      "Mezzo avocado morbido",
      "1 fetta di salmone affumicato",
      "Succo di limone e pepe nero"
    ],
    instructions: [
      "Tosta leggermente la fetta di pane di segale.",
      "Schiaccia l'avocado maturo direttamente sul pane usando una forchetta.",
      "Aggiungi la fetta di salmone, il limone e una spolverata di pepe nero."
    ],
    fibroTip: "Grassi sani e Omega-3 potenti fin dal primo mattino per combattere l'infiammazione articolare e sostenere la mente."
  },
  {
    id: "col-5",
    title: "Pancake Express Integrali",
    category: "Colazione",
    prepTime: "5 min",
    cookTime: "5 min",
    energyLevel: "Medio Sforzo",
    ingredients: [
      "Mezza banana matura schiacciata",
      "1 uovo o 3 cucchiai di albume",
      "2 cucchiai di farina d'avena o integrale",
      "Un cucchiaino d'olio di cocco o girasole per cuocere"
    ],
    instructions: [
      "Schiaccia la banana e mescolala in una ciotolina con l'uovo e la farina.",
      "Scalda la padella unta e versa la pastella formando dei mini-pancake.",
      "Gira quando fanno le bollicine (circa 2 min per lato).",
      "Servi con sciroppo d'acero o burro di mandorle."
    ],
    fibroTip: "Meno infiammatori dei dolci tradizionali. Preparane il doppio alla domenica e surgelali per averli pronti in settimana!"
  },

  // --- PRANZI ---
  {
    id: "pranzo-1",
    title: "Insalata Tiepida di Lenticchie e Curcuma",
    category: "Pranzo",
    prepTime: "5 min",
    cookTime: "5 min",
    energyLevel: "Basso Sforzo",
    ingredients: [
      "1 barattolo di lenticchie precotte (sciacquate benissimo)",
      "2 carote (anche pre-tagliate o surgelate)",
      "Olio extravergine di oliva",
      "Curcuma in polvere e pepe nero",
      "Succo di limone"
    ],
    instructions: [
      "Scalda un filo d'olio con la curcuma e il pepe.",
      "Aggiungi le carote a rondelle e salta per 2 minuti.",
      "Versa le lenticchie, scalda il tutto per 3 minuti.",
      "Condisci con limone fresco."
    ],
    fibroTip: "Usare legumi precotti non è una colpa, è un atto di rispetto per la tua energia! Se li sciacqui bene riduci il gonfiore."
  },
  {
    id: "pranzo-2",
    title: "Bowl di Riso Veloce Salmone e Spinaci",
    category: "Pranzo",
    prepTime: "2 min",
    cookTime: "2 min",
    energyLevel: "Basso Sforzo",
    ingredients: [
      "1 busta di riso integrale precotto",
      "1 fetta di salmone affumicato (o in scatola al naturale)",
      "1 manciata grande di spinacini freschi",
      "Olio Evo, limone e semi di sesamo"
    ],
    instructions: [
      "Scalda il riso integrale seguendo le indicazioni (1 min microonde).",
      "Metti gli spinacini freschi nella ciotola e versa il riso caldo sopra (questo 'cuocerà' dolcemente gli spinaci facilitando la digestione).",
      "Aggiungi il salmone spezzettato e i semi di sesamo."
    ],
    fibroTip: "Il calore del cereale sfibra la verdura, salvandoti dallo stare ai fornelli."
  },
  {
    id: "pranzo-3",
    title: "Wrap Veloce Tacchino e Avocado",
    category: "Pranzo",
    prepTime: "2 min",
    cookTime: "0 min",
    energyLevel: "Basso Sforzo",
    ingredients: [
      "1 piadina integrale o di mais",
      "Mezzo avocado schiacciato",
      "Fesa di tacchino arrosto di buona qualità",
      "Un pugno di rucola"
    ],
    instructions: [
      "Scalda la piadina per qualche secondo se preferisci.",
      "Spalma l'avocado come base (sostituisce ottiamente le salse industriali pesanti).",
      "Adagia la rucola e le fette di tacchino.",
      "Arrotola e gusta."
    ],
    fibroTip: "0% cottura. Alta idratazione e proteine magre. Ideale nei giorni in cui alzare una pentola sembra sollevare pesi."
  },
  {
    id: "pranzo-4",
    title: "Frittata Soffice di Spinaci e Curcuma",
    category: "Pranzo",
    prepTime: "5 min",
    cookTime: "10 min",
    energyLevel: "Medio Sforzo",
    ingredients: [
      "2 uova",
      "1 cubetto di spinaci surgelati (fatti scongelare prima)",
      "Mezzo cucchiaino di curcuma",
      "1 cucchiaio di parmigiano (se tollerato)"
    ],
    instructions: [
      "Sbatti bene le uova con la curcuma e il formaggio.",
      "Aggiungi gli spinaci strizzati dall'acqua in eccesso.",
      "Cuoci in padella antiaderente con un filo d'olio a fuoco lentissimo e coperchio chiuso, gira a metà cottura."
    ],
    fibroTip: "La curcuma necessita di grassi per essere assorbita, le uova sono il veicolo perfetto per la tua integrazione naturale."
  },

  // --- CENE ---
  {
    id: "cena-1",
    title: "Zuppa Cremosa Zucca e Zenzero",
    category: "Cena",
    prepTime: "5 min",
    cookTime: "20 min",
    energyLevel: "Medio Sforzo",
    ingredients: [
      "300g di zucca a cubetti (surgelata è perfetta)",
      "1 patata piccola",
      "1 dito di zenzero fresco grattugiato",
      "Brodo vegetale q.b."
    ],
    instructions: [
      "Metti in pentola zucca, patata a tocchetti e zenzero.",
      "Copri col brodo e cuoci finché morbido (20 min).",
      "Frulla con il minipimer a immersione."
    ],
    fibroTip: "Cena ultra-digeribile che conforta i muscoli e ti facilita la transizione verso il sonno."
  },
  {
    id: "cena-2",
    title: "Filetto di Sogliola al Vapore Aromatica",
    category: "Cena",
    prepTime: "5 min",
    cookTime: "10 min",
    energyLevel: "Basso Sforzo",
    ingredients: [
      "2 filetti di sogliola o merluzzo (anche surgelati, scongelati)",
      "Prezzemolo fresco e origano",
      "Fettine di limone",
      "Zucchine tagliate fini a rondelle"
    ],
    instructions: [
      "Disponi i filetti nel cestello per la cottura a vapore (o per microonde).",
      "Appoggia sopra limone e zucchine.",
      "Cuoci 10 minuti e condisci con un filo d'olio a crudo."
    ],
    fibroTip: "Proteine ultra leggere che non creano affaticamento digestivo."
  },
  {
    id: "cena-3",
    title: "Orzo Cremoso con Spinaci e Noci",
    category: "Cena",
    prepTime: "2 min",
    cookTime: "15 min",
    energyLevel: "Medio Sforzo",
    ingredients: [
      "70g di orzo perlato o farro",
      "1 manciata grande di spinaci freschi",
      "Zeste di mezzo limone biologico",
      "3 noci sminuzzate"
    ],
    instructions: [
      "Cuoci l'orzo in abbondante acqua o brodo. A due minuti dalla fine, butta dentro gli spinaci a cuocere nell'acqua dell'orzo.",
      "Scola il tutto tenendo un goccio d'acqua di cottura.",
      "Manteca con un cucchiaino d'olio, la scorza di limone e le noci per dare componente croccante."
    ],
    fibroTip: "Aggiungere le verdure nell'acqua della pasta/cereali a fine cottura sporca una pentola in meno e salva molta energia."
  },
  {
    id: "cena-4",
    title: "Vellutata Rapida Carote e Curcuma",
    category: "Cena",
    prepTime: "5 min",
    cookTime: "15 min",
    energyLevel: "Basso Sforzo",
    ingredients: [
      "4 carote a rondelle",
      "1 scalogno",
      "1 pizzico di curcuma e zenzero",
      "Un cucchiaio di panna di soia o yogurt naturale"
    ],
    instructions: [
      "Fai appassire lo scalogno con due dita d'acqua.",
      "Aggiungi le carote, curcuma, zenzero e copri di brodo o acqua salata.",
      "Cuoci finché tenere e frulla, servendo con mezzo cucchiaio di yogurt al centro."
    ],
    fibroTip: "Mangiare zuppe e creme la sera previene le palpitazioni notturne da digestione difficile, un sintomo comune per chi ha stanchezza cronica."
  },
  {
    id: "cena-5",
    title: "Couscous Integrale Tiepido Verdure",
    category: "Cena",
    prepTime: "3 min",
    cookTime: "5 min",
    energyLevel: "Basso Sforzo",
    ingredients: [
      "50g di couscous integrale",
      "Mezzo barattolo di ceci precotti",
      "Verdure miste grigliate (anche surgelate/pronte)",
      "Un goccio d'olio e succo di limone"
    ],
    instructions: [
      "Metti il couscous in una ciotola, versa la stessa quantità di acqua bollente (o brodo) e copri col coperchio per 5 min.",
      "Sgrana il couscous con la forchetta.",
      "Mischia coi ceci sciacquati e le verdure grigliate scaldate."
    ],
    fibroTip: "Il couscous si 'cuoce' da solo senza fornelli accesi: il trucco per le sere dove non hai la forza di rimescolare pentole."
  },

  // --- SNACK ---
  {
    id: "snack-1",
    title: "Smoothie Verde Zenzero e Avocado",
    category: "Snack",
    prepTime: "3 min",
    cookTime: "0 min",
    energyLevel: "Basso Sforzo",
    ingredients: [
      "Mezzo avocado",
      "Spinacini freschi",
      "Mezza banana",
      "Zenzero fresco",
      "Acqua di cocco o latte vegetale"
    ],
    instructions: [
      "Inserisci tutto nel frullatore e frulla fino alla consistenza desiderata."
    ],
    fibroTip: "Bomba di magnesio e antiossidanti: da bere a piccoli sorsi."
  },
  {
    id: "snack-2",
    title: "Energy Bites Datteri e Noci (Palline Anti-Fatigue)",
    category: "Snack",
    prepTime: "10 min",
    cookTime: "0 min",
    energyLevel: "Medio Sforzo",
    ingredients: [
      "1 tazza di datteri snocciolati",
      "Mezza tazza di noci o mandorle",
      "1 cucchiaio di semi di lino macinati",
      "1 cucchiaino di cacao amaro in polvere"
    ],
    instructions: [
      "Frulla i datteri e le noci in un mixer fino a formare una pasta appiccicosa.",
      "Aggiungi semi di lino e cacao, mescolando.",
      "Fai delle palline con le mani e metti in frigo in un contenitore. Si conservano per settimane!"
    ],
    fibroTip: "Prepara le palline in un 'giorno buono', e avrai snack istantanei che prevengono i crolli di zucchero drastici."
  },
  {
    id: "snack-3",
    title: "Crema di Ceci (Hummus d'Emergenza)",
    category: "Snack",
    prepTime: "3 min",
    cookTime: "0 min",
    energyLevel: "Basso Sforzo",
    ingredients: [
      "1 barattolo di ceci (sciacquati)",
      "Olio Evo e succo di mezzo limone",
      "1 cucchiaino facoltativo di tahina (crema di sesamo)",
      "Carote baby o gambi di sedano già puliti"
    ],
    instructions: [
      "Scola molto bene i ceci, frullali col minipimer aggiungendo olio, limone, tahina e un po' d'acqua calda per renderli cremosi.",
      "Mangia intingendovi le piccole verdure tagliate."
    ],
    fibroTip: "Calcio (dalla tahina) e proteine a sforzo zero."
  },
  {
    id: "snack-4",
    title: "Chips di Mela Calde alla Cannella",
    category: "Snack",
    prepTime: "2 min",
    cookTime: "5 min",
    energyLevel: "Basso Sforzo",
    ingredients: [
      "1 mela rossa",
      "Cannella in polvere a sentimento"
    ],
    instructions: [
      "Taglia la mela a fette sottili sottili, togliendo i semini.",
      "Disponile in un piattino, spolvera con tantissima cannella.",
      "Metti in microonde per circa 4-5 minuti, finché morbide o croccanti ai lati."
    ],
    fibroTip: "Quando il corpo chiede un 'dolce consolatorio', questa mela inganna il palato ma spegne l'infiammazione glicemica."
  }
];

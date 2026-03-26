export interface RegionData {
    region: string;
    city: string;
    marketType: 'Tutelato' | 'Libero';
    lightPrice: number; // €/kWh
    gasPrice: number;   // €/m³
    fixedCost: number;  // €/mese
}

export const TARIFFE_REGIONI: RegionData[] = [
    { region: 'Abruzzo', city: "L'Aquila", marketType: 'Tutelato', lightPrice: 0.43, gasPrice: 1.18, fixedCost: 35 },
    { region: 'Abruzzo', city: "L'Aquila", marketType: 'Libero', lightPrice: 0.39, gasPrice: 1.10, fixedCost: 32 },
    { region: 'Basilicata', city: 'Potenza', marketType: 'Tutelato', lightPrice: 0.44, gasPrice: 1.20, fixedCost: 36 },
    { region: 'Basilicata', city: 'Potenza', marketType: 'Libero', lightPrice: 0.40, gasPrice: 1.12, fixedCost: 33 },
    { region: 'Calabria', city: 'Catanzaro', marketType: 'Tutelato', lightPrice: 0.45, gasPrice: 1.22, fixedCost: 37 },
    { region: 'Calabria', city: 'Catanzaro', marketType: 'Libero', lightPrice: 0.41, gasPrice: 1.14, fixedCost: 34 },
    { region: 'Campania', city: 'Napoli', marketType: 'Tutelato', lightPrice: 0.44, gasPrice: 1.19, fixedCost: 36 },
    { region: 'Campania', city: 'Napoli', marketType: 'Libero', lightPrice: 0.40, gasPrice: 1.11, fixedCost: 33 },
    { region: 'Emilia-Romagna', city: 'Bologna', marketType: 'Tutelato', lightPrice: 0.40, gasPrice: 1.05, fixedCost: 32 },
    { region: 'Emilia-Romagna', city: 'Bologna', marketType: 'Libero', lightPrice: 0.36, gasPrice: 0.97, fixedCost: 29 },
    { region: 'Friuli-Venezia Giulia', city: 'Trieste', marketType: 'Tutelato', lightPrice: 0.41, gasPrice: 1.08, fixedCost: 33 },
    { region: 'Friuli-Venezia Giulia', city: 'Trieste', marketType: 'Libero', lightPrice: 0.37, gasPrice: 1.00, fixedCost: 30 },
    { region: 'Lazio', city: 'Roma', marketType: 'Tutelato', lightPrice: 0.45, gasPrice: 1.20, fixedCost: 36 },
    { region: 'Lazio', city: 'Roma', marketType: 'Libero', lightPrice: 0.41, gasPrice: 1.12, fixedCost: 33 },
    { region: 'Liguria', city: 'Genova', marketType: 'Tutelato', lightPrice: 0.42, gasPrice: 1.12, fixedCost: 34 },
    { region: 'Liguria', city: 'Genova', marketType: 'Libero', lightPrice: 0.38, gasPrice: 1.04, fixedCost: 31 },
    { region: 'Lombardia', city: 'Milano', marketType: 'Tutelato', lightPrice: 0.42, gasPrice: 1.15, fixedCost: 34 },
    { region: 'Lombardia', city: 'Milano', marketType: 'Libero', lightPrice: 0.38, gasPrice: 1.07, fixedCost: 31 },
    { region: 'Marche', city: 'Ancona', marketType: 'Tutelato', lightPrice: 0.42, gasPrice: 1.10, fixedCost: 34 },
    { region: 'Marche', city: 'Ancona', marketType: 'Libero', lightPrice: 0.38, gasPrice: 1.02, fixedCost: 31 },
    { region: 'Molise', city: 'Campobasso', marketType: 'Tutelato', lightPrice: 0.43, gasPrice: 1.16, fixedCost: 35 },
    { region: 'Molise', city: 'Campobasso', marketType: 'Libero', lightPrice: 0.39, gasPrice: 1.08, fixedCost: 32 },
    { region: 'Piemonte', city: 'Torino', marketType: 'Tutelato', lightPrice: 0.40, gasPrice: 1.08, fixedCost: 32 },
    { region: 'Piemonte', city: 'Torino', marketType: 'Libero', lightPrice: 0.36, gasPrice: 1.00, fixedCost: 29 },
    { region: 'Puglia', city: 'Bari', marketType: 'Tutelato', lightPrice: 0.45, gasPrice: 1.21, fixedCost: 36 },
    { region: 'Puglia', city: 'Bari', marketType: 'Libero', lightPrice: 0.41, gasPrice: 1.13, fixedCost: 33 },
    { region: 'Sardegna', city: 'Cagliari', marketType: 'Tutelato', lightPrice: 0.47, gasPrice: 1.28, fixedCost: 38 },
    { region: 'Sardegna', city: 'Cagliari', marketType: 'Libero', lightPrice: 0.43, gasPrice: 1.20, fixedCost: 35 },
    { region: 'Sicilia', city: 'Palermo', marketType: 'Tutelato', lightPrice: 0.46, gasPrice: 1.25, fixedCost: 37 },
    { region: 'Sicilia', city: 'Palermo', marketType: 'Libero', lightPrice: 0.42, gasPrice: 1.17, fixedCost: 34 },
    { region: 'Toscana', city: 'Firenze', marketType: 'Tutelato', lightPrice: 0.41, gasPrice: 1.06, fixedCost: 33 },
    { region: 'Toscana', city: 'Firenze', marketType: 'Libero', lightPrice: 0.37, gasPrice: 0.98, fixedCost: 30 },
    { region: 'Trentino-Alto Adige', city: 'Trento', marketType: 'Tutelato', lightPrice: 0.39, gasPrice: 1.02, fixedCost: 31 },
    { region: 'Trentino-Alto Adige', city: 'Trento', marketType: 'Libero', lightPrice: 0.35, gasPrice: 0.94, fixedCost: 28 },
    { region: 'Umbria', city: 'Perugia', marketType: 'Tutelato', lightPrice: 0.42, gasPrice: 1.09, fixedCost: 34 },
    { region: 'Umbria', city: 'Perugia', marketType: 'Libero', lightPrice: 0.38, gasPrice: 1.01, fixedCost: 31 },
    { region: 'Valle d\'Aosta', city: 'Aosta', marketType: 'Tutelato', lightPrice: 0.38, gasPrice: 0.99, fixedCost: 30 },
    { region: 'Valle d\'Aosta', city: 'Aosta', marketType: 'Libero', lightPrice: 0.34, gasPrice: 0.91, fixedCost: 27 },
    { region: 'Veneto', city: 'Venezia', marketType: 'Tutelato', lightPrice: 0.40, gasPrice: 1.04, fixedCost: 32 },
    { region: 'Veneto', city: 'Venezia', marketType: 'Libero', lightPrice: 0.36, gasPrice: 0.96, fixedCost: 29 },
];

export const STAGIONALITA_CONSUMI = [
    { month: 1, light: 1.10, gas: 1.40, name: 'Gen' },
    { month: 2, light: 1.05, gas: 1.35, name: 'Feb' },
    { month: 3, light: 0.90, gas: 1.00, name: 'Mar' },
    { month: 4, light: 0.80, gas: 0.60, name: 'Apr' },
    { month: 5, light: 0.75, gas: 0.20, name: 'Mag' },
    { month: 6, light: 0.85, gas: 0.00, name: 'Giu' },
    { month: 7, light: 1.00, gas: 0.00, name: 'Lug' },
    { month: 8, light: 1.05, gas: 0.00, name: 'Ago' },
    { month: 9, light: 0.80, gas: 0.10, name: 'Set' },
    { month: 10, light: 0.85, gas: 0.80, name: 'Ott' },
    { month: 11, light: 1.00, gas: 1.20, name: 'Nov' },
    { month: 12, light: 1.20, gas: 1.50, name: 'Dic' },
];

export const SERVIZI_ACCESSORI_LIST = [
    { id: 1, name: 'Assistenza Tecnica 24/7', cost: 4.90, category: 'Assistenza' },
    { id: 2, name: 'Assicurazione Impianto', cost: 3.50, category: 'Assicurazione' },
    { id: 3, name: 'Servizio Premium (Estero)', cost: 5.00, category: 'Premium' },
    { id: 4, name: 'App Mobile Monitoraggio', cost: 2.50, category: 'Altro' },
    { id: 5, name: 'Manutenzione Caldaia', cost: 6.00, category: 'Assistenza' },
    { id: 6, name: 'Protezione Cibernetica', cost: 1.99, category: 'Altro' },
];

export const REGIONS = [
    'Abruzzo', 'Basilicata', 'Calabria', 'Campania', 'Emilia-Romagna',
    'Friuli-Venezia Giulia', 'Lazio', 'Liguria', 'Lombardia', 'Marche',
    'Molise', 'Piemonte', 'Puglia', 'Sardegna', 'Sicilia', 'Toscana',
    'Trentino-Alto Adige', 'Umbria', 'Valle d\'Aosta', 'Veneto'
];

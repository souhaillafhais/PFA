// Lokales Storage-System für die Anwendung (ohne Backend)

export interface Incident {
  id: string;
  type: string;
  sousType: string;
  latitude: number;
  longitude: number;
  adresse?: string;
  description: string;
  nombreVictimes?: number;
  niveauDanger?: number;
  utilisateurId?: string;
  statut: 'ALERTE_RECUE' | 'SECOURS_EN_ROUTE' | 'EN_COURS' | 'RESOLU';
  piecesJointes?: string[]; // URLs oder base64 strings
  dateCreation: string;
  dateMiseAJour?: string;
  region?: string;
  commentaires?: Array<{ auteur: string; message: string; date: string }>;
  assigne?: string; // ID de l'admin assigné
}

export interface Alert {
  id: string;
  titre: string;
  message: string;
  niveau: 'CRITIQUE' | 'ELEVE' | 'MOYEN' | 'FAIBLE';
  actif: boolean;
  dateCreation: string;
  dateExpiration?: string;
  region?: string; // Si défini, alerte régionale, sinon globale
  scope: 'GLOBAL' | 'REGIONAL';
}

export interface Guide {
  id: string;
  titre: string;
  contenu: string;
  categorie: string;
  dateCreation: string;
}

export interface RegionalAdmin {
  id: string;
  nomComplet: string;
  email: string;
  telephone: string;
  region: string;
  role: 'REGIONAL_ADMIN';
  permissions: {
    lecture: boolean;
    edition: boolean;
    suppression: boolean;
  };
  notificationsActives: boolean;
  dateCreation: string;
  actif: boolean;
}

const STORAGE_KEYS = {
  INCIDENTS: 'urgences_incidents',
  ALERTS: 'urgences_alerts',
  GUIDES: 'urgences_guides',
  REGIONAL_ADMINS: 'urgences_regional_admins',
};

// Régions disponibles (Maroc)
export const REGIONS = [
  'Casablanca-Settat',
  'Rabat-Salé-Kénitra',
  'Tanger-Tétouan-Al Hoceïma',
  'Fès-Meknès',
  'Marrakech-Safi',
  'Oriental',
  'Béni Mellal-Khénifra',
  'Souss-Massa',
  'Drâa-Tafilalet',
  'Laâyoune-Sakia El Hamra',
  'Dakhla-Oued Ed-Dahab',
  'Guelmim-Oued Noun',
];

// Incident Storage
export const incidentStorage = {
  getAll: (): Incident[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.INCIDENTS);
    return data ? JSON.parse(data) : [];
  },

  getById: (id: string): Incident | null => {
    const incidents = incidentStorage.getAll();
    return incidents.find(i => i.id === id) || null;
  },

  getByUserId: (userId: string): Incident[] => {
    const incidents = incidentStorage.getAll();
    return incidents.filter(i => i.utilisateurId === userId);
  },

  getByType: (type: string): Incident[] => {
    const incidents = incidentStorage.getAll();
    return incidents.filter(i => i.type === type);
  },

  getByRegion: (region: string): Incident[] => {
    const incidents = incidentStorage.getAll();
    return incidents.filter(i => i.region === region);
  },

  addComment: (id: string, comment: { auteur: string; message: string }): Incident | null => {
    const incident = incidentStorage.getById(id);
    if (!incident) return null;
    
    const commentaires = incident.commentaires || [];
    commentaires.push({
      ...comment,
      date: new Date().toISOString(),
    });
    
    return incidentStorage.update(id, { commentaires });
  },

  assign: (id: string, adminId: string): Incident | null => {
    return incidentStorage.update(id, { assigne: adminId });
  },

  create: (incident: Omit<Incident, 'id' | 'dateCreation' | 'statut'>): Incident => {
    const incidents = incidentStorage.getAll();
    const newIncident: Incident = {
      ...incident,
      id: `inc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      dateCreation: new Date().toISOString(),
      statut: 'ALERTE_RECUE',
    };
    incidents.push(newIncident);
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents));
    return newIncident;
  },

  update: (id: string, updates: Partial<Incident>): Incident | null => {
    const incidents = incidentStorage.getAll();
    const index = incidents.findIndex(i => i.id === id);
    if (index === -1) return null;
    
    incidents[index] = {
      ...incidents[index],
      ...updates,
      dateMiseAJour: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents));
    return incidents[index];
  },

  updateStatus: (id: string, statut: Incident['statut']): Incident | null => {
    return incidentStorage.update(id, { statut });
  },

  delete: (id: string): boolean => {
    const incidents = incidentStorage.getAll();
    const filtered = incidents.filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(filtered));
    return filtered.length < incidents.length;
  },
};

// Alert Storage
export const alertStorage = {
  getAll: (actifOnly: boolean = false): Alert[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.ALERTS);
    const alerts: Alert[] = data ? JSON.parse(data) : [];
    return actifOnly ? alerts.filter(a => a.actif) : alerts;
  },

  getById: (id: string): Alert | null => {
    const alerts = alertStorage.getAll();
    return alerts.find(a => a.id === id) || null;
  },

  getByRegion: (region: string): Alert[] => {
    const alerts = alertStorage.getAll();
    return alerts.filter(a => a.region === region || a.scope === 'GLOBAL');
  },

  create: (alert: Omit<Alert, 'id' | 'dateCreation'>): Alert => {
    const alerts = alertStorage.getAll();
    const newAlert: Alert = {
      ...alert,
      scope: alert.region ? 'REGIONAL' : 'GLOBAL',
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      dateCreation: new Date().toISOString(),
    };
    alerts.push(newAlert);
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
    return newAlert;
  },

  update: (id: string, updates: Partial<Alert>): Alert | null => {
    const alerts = alertStorage.getAll();
    const index = alerts.findIndex(a => a.id === id);
    if (index === -1) return null;
    
    alerts[index] = { ...alerts[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
    return alerts[index];
  },

  delete: (id: string): boolean => {
    const alerts = alertStorage.getAll();
    const filtered = alerts.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(filtered));
    return filtered.length < alerts.length;
  },
};

// Regional Admin Storage
export const regionalAdminStorage = {
  getAll: (): RegionalAdmin[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.REGIONAL_ADMINS);
    return data ? JSON.parse(data) : [];
  },

  getById: (id: string): RegionalAdmin | null => {
    const admins = regionalAdminStorage.getAll();
    return admins.find(a => a.id === id) || null;
  },

  getByRegion: (region: string): RegionalAdmin[] => {
    const admins = regionalAdminStorage.getAll();
    return admins.filter(a => a.region === region && a.actif);
  },

  create: (admin: Omit<RegionalAdmin, 'id' | 'dateCreation'>): RegionalAdmin => {
    const admins = regionalAdminStorage.getAll();
    const newAdmin: RegionalAdmin = {
      ...admin,
      id: `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      dateCreation: new Date().toISOString(),
    };
    admins.push(newAdmin);
    localStorage.setItem(STORAGE_KEYS.REGIONAL_ADMINS, JSON.stringify(admins));
    return newAdmin;
  },

  update: (id: string, updates: Partial<RegionalAdmin>): RegionalAdmin | null => {
    const admins = regionalAdminStorage.getAll();
    const index = admins.findIndex(a => a.id === id);
    if (index === -1) return null;
    
    admins[index] = { ...admins[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.REGIONAL_ADMINS, JSON.stringify(admins));
    return admins[index];
  },

  delete: (id: string): boolean => {
    const admins = regionalAdminStorage.getAll();
    const filtered = admins.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.REGIONAL_ADMINS, JSON.stringify(filtered));
    return filtered.length < admins.length;
  },
};

// Guide Storage
export const guideStorage = {
  getAll: (): Guide[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.GUIDES);
    return data ? JSON.parse(data) : [];
  },

  getById: (id: string): Guide | null => {
    const guides = guideStorage.getAll();
    return guides.find(g => g.id === id) || null;
  },

  getByCategorie: (categorie: string): Guide[] => {
    const guides = guideStorage.getAll();
    return guides.filter(g => g.categorie === categorie);
  },

  create: (guide: Omit<Guide, 'id' | 'dateCreation'>): Guide => {
    const guides = guideStorage.getAll();
    const newGuide: Guide = {
      ...guide,
      id: `guide_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      dateCreation: new Date().toISOString(),
    };
    guides.push(newGuide);
    localStorage.setItem(STORAGE_KEYS.GUIDES, JSON.stringify(guides));
    return newGuide;
  },
};

// Initialisierung mit Beispieldaten
export const initializeStorage = () => {
  if (typeof window === 'undefined') return;

  // Initialisiere Guides de prévention
  const existingGuides = guideStorage.getAll();
  if (existingGuides.length === 0) {
    const defaultGuides: Omit<Guide, 'id' | 'dateCreation'>[] = [
      {
        titre: 'Que faire en cas d\'incendie',
        contenu: `
1. Alertez immédiatement les pompiers (198)
2. Ne prenez pas l'ascenseur
3. Fermez les portes derrière vous
4. Si la fumée est dense, rampez au sol
5. Ne retournez jamais dans un bâtiment en feu
6. Utilisez un extincteur uniquement si vous savez comment l'utiliser
        `,
        categorie: 'INCENDIE',
      },
      {
        titre: 'Que faire en cas de séisme',
        contenu: `
1. Restez calme et ne paniquez pas
2. Mettez-vous à l'abri sous une table solide ou un encadrement de porte
3. Éloignez-vous des fenêtres et des objets qui peuvent tomber
4. Si vous êtes à l'extérieur, éloignez-vous des bâtiments
5. Après le séisme, vérifiez les fuites de gaz et d'eau
6. Écoutez la radio pour les instructions officielles
        `,
        categorie: 'SEISME',
      },
      {
        titre: 'Premiers gestes de secours',
        contenu: `
1. Sécurisez la zone (évitez le sur-accident)
2. Vérifiez la conscience de la victime
3. Appelez les secours (198 pour les pompiers, 190 pour la police)
4. Si la personne est inconsciente, placez-la en position latérale de sécurité
5. En cas d'hémorragie, comprimez la plaie
6. Ne donnez jamais à boire à une personne inconsciente
        `,
        categorie: 'PREMIERS_SECOURS',
      },
    ];

    defaultGuides.forEach(guide => guideStorage.create(guide));
  }
};


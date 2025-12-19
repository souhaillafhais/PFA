export interface User {
  id: number;
  email: string;
  telephone: string;
  nomComplet: string;
  role: string;
  centreRegional?: string;
  actif: boolean;
}

export interface Incident {
  id: number;
  type: string;
  sousType: string;
  latitude: number;
  longitude: number;
  adresse?: string;
  description: string;
  nombreVictimes?: number;
  niveauDanger?: number;
  utilisateurId?: string;
  statut: string;
  piecesJointes?: string[];
  dateCreation: string;
  dateMiseAJour?: string;
}

export interface Alert {
  id: number;
  titre: string;
  message: string;
  niveau: string;
  actif: boolean;
  dateCreation?: string;
}


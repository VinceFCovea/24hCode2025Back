import {Ressource} from "./Ressource";

export interface RessourceWithQuantite {
    ressource: Ressource;
    quantite: number;
}

export interface Terrain {
    identifiant: string;
    nom: string;
    description: string;
    ressourcesPresente: RessourceWithQuantite[];
}

export interface Biome {
    identifiant: string;
    nom: string;
    description: string;
    batimentsContructible: string[];
}

export interface Proprietaire {
    idEquipe: string;
    nom: string;
    type: string;
    villageois: any[];
    ressources: any[];
}

export interface Monde {
    coord_x: number;
    coord_y: number;
    biome: Biome;
    terrain: Terrain;
    batiment_construit: any | null;
    accessible: boolean;
    proprietaire: Proprietaire;
    ressources: RessourceWithQuantite[];
}

export interface BatimentDetail {
    id: string;
    description: string;
    type: string;
    tempsConstruction: number;
    estUneMerveille: boolean;
    constructibleSur: string[];
    coutParTour: any[];
    coutConstruction: any[];
    bonusConstruction: any[];
    bonus: any[];
    supplement: any[];
}

export interface BatimentConstruit {
    progression: number;
    identifiant: string;
    proprietaire: Proprietaire;
    detailBatiment: BatimentDetail;
}



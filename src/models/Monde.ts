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



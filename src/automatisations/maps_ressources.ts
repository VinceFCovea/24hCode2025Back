import {getCartes} from "../api_request/monde";
import {Monde, RessourceWithQuantite} from "../models/Monde";

export interface Position {
    x: number;
    y: number;
}

export async function getRessourceLaPlusProche(x: number, y: number, ressourceName: string): Promise<Position> {
    for (let i = 1; i < 10; i++) {
        const minimaps = await getCartes(`${x - i},${x + i}`, `${y - i},${y + i}`);
        for (const minimap of minimaps) {//boucle
            for (const minimapressource of minimap.ressources) {
                if (minimapressource.ressource.nom === ressourceName && minimapressource.quantite > 10) {
                    return {x: minimap.coord_x, y: minimap.coord_y};
                }
            }
        }
    }
    return {x: x, y: y};
}
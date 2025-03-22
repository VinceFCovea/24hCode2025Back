import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import swaggerJsdoc from 'swagger-jsdoc';
import {getVillageoisDetails, getVillageoisList} from "./api_request/villageois";
import {getCarte} from "./api_request/monde";
import {
    can_build,
    continue_contruire_bat,
    get_construction_status,
    new_bat
} from "./automatisations/construction_batiment";
import {getListNomRessources, getRessourcesTerrain, recolte_case} from "./automatisations/recolte_case";
import {action_move, move} from "./automatisations/move";
import {getBatiments} from "./api_request/batiments";
import * as path from "node:path";
import villageoisRoutes from './routes/villageois';
import constructionRoutes from './routes/construction';
import recolteRoutes from './routes/recolte';

const app = express();
app.use(express.json());


/*
Actions:
recolte, construction, pause, move
*/
interface ActionConfig {
    action: "recolte" | "construction" | "pause" | "move" | "set-construction";
    ressource?: string;
    batiment?: string;
    dest_x?: number;
    dest_y?: number;
}
interface TableauConfig {
    [id: string]: ActionConfig;
}

export let tableauConfig : TableauConfig = {
    "17e9cdb2-6bb1-484e-ad06-5f49c47e2034": { action: "construction", batiment: "BIBLIOTHEQUE", ressource: "NOURRITURE", dest_x: 26, dest_y: 30,},
    "0d53b017-10d0-48a2-afe2-e5a292648e56": { action: "pause", batiment: "", ressource: "BOIS", dest_x: 27, dest_y: 30,},
    "61acd05a-a8e2-45b9-a757-5d4138c92c63": { action: "move", batiment: "", ressource: "BOIS", dest_x: 28, dest_y: 30,},
    "c71928dd-5c72-4c49-8c34-18f7301507b9": { action: "move", batiment: "", ressource: "BOIS", dest_x: 24, dest_y: 30,},
    "1c5040c4-c3f1-408e-a0e6-eec4409e5991": { action: "move", batiment: "", ressource: "BOIS", dest_x: 23, dest_y: 30,},
};


const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));

app.use('/api/villageois', villageoisRoutes);
app.use('/api/construction', constructionRoutes);
app.use('/api/recolte', recolteRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
    getVillageoisList().then(villageois_list => {
        setInterval(function () {
            for (let i = 0; i < villageois_list.length; i++) {
                setTimeout( () => {
                    let id_villageois = villageois_list[i].idVillageois;
                    let config = tableauConfig[id_villageois];

                    getVillageoisDetails(id_villageois).then(villageois_info => {
                        getCarte(`${villageois_info.positionX},${villageois_info.positionX}`, `${villageois_info.positionY},${villageois_info.positionY}`).then(monde => {
                            if (config.action === "construction") {
                                continue_contruire_bat(id_villageois, config.batiment).catch(console.error);
                                console.log("Statut:", get_construction_status(monde));
                                if (get_construction_status(monde) < 2) {
                                    tableauConfig[id_villageois].action = "recolte";
                                }
                            } else if (config.action === "recolte") {
                                let ressources = getRessourcesTerrain(monde);
                                let list_ressources_presente_nom = getListNomRessources(ressources);

                                if (list_ressources_presente_nom.includes(config.ressource)) {
                                    recolte_case(id_villageois, config.ressource).then(r => {
                                        console.log("villageois", id_villageois, `(${villageois_info.positionX},${villageois_info.positionY}) recolte du `, config.ressource);
                                    });
                                } else {
                                    recolte_case(id_villageois, ressources[0].ressource.nom).then(r => {
                                        console.log("villageois", id_villageois, `(${villageois_info.positionX},${villageois_info.positionY}) recolte du `, ressources[0].ressource.nom);
                                    });
                                }
                            } else if (config.action === "pause") {
                                console.log(`Villageois ${id_villageois} is paused.`);
                            } else if (config.action === "move") {
                                const direction = move(villageois_info.positionX, villageois_info.positionY, config.dest_x, config.dest_y);
                                console.log(`Villageois ${id_villageois} is moving: ${direction}`);
                                if (direction === "RECOLTE") {
                                    tableauConfig[id_villageois].action = "recolte";
                                    recolte_case(id_villageois, config.ressource).then(r => {
                                        console.log("villageois", id_villageois, `(${villageois_info.positionX},${villageois_info.positionY}) recolte du `, config.ressource);
                                    });
                                } else {
                                    action_move(id_villageois, direction);
                                }
                            } else if (config.action === "set-construction") {
                                new_bat(id_villageois, config.batiment).then(r => {
                                    console.log("villageois", id_villageois, " construit ", config.batiment);
                                    config.action = "construction";
                                });
                            }
                        });
                    });
                }, i*150);
            }
        }, 12600);
    });
});
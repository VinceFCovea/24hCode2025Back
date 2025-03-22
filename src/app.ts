import express from 'express';

import {getVillageoisDetails, getVillageoisList} from "./api_request/villageois";
import {getCarte} from "./api_request/monde";
import {continue_contruire_bat, get_construction_status} from "./automatisations/construction_batiment";
import {getListNomRessources, getRessourcesTerrain, recolte_case} from "./automatisations/recolte_case";
import {action_move} from "./automatisations/move";

const app = express();
app.use(express.json());

const BASE_URL = "http://51.210.117.22:8080";
const ID_EQUIPE = "c1b647f1-1748-492a-b5a9-2a9af9b5e5ed";
const BEARER_TOKEN = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI2VG5aX1o4WlM2YTlYczJqckl4RTZLS0lNbjgyaTdxN3Z4cTRtY3dQOE13In0.eyJleHAiOjE3NDI4MTIxNDcsImlhdCI6MTc0MjYzOTM0NywianRpIjoiMWRjNjFkMDgtNTU3Mi00MjUwLWFmZDktNjUxMTcyNDA1MmIyIiwiaXNzIjoiaHR0cDovLzUxLjIxMC4xMTcuMjI6ODA4MS9yZWFsbXMvY29kZWxlbWFucyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiI0MWJhMTYyZi1hNjkyLTRlOWItYWMzNC04ODkyY2E2ZWI3YWUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJ3b2xvbG8tYmFja2VuZCIsInNlc3Npb25fc3RhdGUiOiJhMjk2ZTQ3MS01OTI4LTQyZGItYTAwMy1kYmJiOGQzNTE4MWIiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIi8qIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtY29kZWxlbWFucyIsInVtYV9hdXRob3JpemF0aW9uIiwidXNlciJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoiZW1haWwgcHJvZmlsZSIsInNpZCI6ImEyOTZlNDcxLTU5MjgtNDJkYi1hMDAzLWRiYmI4ZDM1MTgxYiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiemVybyBibGFibGEiLCJ0ZWFtX2lkIjoiYzFiNjQ3ZjEtMTc0OC00OTJhLWI1YTktMmE5YWY5YjVlNWVkIiwicHJlZmVycmVkX3VzZXJuYW1lIjoibGVzLWNhdmFsaWVycy1kZS1sYS10ZXJyZSIsImdpdmVuX25hbWUiOiJ6ZXJvIGJsYWJsYSJ9.sickiX8d4rX3f-g4q510KqRB1Sv3EsoG0gs-q4_AMZirtSgLmtdIQvYWXfOfYvOV9m0fbV0HKa6mTwfkSN3qfX2jz3ovmWGDRhu6McVrUQDcysYAJImsIlCSxHXdz7Kv8vJZAMddA1AAb_UCVzY80p11kVfMpJqbzX2VPBNg_i_nxbr7TO4wgkyT58MDKTS7RuRz5FUgUjNzPcSlWOkFZsoStPk31y5_OipRaK9AC7TbuId6Iz6UaC5jT74xeijVTXBzwIxs9wGNi8pZv3rO8Gloh_JlzO7rW-x1C_YdXLilJ5fctyQdjPuEksLYth_CQIv916g6sIkRputUpKuJBQ";

export function move(v_pos_x: number, v_pos_y: number, dest_x: number, dest_y: number) {
    if (v_pos_y < dest_y) {
        return "DEPLACEMENT_HAUT";
    } else if (v_pos_y > dest_y) {
        return "DEPLACEMENT_BAS";
    } else if (v_pos_y === dest_y) {
        if (v_pos_x < dest_x) {
            return "DEPLACEMENT_DROITE";
        } else if (v_pos_x > dest_x) {
            return "DEPLACEMENT_GAUCHE";
        } else {
            return "RECOLTE";
        }
    }
}

/*
Actions:
recolte, construction, pause, move
*/

let tableauConfig = {
    "17e9cdb2-6bb1-484e-ad06-5f49c47e2034": { action: "recolte", ressource: "BOIS" },
    "0d53b017-10d0-48a2-afe2-e5a292648e56": { action: "recolte", ressource: "FER" },
    "61acd05a-a8e2-45b9-a757-5d4138c92c63": { action: "recolte", ressource: "BOIS" },
    "c71928dd-5c72-4c49-8c34-18f7301507b9": { action: "recolte", ressource: "NOURRITURE" },
    "1c5040c4-c3f1-408e-a0e6-eec4409e5991": { action: "construction", batiment: "EOLIENNE", ressource: "NOURRITURE", dest_x: 10, dest_y: 15,},
};

getVillageoisList().then(villageois_list => {
    setInterval(function () {
        for (let i = 0; i < villageois_list.length; i++) {
            let id_villageois = villageois_list[i].idVillageois;
            let config = tableauConfig[id_villageois];

            if (!config) {
                console.log(`No configuration found for villageois: ${id_villageois}`);
                continue;
            }

            getVillageoisDetails(id_villageois).then(villageois_info => {
                getCarte(`${villageois_info.positionX},${villageois_info.positionX}`, `${villageois_info.positionY},${villageois_info.positionY}`).then(monde => {
                    if (config.action === "construction") {
                        continue_contruire_bat(id_villageois, config.batiment).catch(console.error);
                        console.log("Statut:", get_construction_status(monde));
                        if (get_construction_status(monde) < 2){
                            tableauConfig[id_villageois].action = "recolte";
                        }
                    } else if (config.action === "recolte") {
                        let ressources = getRessourcesTerrain(monde);
                        let list_ressources_presente_nom = getListNomRessources(ressources);

                        if (list_ressources_presente_nom.includes(config.ressource)) {
                            recolte_case(id_villageois, config.ressource).then(r => {
                                console.log("villageois", id_villageois, `(${villageois_info.positionX},${villageois_info.positionX}) recolte du `, config.ressource);
                            });
                        } else {
                            recolte_case(id_villageois, ressources[0].ressource.nom).then(r => {
                                console.log("villageois", id_villageois, `(${villageois_info.positionX},${villageois_info.positionX}) recolte du `, ressources[0].ressource.nom);
                            });
                        }
                    } else if (config.action === "pause") {
                        console.log(`Villageois ${id_villageois} is paused.`);
                    } else if (config.action === "move") {
                        const direction = move(villageois_info.positionX, villageois_info.positionY, config.dest_x, config.dest_y);
                        console.log(`Villageois ${id_villageois} is moving: ${direction}`);
                        if (direction === "RECOLTE"){
                            tableauConfig[id_villageois].action = "recolte";
                            recolte_case(id_villageois, config.ressource).then(r => {
                                console.log("villageois", id_villageois, `(${villageois_info.positionX},${villageois_info.positionX}) recolte du `, config.ressource);
                            });
                        }else {
                            action_move(id_villageois, direction);
                        }
                    }
                });
            });
        }
    }, 12600);
});
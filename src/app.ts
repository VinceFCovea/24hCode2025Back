import express from 'express';
import {
    getListNomRessources,
    getRessourcesTerrain,
    recolte_case
} from "./automatisations/basic_recolte_infini/recolte_case";
import {getVillageoisDetails, getVillageoisList} from "./api_request/villageois";
import {Villageois} from "./models/Villageois";
import {getCarte} from "./api_request/monde";
const app = express();


app.use(express.json());

const tableauRessources = {
    "17e9cdb2-6bb1-484e-ad06-5f49c47e2034": [
        "PIERRE"
    ],
    "0d53b017-10d0-48a2-afe2-e5a292648e56" : [
        "BOIS"
    ],
    "61acd05a-a8e2-45b9-a757-5d4138c92c63": [
        "FER",
    ],
    "c71928dd-5c72-4c49-8c34-18f7301507b9" : [
        "CHARBON"
    ],
    "1c5040c4-c3f1-408e-a0e6-eec4409e5991" : [
        "FER",
    ]
}


getVillageoisList().then(villageois_list => {
    //console.log(villageois_list[0]);
    setInterval(function () {
        for (let i = 0; i < villageois_list.length; i++) {
            let id_villageois = villageois_list[i].idVillageois;
            if (id_villageois === "dontexist") {

            }else {
                // on recup la case du villageois
                getVillageoisDetails(id_villageois).then(villageois_info => {
                    //get les ressources
                    getCarte(`${villageois_info.positionX},${villageois_info.positionX}`, `${villageois_info.positionY},${villageois_info.positionY}`).then(monde => {
                        //console.log(monde);
                        let ressources = getRessourcesTerrain(monde);
                        //console.log("Les ressources", ressources);
                        console.log("liste des ressources présentes", getListNomRessources(ressources));
                        let list_ressources_presente_nom = getListNomRessources(ressources);
                        let ressources_demande = tableauRessources[id_villageois];
                        if (ressources_demande in list_ressources_presente_nom) {
                            recolte_case(id_villageois, tableauRessources[id_villageois][0]).then(r => {
                            })
                        } else {
                            recolte_case(id_villageois, ressources[0].ressource.nom).then(r => {})
                        }
                    })
                })
            }
}
        0}, 12600)


})




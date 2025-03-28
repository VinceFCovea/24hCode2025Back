import express from 'express';
import {adjustname, tableauConfig} from "../app";
import {getRessourceLaPlusProche, Position} from "../automatisations/maps_ressources";
import {getVillageoisDetails} from "../api_request/villageois";
import {Villageois} from "../models/Villageois";

const router = express.Router();

function movetodest(id, dest_x, dest_y){
    if (tableauConfig[adjustname[id]]) {
        tableauConfig[adjustname[id]].action = "move";
        tableauConfig[adjustname[id]].dest_x = dest_x;
        tableauConfig[adjustname[id]].dest_y = dest_y;
    }
}

router.post('/move', (req, res) => {
    const { id, dest_x, dest_y } = req.body;
    movetodest(id, dest_x, dest_y);
    res.send(`Moving villageois ${id} to (${dest_x}, ${dest_y})`);
});


router.post('/movetoressource', async (req, res) => {
        const id_villageois = req.body.id_villageois;
        const villageois_info: Villageois = await getVillageoisDetails(id_villageois);
        const x = villageois_info.positionX;
        const y = villageois_info.positionY;
        const ressource = req.body.ressourceName;
        const ressourceproche = await getRessourceLaPlusProche(x, y, ressource);
        movetodest(id_villageois, ressourceproche.x, ressourceproche.y);
        tableauConfig[adjustname[id_villageois]].next_action = "recolte";
        res.send(ressourceproche);
});


router.get('/action/:id', (req, res) => {
    const id = req.params.id;
    const adjustedId = adjustname[id];
    if (adjustedId && tableauConfig[adjustedId]) {
        res.json(tableauConfig[adjustedId]);
    } else {
        res.status(404).send(`Action for ID ${id} not found`);
    }
});


export default router;

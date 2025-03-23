import express from 'express';
import {adjustname, tableauConfig} from "../app";
import {getRessourceLaPlusProche, Position} from "../automatisations/maps_ressources";

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
    const x = req.body.x;
    const y = req.body.y;
    const ressource = req.body.ressourceName;
    const ressourceproche: Position = await getRessourceLaPlusProche(x, y, ressource);
    movetodest(id_villageois,ressourceproche.x, ressourceproche.y);
    tableauConfig[adjustname[id_villageois]].next_action = "recolte";
    res.send(ressourceproche);
});

export default router;

import express from 'express';
import {tableauConfig} from "../app";
import {getRessourceLaPlusProche, Position} from "../automatisations/maps_ressources";

const router = express.Router();

router.post('/move', (req, res) => {
    const { id, dest_x, dest_y } = req.body;
    if (tableauConfig[id]) {
        tableauConfig[id].action = "move";
        tableauConfig[id].dest_x = dest_x;
        tableauConfig[id].dest_y = dest_y;
        res.send(`Moving villageois ${id} to (${dest_x}, ${dest_y})`);
    } else {
        res.status(404).send(`Villageois ${id} not found`);
    }
});


router.post('/movetoressource', async (req, res) => {
    const id_villageois = req.body.id_villageois;
    const x = req.body.x;
    const y = req.body.y;
    const ressource = req.body.ressourceName;
    const ressourceproche: Position = await getRessourceLaPlusProche(x, y, ressource);
    res.send(ressourceproche);
    // const { id, dest_x, dest_y } = req.body;
    // if (tableauConfig[id]) {
    //     tableauConfig[id].action = "move";
    //     tableauConfig[id].dest_x = dest_x;
    //     tableauConfig[id].dest_y = dest_y;
    //     res.send(`Moving villageois ${id} to (${dest_x}, ${dest_y})`);
});

export default router;

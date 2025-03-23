import express from 'express';
import { new_bat } from '../automatisations/construction_batiment';
import {adjustname, tableauConfig} from "../app";

const router = express.Router();

router.post('/build', (req, res) => {
    const { id, batiment } = req.body;
    // Mettre à jour uniquement les propriétés nécessaires
    if (tableauConfig[adjustname[id]]) {
        tableauConfig[adjustname[id]].action = "set-construction";
        tableauConfig[adjustname[id]].batiment = batiment;
        new_bat(id, batiment).then(r => {res.send(`Building ${batiment} with villageois ${id})`);});
    } else {
        res.status(404).send(`Villageois ${id} not found`);
    }
});

router.post('/move-and-build', (req, res) => {
    const { id, batiment, dest_x, dest_y } = req.body;
    if (tableauConfig[adjustname[id]]) {
        // Mettre à jour la configuration pour le déplacement
        tableauConfig[adjustname[id]].action = "move";
        tableauConfig[adjustname[id]].dest_x = dest_x;
        tableauConfig[adjustname[id]].dest_y = dest_y;
        tableauConfig[adjustname[id]].next_action = "set-construction";
        tableauConfig[adjustname[id]].batiment = batiment;

        res.send(`Villageois ${id} will move to (${dest_x}, ${dest_y}) and then build ${batiment}`);
    } else {
        res.status(404).send(`Villageois ${id} not found`);
    }
});

export default router;

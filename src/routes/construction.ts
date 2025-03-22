import express from 'express';
import { new_bat } from '../automatisations/construction_batiment';
import {tableauConfig} from "../app";

const router = express.Router();

router.post('/build', (req, res) => {
    const { id, batiment } = req.body;
    // Mettre à jour uniquement les propriétés nécessaires
    if (tableauConfig[id]) {
        tableauConfig[id].action = "set-construction";
        tableauConfig[id].batiment = batiment;

        new_bat(id, batiment);
        res.send(`Building ${batiment} with villageois ${id})`);
    } else {
        res.status(404).send(`Villageois ${id} not found`);
    }
});

export default router;

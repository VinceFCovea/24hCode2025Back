import express from 'express';
import { recolte_case } from '../automatisations/recolte_case';
import {adjustname, tableauConfig} from "../app";

const router = express.Router();

router.post('/recolte', (req, res) => {
    const { id, ressource } = req.body;
    // Mettre à jour uniquement les propriétés nécessaires
    if (tableauConfig[adjustname[id]]) {
        tableauConfig[adjustname[id]].action = "recolte";
        tableauConfig[adjustname[id]].ressource = ressource;
        recolte_case(id, ressource).then(r => res.send(`Villageois ${id} is collecting ${ressource}`));
    } else {
        res.status(404).send(`Villageois ${id} not found`);
    }
});

router.post('/pause', (req, res) => {
    const { id } = req.body;
    // Mettre à jour uniquement les propriétés nécessaires
    if (tableauConfig[adjustname[id]]) {
        tableauConfig[adjustname[id]].action = "pause";
        res.send(`Villageois ${id} is paused`);
    } else {
        res.status(404).send(`Villageois ${id} not found`);
    }
});

export default router;

import express from 'express';
import {tableauConfig} from "../app";

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

export default router;

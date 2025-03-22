import * as dotenv from 'dotenv';
import { demanderAction } from '../api_request/villageois';
import * as path from "node:path";
import {Monde, RessourceWithQuantite, Terrain} from "../models/Monde";


dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const BASE_URL="http://51.210.117.22:8080"
const ID_EQUIPE="c1b647f1-1748-492a-b5a9-2a9af9b5e5ed"
const BEARER_TOKEN="eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI2VG5aX1o4WlM2YTlYczJqckl4RTZLS0lNbjgyaTdxN3Z4cTRtY3dQOE13In0.eyJleHAiOjE3NDI4MTIxNDcsImlhdCI6MTc0MjYzOTM0NywianRpIjoiMWRjNjFkMDgtNTU3Mi00MjUwLWFmZDktNjUxMTcyNDA1MmIyIiwiaXNzIjoiaHR0cDovLzUxLjIxMC4xMTcuMjI6ODA4MS9yZWFsbXMvY29kZWxlbWFucyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiI0MWJhMTYyZi1hNjkyLTRlOWItYWMzNC04ODkyY2E2ZWI3YWUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJ3b2xvbG8tYmFja2VuZCIsInNlc3Npb25fc3RhdGUiOiJhMjk2ZTQ3MS01OTI4LTQyZGItYTAwMy1kYmJiOGQzNTE4MWIiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIi8qIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtY29kZWxlbWFucyIsInVtYV9hdXRob3JpemF0aW9uIiwidXNlciJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoiZW1haWwgcHJvZmlsZSIsInNpZCI6ImEyOTZlNDcxLTU5MjgtNDJkYi1hMDAzLWRiYmI4ZDM1MTgxYiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiemVybyBibGFibGEiLCJ0ZWFtX2lkIjoiYzFiNjQ3ZjEtMTc0OC00OTJhLWI1YTktMmE5YWY5YjVlNWVkIiwicHJlZmVycmVkX3VzZXJuYW1lIjoibGVzLWNhdmFsaWVycy1kZS1sYS10ZXJyZSIsImdpdmVuX25hbWUiOiJ6ZXJvIGJsYWJsYSJ9.sickiX8d4rX3f-g4q510KqRB1Sv3EsoG0gs-q4_AMZirtSgLmtdIQvYWXfOfYvOV9m0fbV0HKa6mTwfkSN3qfX2jz3ovmWGDRhu6McVrUQDcysYAJImsIlCSxHXdz7Kv8vJZAMddA1AAb_UCVzY80p11kVfMpJqbzX2VPBNg_i_nxbr7TO4wgkyT58MDKTS7RuRz5FUgUjNzPcSlWOkFZsoStPk31y5_OipRaK9AC7TbuId6Iz6UaC5jT74xeijVTXBzwIxs9wGNi8pZv3rO8Gloh_JlzO7rW-x1C_YdXLilJ5fctyQdjPuEksLYth_CQIv916g6sIkRputUpKuJBQ"

// console.log(process.env.BEARER_TOKEN);
// console.log(process.env.ID_EQUIPE);
// console.log(process.env.ID_VILLAGEOIS);
// console.log(process.env.BASE_URL);

async function recolte_case(id_villageois: string, ressources:string)
{
    try {

        //console.log("recolte")
        await demanderAction('RECOLTER', ressources, id_villageois);
        //console.log('Action demandée avec succès.');
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API:', error);
    }
}



function getRessourcesTerrain(monde : Monde) : RessourceWithQuantite[] {
    return monde.ressources;
}

function getTerrain(monde : Monde) : Terrain {
    return monde.terrain;
}

function getListNomRessources(ressources : RessourceWithQuantite[]) : String[] {
    //console.log(ressources[0].ressource);
    return ressources.map(rp => rp.ressource.nom);
}

export { recolte_case, getRessourcesTerrain, getListNomRessources, getTerrain };

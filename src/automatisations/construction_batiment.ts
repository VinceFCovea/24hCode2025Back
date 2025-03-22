import {demanderAction} from "../api_request/villageois";
import {Monde, Terrain} from "../models/Monde";
import Batiment from "../models/Batiments";

const BASE_URL="http://51.210.117.22:8080"
const ID_EQUIPE="c1b647f1-1748-492a-b5a9-2a9af9b5e5ed"
const ID_VILLAGEOIS="61acd05a-a8e2-45b9-a757-5d4138c92c63"
const BEARER_TOKEN="eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI2VG5aX1o4WlM2YTlYczJqckl4RTZLS0lNbjgyaTdxN3Z4cTRtY3dQOE13In0.eyJleHAiOjE3NDI4MTIxNDcsImlhdCI6MTc0MjYzOTM0NywianRpIjoiMWRjNjFkMDgtNTU3Mi00MjUwLWFmZDktNjUxMTcyNDA1MmIyIiwiaXNzIjoiaHR0cDovLzUxLjIxMC4xMTcuMjI6ODA4MS9yZWFsbXMvY29kZWxlbWFucyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiI0MWJhMTYyZi1hNjkyLTRlOWItYWMzNC04ODkyY2E2ZWI3YWUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJ3b2xvbG8tYmFja2VuZCIsInNlc3Npb25fc3RhdGUiOiJhMjk2ZTQ3MS01OTI4LTQyZGItYTAwMy1kYmJiOGQzNTE4MWIiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIi8qIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtY29kZWxlbWFucyIsInVtYV9hdXRob3JpemF0aW9uIiwidXNlciJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoiZW1haWwgcHJvZmlsZSIsInNpZCI6ImEyOTZlNDcxLTU5MjgtNDJkYi1hMDAzLWRiYmI4ZDM1MTgxYiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiemVybyBibGFibGEiLCJ0ZWFtX2lkIjoiYzFiNjQ3ZjEtMTc0OC00OTJhLWI1YTktMmE5YWY5YjVlNWVkIiwicHJlZmVycmVkX3VzZXJuYW1lIjoibGVzLWNhdmFsaWVycy1kZS1sYS10ZXJyZSIsImdpdmVuX25hbWUiOiJ6ZXJvIGJsYWJsYSJ9.sickiX8d4rX3f-g4q510KqRB1Sv3EsoG0gs-q4_AMZirtSgLmtdIQvYWXfOfYvOV9m0fbV0HKa6mTwfkSN3qfX2jz3ovmWGDRhu6McVrUQDcysYAJImsIlCSxHXdz7Kv8vJZAMddA1AAb_UCVzY80p11kVfMpJqbzX2VPBNg_i_nxbr7TO4wgkyT58MDKTS7RuRz5FUgUjNzPcSlWOkFZsoStPk31y5_OipRaK9AC7TbuId6Iz6UaC5jT74xeijVTXBzwIxs9wGNi8pZv3rO8Gloh_JlzO7rW-x1C_YdXLilJ5fctyQdjPuEksLYth_CQIv916g6sIkRputUpKuJBQ"


async function new_bat(id_villageois: string, batiment :string) {
    try {
        await demanderAction('COMMENCER_CONSTRUCTION', batiment, id_villageois);
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API:', error);
    }
}

async function continue_contruire_bat(id_villageois: string, batiment :string)
{
    try {
        await demanderAction('CONSTRUIRE', batiment, id_villageois);
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API:', error);
    }
}

function can_build(terrain : Terrain, batiment : Batiment): boolean{
    const terrain_nom = terrain.nom;
    const batiment_terrain : String[] = batiment.constructibleSur;
    return batiment_terrain.includes(terrain_nom);
}

function get_construction_status(monde: Monde){
    return monde.batiment_construit.progression;
}

export {new_bat, continue_contruire_bat, can_build, get_construction_status};
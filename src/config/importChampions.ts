/**
 * Script d'importation des champions FR/EN
 * ----------------------------------------
 * Convertit le format Data Dragon (objet) en tableau et importe dans MongoDB.
 *
 * Source : Fiche "MongoDB Node Driver"
 * Source : Fiche "Projet complet en Mongoose"
 */

import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Champion from '../models/Champion';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Type représentant un champion tel que fourni par Data Dragon.
 *
 * Note : le fichier JSON de Riot utilise un OBJET et non un TABLEAU.
 * On convertit donc l'objet en liste via Object.values().
 *
 * Source : Fiche Introduction à TypeScript
 */
interface DataDragonChampion {
  name: string;
  title?: string;
  tags?: string[];
  image?: {
    full: string;
  };
  // autres propriétés ignorées
}

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log('✔ Connexion MongoDB OK'))
  .catch((err) => console.error('❌ Erreur MongoDB :', err));

async function importerChampions() {
  try {
    // Chargement fichiers JSON
    const frPath = path.join(__dirname, '../../data/champions_fr.json');
    const enPath = path.join(__dirname, '../../data/champions_en.json');

    const fichierFR = JSON.parse(fs.readFileSync(frPath, 'utf8'));
    const fichierEN = JSON.parse(fs.readFileSync(enPath, 'utf8'));

    /**
     * Conversion OBJET -> TABLEAU
     * Data Dragon fournit:
     * fichier.data = { "Aatrox": {...}, "Ahri": {...}, ... }
     */
    const championsFR: DataDragonChampion[] = Object.values(fichierFR.data);
    const championsEN: DataDragonChampion[] = Object.values(fichierEN.data);

    console.log(`Importation de ${championsFR.length} champions...`);

    if (championsFR.length !== championsEN.length) {
      console.warn(
        "⚠ Attention : les deux fichiers n'ont pas la même longueur !",
      );
    }

    // Transformation en documents Mongoose
    const documents = championsFR.map((fr, index) => {
      const en = championsEN[index];

      return {
        nom: fr.name,
        nom_en: en.name,
        image: fr.image?.full
          ? `https://ddragon.leagueoflegends.com/cdn/15.23.1/img/champion/${fr.image.full}`
          : '',
        role: fr.tags?.[0] || 'Inconnu',
        tags: fr.tags || [],
      };
    });

    await Champion.deleteMany();
    await Champion.insertMany(documents);

    console.log('✔ Importation terminée !');
    process.exit();
  } catch (err) {
    console.error("❌ Erreur durant l'importation :", err);
    process.exit(1);
  }
}

importerChampions();

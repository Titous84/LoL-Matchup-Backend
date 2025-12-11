/**
 * server.ts
 * ---------
 * Point d'entrée du serveur Express.
 *
 * Configure :
 *  - Express + JSON + CORS
 *  - Connexion à MongoDB
 *  - Routes /champions, /matchups, /auth
 *
 * Source : Fiche Express – Création d'un serveur
 * Source : Fiche MongoDB/Mongoose – Connexion
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import championRoutes from './routes/champion.routes';
import matchupRoutes from './routes/matchup.routes';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();

// Middleware globaux
app.use(cors());
app.use(express.json());

// Connexion MongoDB
const mongoUri = process.env.MONGO_URI || '';
if (!mongoUri) {
  console.error('❌ MONGO_URI manquant dans le fichier .env');
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => console.log('✔ Connexion MongoDB OK'))
  .catch((err) => {
    console.error('❌ Erreur de connexion à MongoDB :', err);
    process.exit(1);
  });

// Routes
app.use('/champions', championRoutes);
app.use('/matchups', matchupRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✔ Serveur lancé sur le port ${PORT}`);
});

/**
 * Connexion à MongoDB
 * Source : Fiche MongoDB – DevWeb3
 */

import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('✔ Connexion MongoDB réussie');
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB :', error);
    process.exit(1);
  }
};

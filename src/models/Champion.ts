/**
 * Modèle Champion pour League of Legends
 * --------------------------------------
 * Ce modèle représente un champion avec ses propriétés essentielles.
 *
 * Source : Fiche "Introduction à Mongoose" – DevWeb3
 * Source : Fiche "Mongoose – La suite" – DevWeb3
 */

import mongoose from 'mongoose';

const ChampionSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom du champion est requis.'],
  },

  nom_en: {
    type: String,
    required: [true, 'Le nom anglais du champion est requis.'],
  },

  image: {
    type: String,
    required: [true, "L'URL de l'image du champion est requise."],
  },

  role: {
    type: String,
    default: 'inconnu',
  },

  dateAjout: {
    type: Date,
    default: Date.now, // Source : Fiche MongoDB – champ de type Date
  },

  actif: {
    type: Boolean,
    default: true,
  },

  tags: {
    type: [String], // tableau requis par les consignes du projet
    default: [],
  },
});

export default mongoose.model('Champion', ChampionSchema);

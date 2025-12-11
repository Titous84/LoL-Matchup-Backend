/**
 * Modèle Matchup
 * ----------------
 * Représente tes statistiques personnelles contre un champion adverse.
 *
 * Source : Fiche "Introduction à Mongoose" – DevWeb3
 * Source : Fiche "Mongoose – La suite" – DevWeb3
 */

import mongoose, { Schema } from 'mongoose';

const MatchupSchema = new Schema({
  championJoue: {
    type: Schema.Types.ObjectId,
    ref: 'Champion',
    required: [true, 'Le champion joué est requis.'],
  },

  championAdverse: {
    type: Schema.Types.ObjectId,
    ref: 'Champion',
    required: [true, 'Le champion adverse est requis.'],
  },

  victoires: {
    type: Number,
    default: 0,
    min: [0, 'Le nombre de victoires ne peut pas être négatif.'],
  },

  defaites: {
    type: Number,
    default: 0,
    min: [0, 'Le nombre de défaites ne peut pas être négatif.'],
  },

  difficulte: {
    type: Number,
    min: [1, 'La difficulté minimale est 1.'],
    max: [10, 'La difficulté maximale est 10.'],
    default: 5,
  },

  notes: {
    type: String,
    default: '',
    maxlength: [2000, 'Les notes ne doivent pas dépasser 2000 caractères.'],
  },

  dateMAJ: {
    type: Date,
    default: Date.now,
  },

  utilisateur: {
    type: String,
    default: 'Nathan', // remplacera par système d’auth plus tard
  },
});

export default mongoose.model('Matchup', MatchupSchema);

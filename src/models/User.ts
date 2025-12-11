/**
 * Modèle User
 * -----------
 * Représente un utilisateur de l'application.
 *
 * Champs :
 *  - email : identifiant unique
 *  - passwordHash : mot de passe chiffré
 *
 * Source : Fiche "MongoDB Node Driver" / "Introduction à Mongoose"
 */

import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "L'adresse courriel est requise."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Le mot de passe est requis.'],
    },
  },
  {
    timestamps: true, // createdAt / updatedAt
  },
);

export default mongoose.model('User', UserSchema);

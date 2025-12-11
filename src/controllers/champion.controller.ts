/**
 * Contrôleur Champion
 * --------------------
 * Gère la récupération des champions depuis MongoDB.
 *
 * Source : Fiche Express – Contrôleurs
 * Source : Fiche Mongoose – Requêtes
 */

import { Request, Response } from 'express';
import Champion from '../models/Champion';

export const getAllChampions = async (req: Request, res: Response) => {
  try {
    /**
     * Récupération + tri alphabétique
     * Source : Fiche Mongoose – Tri / find()
     */
    const champions = await Champion.find().sort({ nom: 1 });

    return res.status(200).json({
      message: 'Liste des champions récupérée avec succès.',
      total: champions.length,
      data: champions,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Erreur interne lors de la récupération des champions.',
      erreur: err,
    });
  }
};

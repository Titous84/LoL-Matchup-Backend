/**
 * Contrôleur Matchup
 * Source : Fiche Express – Contrôleurs
 * Source : Fiche Mongoose – Requêtes
 */

import { Request, Response } from 'express';
import Matchup from '../models/Matchup';

/**
 * GET /matchups
 */
export const getMatchups = async (req: Request, res: Response) => {
  try {
    const filtre: any = {};

    if (req.query.championJoue) filtre.championJoue = req.query.championJoue;
    if (req.query.championAdverse)
      filtre.championAdverse = req.query.championAdverse;

    const matchups = await Matchup.find(filtre)
      .populate('championJoue')
      .populate('championAdverse')
      .sort({ dateMAJ: -1 });

    return res.status(200).json({
      message: 'Matchups récupérés avec succès.',
      total: matchups.length,
      data: matchups,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Erreur lors de la récupération des matchups.',
      erreur: err,
    });
  }
};

/**
 * POST /matchups
 */
export const createMatchup = async (req: Request, res: Response) => {
  try {
    const {
      championJoue,
      championAdverse,
      victoires,
      defaites,
      difficulte,
      notes,
    } = req.body;

    if (!championJoue || !championAdverse) {
      return res.status(400).json({
        message: 'Le champion joué et le champion adverse sont requis.',
      });
    }

    const matchup = await Matchup.create({
      championJoue,
      championAdverse,
      victoires,
      defaites,
      difficulte,
      notes,
    });

    return res.status(201).json({
      message: 'Matchup créé avec succès.',
      data: matchup,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Erreur lors de la création du matchup.',
      erreur: err,
    });
  }
};

/**
 * PUT /matchups/:id
 */
export const updateMatchup = async (req: Request, res: Response) => {
  try {
    const updated = await Matchup.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        message: 'Matchup introuvable.',
      });
    }

    return res.status(200).json({
      message: 'Matchup mis à jour avec succès.',
      data: updated,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Erreur lors de la mise à jour du matchup.',
      erreur: err,
    });
  }
};

/**
 * DELETE /matchups/:id
 */
export const deleteMatchup = async (req: Request, res: Response) => {
  try {
    await Matchup.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: 'Matchup supprimé avec succès.',
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Erreur lors de la suppression du matchup.',
      erreur: err,
    });
  }
};

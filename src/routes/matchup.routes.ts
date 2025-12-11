/**
 * Routes Matchup
 * --------------
 * Gère les statistiques de matchups.
 *
 * GET /matchups                -> liste (avec filtres)
 * POST /matchups               -> création (protégé par JWT)
 * PUT /matchups/:id            -> mise à jour (protégé par JWT)
 * DELETE /matchups/:id         -> suppression (protégé par JWT)
 *
 * Sources :
 *  - Fiche Express – Routes
 *  - Fiche Middleware – Intergiciels
 */

import { Router } from 'express';
import {
  getMatchups,
  createMatchup,
  updateMatchup,
  deleteMatchup,
} from '../controllers/matchup.controller';
import { verifierToken } from '../middleware/auth.middleware';

const router = Router();

// GET public (avec filtres)
router.get('/', getMatchups);

// Toutes les routes suivantes nécessitent un token valide
router.post('/', verifierToken, createMatchup);
router.put('/:id', verifierToken, updateMatchup);
router.delete('/:id', verifierToken, deleteMatchup);

export default router;

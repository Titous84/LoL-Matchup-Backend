/**
 * Routes Champion
 * ----------------
 * Associe les URL aux fonctions du contrôleur Champion.
 *
 * Source : Fiche Express – Routes
 */

import { Router } from 'express';
import { getAllChampions } from '../controllers/champion.controller';

const router = Router();

// GET /champions → liste complète
router.get('/', getAllChampions);

export default router;

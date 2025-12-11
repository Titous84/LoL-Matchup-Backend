/**
 * Routes d'authentification
 * -------------------------
 * /auth/register
 * /auth/login
 *
 * Source : Fiche Express – Routes
 */

import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);

export default router;

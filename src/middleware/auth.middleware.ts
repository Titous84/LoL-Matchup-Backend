/**
 * Middleware d'authentification JWT
 * ---------------------------------
 * Vérifie la présence et la validité d'un token JWT.
 *
 * Le token est attendu dans l'en-tête HTTP :
 *   Authorization: Bearer <token>
 *
 * Sources :
 *  - Fiche Middleware Express
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

/**
 * On étend le type Request pour y ajouter "user".
 */
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

/**
 * Middleware : vérifie le token et ajoute req.user
 */
export const verifierToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      message: 'Token manquant. Authentification requise.',
    });
  }

  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({
      message: 'Format de token invalide. Attendu : Bearer <token>.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
    };

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (err) {
    return res.status(401).json({
      message: 'Token invalide ou expiré.',
    });
  }
};

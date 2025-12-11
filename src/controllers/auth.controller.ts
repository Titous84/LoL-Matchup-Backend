/**
 * Contrôleur d'authentification
 * ------------------------------
 * Gère :
 *  - POST /auth/register : inscription
 *  - POST /auth/login : connexion
 *
 * Utilise :
 *  - bcryptjs pour chiffrer les mots de passe
 *  - jsonwebtoken pour générer un token JWT
 *
 * Sources utilisées :
 *  - Fiche Développement Web 3 — Middleware et sécurisation
 *  - Fiche MongoDB / Mongoose — Modèles et validation
 *  - Fiche Express — Contrôleurs et architecture MVC
 */

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import User from '../models/User';

/**
 * Récupération des variables .env
 * JWT_SECRET : chaîne utilisée pour signer les tokens
 * JWT_EXPIRES_IN : ex : "7d", "2h", "30m", etc.
 */
const JWT_SECRET: Secret = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Génère un JWT pour un utilisateur.
 */
function genererToken(user: { id: string; email: string }) {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as unknown as SignOptions['expiresIn'], // <-- Fix typage TS pour compatibilité jsonwebtoken v9 / @types
  };

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET,
    options,
  );
}

/**
 * =============================
 *   POST /auth/register
 * =============================
 * Inscription d'un nouvel utilisateur.
 *
 * Body attendu :
 * {
 *   "email": "test@example.com",
 *   "password": "monmotdepasse"
 * }
 *
 * Étapes :
 *  - Valider le body
 *  - Vérifier si l’utilisateur existe déjà
 *  - Chiffrer le mot de passe
 *  - Créer l’utilisateur
 *  - Générer un token JWT
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    // Validation simple
    if (!email || !password) {
      return res.status(400).json({
        message: "L'email et le mot de passe sont requis.",
      });
    }

    // Vérifier si l’utilisateur existe déjà
    const dejaExistant = await User.findOne({ email: email.toLowerCase() });
    if (dejaExistant) {
      return res.status(409).json({
        message: 'Un utilisateur existe déjà avec cet email.',
      });
    }

    // Hash du mot de passe
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Création de l'utilisateur
    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
    });

    // Génération du token
    const token = genererToken({
      id: user._id.toString(),
      email: user.email,
    });

    return res.status(201).json({
      message: 'Utilisateur créé avec succès.',
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Erreur register :', err);
    return res.status(500).json({
      message: "Erreur lors de l'inscription.",
      erreur: err,
    });
  }
};

/**
 * =============================
 *   POST /auth/login
 * =============================
 * Connexion d'un utilisateur existant.
 *
 * Body attendu :
 * {
 *   "email": "test@example.com",
 *   "password": "monmotdepasse"
 * }
 *
 * Étapes :
 *  - Valider le body
 *  - Vérifier que l’email existe
 *  - Vérifier que le mot de passe correspond
 *  - Générer un token JWT
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    // Validation rapide
    if (!email || !password) {
      return res.status(400).json({
        message: "L'email et le mot de passe sont requis.",
      });
    }

    // Chercher l'utilisateur
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        message: 'Email ou mot de passe invalide.',
      });
    }

    // Vérifier le mot de passe
    const motDePasseValide = await bcrypt.compare(password, user.passwordHash);
    if (!motDePasseValide) {
      return res.status(401).json({
        message: 'Email ou mot de passe invalide.',
      });
    }

    // Générer le token
    const token = genererToken({
      id: user._id.toString(),
      email: user.email,
    });

    return res.status(200).json({
      message: 'Connexion réussie.',
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Erreur login :', err);
    return res.status(500).json({
      message: 'Erreur lors de la connexion.',
      erreur: err,
    });
  }
};

import { Request, Response, NextFunction } from 'express';

export const isAdmin = (req: any, res: Response, next: NextFunction) => {
  // Le rôle est extrait du token JWT décodé par le middleware d'auth précédent
  if (req.user && req.user.role === 'Administrateur') {
    next();
  } else {
    res.status(403).json({ error: "Accès refusé : Droits Administrateur requis." });
  }
};
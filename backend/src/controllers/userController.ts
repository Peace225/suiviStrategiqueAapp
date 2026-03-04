import { Request, Response } from 'express';
import { userService } from '../services/userService';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.fetchAllUsers();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: "Erreur lors de la récupération des collaborateurs" });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const { uid } = req.params;
  try {
    await userService.updateAccess(uid, req.body);
    res.status(200).json({ message: "Profil mis à jour avec succès" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
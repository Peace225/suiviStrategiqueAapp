import { Request, Response } from 'express';
import { reportService } from '../services/reportService';

export const getGlobalReport = async (req: Request, res: Response) => {
  try {
    const distribution = await reportService.getStrategicDistribution();
    res.status(200).json({
      title: "Répartition Stratégique Globale",
      unit: "Heures",
      data: distribution
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyDepartmentReport = async (req: any, res: Response) => {
  try {
    // On utilise le département de l'utilisateur connecté (via le middleware d'auth)
    const deptId = req.user.departmentId; 
    const stats = await reportService.getDepartmentStats(deptId);
    res.status(200).json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
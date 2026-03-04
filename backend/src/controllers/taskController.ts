import { Request, Response } from 'express';
import { taskService } from '../services/taskService';

export const startTask = async (req: Request, res: Response) => {
  try {
    const task = await taskService.start(req.body);
    res.status(201).json({ id: task.id, message: "Chronomètre démarré" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const stopTask = async (req: Request, res: Response) => {
  try {
    await taskService.stop(req.params.id);
    res.status(200).json({ message: "Activité terminée et enregistrée" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const validateTask = async (req: Request, res: Response) => {
  try {
    await taskService.processValidation(req.params.id, req.body);
    res.status(200).json({ message: "Décision enregistrée" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
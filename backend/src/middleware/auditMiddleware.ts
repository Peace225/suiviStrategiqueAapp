import { Request, Response, NextFunction } from 'express';
import { auditService } from '../services/auditService';

export const auditLogger = (actionDescription: string) => {
  return async (req: any, res: Response, next: NextFunction) => {
    // On capture la fin de la requête pour savoir si elle a réussi
    res.on('finish', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const userId = req.user?.uid || 'anonymous';
        const userEmail = req.user?.email || 'unknown';
        
        auditService.log(userId, userEmail, actionDescription, {
          method: req.method,
          path: req.originalUrl,
          params: req.params,
          ip: req.ip,
          severity: 'INFO'
        });
      }
    });
    next();
  };
};
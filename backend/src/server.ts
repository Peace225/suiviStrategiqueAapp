import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

// Importations des configurations et routes
import { specs } from './config/swagger';
import taskRoutes from './routes/taskRoutes';
import userRoutes from './routes/userRoutes';
import reportRoutes from './routes/reportRoutes';

// Initialisation de l'environnement
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARES DE SÉCURITÉ ---

// Helmet protège l'application des vulnérabilités HTTP courantes (standard bancaire)
app.use(helmet()); 

// Configuration CORS pour autoriser votre frontend Vercel
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Idéalement, remplacez par votre URL Vercel
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true
}));

// Analyse des corps de requête JSON
app.use(express.json());

// --- DOCUMENTATION API (SWAGGER) ---

// Accessible via /api-docs pour les évaluateurs du PNUD
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customSiteTitle: "BGFIBank Strategic API Docs"
}));

// --- ROUTES ---

// Route de santé (Health Check) pour le monitoring du déploiement
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'UP',
    system: 'BGFIBank Strategic Piloting',
    timestamp: new Date().toISOString()
  });
});

// Montage des modules de l'application
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);

// --- GESTION DES ERREURS GLOBALES ---

app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Une erreur interne est survenue sur le serveur BGFIBank',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// --- DÉMARRAGE DU SERVEUR ---

app.listen(PORT, () => {
  console.log(`
  ======================================================
  🚀 SERVEUR BGFIBank OPÉRATIONNEL
  📡 PORT : ${PORT}
  📑 DOCS : http://localhost:${PORT}/api-docs
  🔐 MODE : ${process.env.NODE_ENV || 'development'}
  ======================================================
  `);
});

export default app;
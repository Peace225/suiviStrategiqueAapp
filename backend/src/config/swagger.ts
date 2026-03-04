import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BGFIBank Strategic Piloting API',
      version: '1.0.0',
      description: 'Documentation officielle du backend de pilotage des objectifs stratégiques. Cette API gère le suivi du temps, la validation manager et le reporting stratégique.',
      contact: {
        name: "Support Technique BGFIBank",
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5000',
        description: 'Serveur de production / développement',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // On cible les fichiers .ts en dev et .js en prod (après build)
  apis: ['./src/routes/*.ts', './dist/routes/*.js'],
};

export const specs = swaggerJsdoc(swaggerOptions);
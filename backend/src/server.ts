import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BGFIBank Strategic Piloting API',
      version: '1.0.0',
      description: 'Documentation officielle du backend de pilotage des objectifs stratégiques',
    },
    servers: [{ url: 'http://localhost:5000' }],
  },
  apis: ['./src/routes/*.ts'], // Chemin vers vos fichiers de routes
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
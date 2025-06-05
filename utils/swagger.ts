import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Unelma Code Translate API',
      version: '1.0.0',
      description: 'API for translating code between different programming languages',
      contact: {
        name: 'Support',
        email: 'info@unelmaplatforms.com',
      },
    },
    servers: [
      {
        url: 'https://translate.u16p.com',
        description: 'Production server',
      },
      {
        url: 'http://localhost:3000',
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: 'API key for authentication',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
      },
    },
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
  },
  apis: [
    './pages/api/translate.ts',
    './pages/api/v1/translate.ts',
    './pages/api/v1/health.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);

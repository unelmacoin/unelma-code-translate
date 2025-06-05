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
      license: {
        name: 'MIT',
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
    tags: [
      {
        name: 'Translation',
        description: 'Code translation operations',
      },
      {
        name: 'Health',
        description: 'Health check endpoint',
      },
    ],
    paths: {
      '/api/v1/translate': {
        get: {
          tags: ['Translation'],
          summary: 'Get list of supported languages',
          description: 'Returns an array of all supported programming languages for translation',
          responses: {
            '200': {
              description: 'List of supported languages',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      languages: {
                        type: 'array',
                        items: {
                          type: 'string',
                        },
                        example: ['python', 'javascript', 'typescript', 'java'],
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Translation'],
          summary: 'Translate code between programming languages',
          description: 'Translate source code from one programming language to another',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['source_code', 'from_lang', 'to_lang'],
                  properties: {
                    source_code: {
                      type: 'string',
                      description: 'The source code to translate',
                      example: 'def hello():\n    print(\'Hello, World!\')',
                    },
                    from_lang: {
                      type: 'string',
                      description: 'Source programming language',
                      example: 'python',
                    },
                    to_lang: {
                      type: 'string',
                      description: 'Target programming language',
                      example: 'javascript',
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Successful translation',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      source_code: {
                        type: 'string',
                        description: 'Original source code',
                      },
                      from_lang: {
                        type: 'string',
                        description: 'Source language',
                      },
                      to_lang: {
                        type: 'string',
                        description: 'Target language',
                      },
                      translated_code: {
                        type: 'string',
                        description: 'Translated code',
                      },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Bad request (missing or invalid parameters)',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/translate': {
        post: {
          tags: ['Translation'],
          summary: 'Translate code between programming languages (legacy endpoint)',
          description: 'Translate source code from one programming language to another',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['inputLanguage', 'outputLanguage', 'inputCode'],
                  properties: {
                    inputLanguage: {
                      type: 'string',
                      description: 'Source programming language',
                      example: 'python',
                    },
                    outputLanguage: {
                      type: 'string',
                      description: 'Target programming language',
                      example: 'javascript',
                    },
                    inputCode: {
                      type: 'string',
                      description: 'The source code to translate',
                      example: 'def hello():\n    print(\'Hello, World!\')',
                    },
                    model: {
                      type: 'string',
                      description: 'Model to use for translation',
                      example: 'gpt-4',
                    },
                    apiKey: {
                      type: 'string',
                      description: 'OpenAI API key',
                      example: 'sk-...',
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Successful translation',
              content: {
                'text/plain': {
                  schema: {
                    type: 'string',
                    description: 'Translated code',
                  },
                },
              },
            },
            '400': {
              description: 'Bad request (missing or invalid parameters)',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/health': {
        get: {
          tags: ['Health'],
          summary: 'Check API health status',
          description: 'Returns the current health status of the API',
          responses: {
            '200': {
              description: 'API is healthy',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: {
                        type: 'string',
                        example: 'ok',
                      },
                      timestamp: {
                        type: 'string',
                        format: 'date-time',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
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
              example: 'Invalid request parameters',
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
  apis: [], // We're defining paths manually, so this can be empty
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);

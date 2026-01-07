const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'VisaTrack Backend API',
      version: '1.0.0',
      description: 'API documentation for VisaTrack Backend services including Visa Applications and Embassy Directory.',
      contact: {
        name: 'API Support',
        email: 'support@visatrack.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development Server',
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
  apis: ['./routes/*.js', './models/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs;

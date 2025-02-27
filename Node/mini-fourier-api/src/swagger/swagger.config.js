const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mini Fourier API',
      version: '1.0.0',
      description: 'API para cálculo de series de Fourier'
    },
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ]
  },
  apis: ['./src/routes/*.js'] 
};

module.exports = swaggerJsdoc(swaggerOptions);
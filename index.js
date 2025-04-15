const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
require('dotenv').config();
const languagesRoutes = require('./routes/languages');
const messagesRoutes = require('./routes/messages');
const notificationsRoutes = require('./routes/notifications');
const quizRoutes = require('./routes/quiz');
const resultsRoutes = require('./routes/results');
const settingsRoutes = require('./routes/settings');
const studyplansRoutes = require('./routes/studyplans');
const hobbiesRoutes = require('./routes/hobbies');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const db = require('./database/db');
const app = express();

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'FutureX API',
            version: '1.0.0',
            description: 'API documentation for the FutureX application',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app.use(cors());
app.use(express.json());

// Make database pool available in request object
app.use((req, res, next) => {
  req.pool = db;
  next();
});

app.get('/', (req, res) => {
  res.send('backend is running');
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: Test endpoint
 *     description: Returns a message indicating the backend is running.
 *     responses:
 *       200:
 *         description: Backend is running successfully.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: backend is running
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user
 *           readOnly: true
 *         username:
 *           type: string
 *           description: The user's username
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's password
 *       example:
 *         username: johndoe
 *         email: johndoe@example.com
 *         password: securepassword
 */

app.use('/api/auth', authRoutes);
app.use('/api/languages', languagesRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/results', resultsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/studyplans', studyplansRoutes);
app.use('/api/hobbies', hobbiesRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 3000;

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('Unhandled Promise Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});


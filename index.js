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
const swaggerJSDoc = require('swagger-jsdoc');
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



app.use(cors());
app.use(express.json());


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


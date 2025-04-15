const express = require('express');
const cors = require('cors');
const { initializeApp, cert } = require('firebase-admin/app');
const swaggerUi = require('swagger-ui-express');
const authRoutes = require('./routes/auth');
const hobbiesRoutes = require('./routes/hobbies');
const languagesRoutes = require('./routes/languages');
const messagesRoutes = require('./routes/messages');
const notificationsRoutes = require('./routes/notifications');
const quizRoutes = require('./routes/quiz');
const resultsRoutes = require('./routes/results');
const settingsRoutes = require('./routes/settings');
const studyPlansRoutes = require('./routes/studyplans');
const serviceAccount = require('./futurex-4b8d1-firebase-adminsdk-d851l-4487887a2d.json');
const swaggerJSDoc = require('swagger-jsdoc');
const app = express();
const port = 3000;

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: 'https://futurex-4b8d1-default-rtdb.firebaseio.com'
});

const { getDatabase, ref, set, get } = require('firebase-admin/database');
const db = getDatabase();



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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
app.use('/api/hobbies', hobbiesRoutes);
app.use('/api/languages', languagesRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/results', resultsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/studyplans', studyPlansRoutes);

async function testFirebaseConnection() {
  try {
    const testRef = ref(db, 'test');
    await set(testRef, { message: 'Firebase connection successful!' });
    const snapshot = await get(testRef);
    console.log('Firebase Test:', snapshot.val());
  } catch (error) {
    console.error('Firebase connection test failed:', error);
  }
}
testFirebaseConnection();
app.listen(port, () => {console.log(`Server is running on port ${port}`);});

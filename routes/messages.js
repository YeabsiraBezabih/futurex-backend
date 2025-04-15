const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - sender_id
 *         - receiver_id
 *         - content
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the message
 *           readOnly: true
 *         sender_id:
 *           type: integer
 *           description: The ID of the user sending the message
 *         receiver_id:
 *           type: integer
 *           description: The ID of the user receiving the message
 *         content:
 *           type: string
 *           description: The content of the message
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: The timestamp of when the message was sent
 *       example:
 *         sender_id: 1
 *         receiver_id: 2
 *         content: "Hello there!"
 */

/**
 * @swagger
 * /api/messages/{user_id1}/{user_id2}:
 *   get:
 *     summary: Get messages between two users
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: user_id1
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the first user
 *       - in: path
 *         name: user_id2
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the second user
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       500:
 *         description: Internal Server Error
 */
router.get('/:user_id1/:user_id2', authMiddleware.authenticateToken, messagesController.getMessages);

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Create a new message
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Message'
 *     responses:
 *       201:
 *         description: Message created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       500:
 *         description: Internal Server Error
 */
router.post('/', authMiddleware.authenticateToken, messagesController.createMessage);

module.exports = router;

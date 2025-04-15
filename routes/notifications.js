const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: API for managing messages
 */

/**
 * @swagger
 * /api/messages/{senderId}/{receiverId}:
 *   get:
 *     summary: Get messages between two users
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: senderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the sender
 *       - in: path
 *         name: receiverId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the receiver
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   content:
 *                     type: string
 *                   sender_id:
 *                     type: integer
 *                   receiver_id:
 *                     type: integer
 */
router.get('/:senderId/:receiverId', messagesController.getMessages);

module.exports = router;

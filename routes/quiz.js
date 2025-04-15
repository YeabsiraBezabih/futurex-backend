const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middlewares/authMiddleware');
/**
 * @swagger
 * components:
 *   schemas:
 *     QuizQuestion:
 *       type: object
 *       required:
 *         - question
 *         - options
 *         - correctAnswer
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the quiz question
 *           readOnly: true
 *         question:
 *           type: string
 *           description: The text of the quiz question
 *         options:
 *           type: array
 *           items:
 *             type: string
 *           description: The possible answers to the question
 *         correctAnswer:
 *           type: string
 *           description: The correct answer to the question
 *       example:
 *         question: What is the capital of France?
 *         options: ["Berlin", "Madrid", "Paris", "Rome"]
 *         correctAnswer: "Paris"
 */

/**
 * @swagger
 * /api/quiz:
 *   get:
 *     summary: Get all quiz questions
 *     tags: [Quiz]
 *     responses:
 *       200:
 *         description: List of quiz questions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/QuizQuestion'
 */
router.get('/', quizController.getAllQuestions);

/**
 * @swagger
 * /api/quiz/{id}:
 *   get:
 *     summary: Get a quiz question by ID
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the quiz question
 *     responses:
 *       200:
 *         description: Quiz question found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuizQuestion'
 *       404:
 *         description: Quiz question not found
 */
router.get('/:id', quizController.getQuestion);

/**
 * @swagger
 * /api/quiz:
 *   post:
 *     summary: Create a new quiz question
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuizQuestion'
 *     responses:
 *       201:
 *         description: Quiz question created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuizQuestion'
 */
router.post('/', authMiddleware, quizController.createQuestion);

/**
 * @swagger
 * /api/quiz/{id}:
 *   put:
 *     summary: Update a quiz question
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the quiz question to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuizQuestion'
 *     responses:
 *       200:
 *         description: Quiz question updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuizQuestion'
 *       404:
 *         description: Quiz question not found
 */
router.put('/:id', authMiddleware, quizController.updateQuestion);

/**
 * @swagger
 * /api/quiz/{id}:
 *   delete:
 *     summary: Delete a quiz question
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the quiz question to delete
 *     responses:
 *       204:
 *         description: Quiz question deleted
 *       404:
 *         description: Quiz question not found
 */
router.delete('/:id', authMiddleware, quizController.deleteQuestion);

module.exports = router;

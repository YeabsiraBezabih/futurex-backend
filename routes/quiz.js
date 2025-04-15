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
 *     summary: Get all quizzes
 *     tags: [Quiz]
 *     responses:
 *       200:
 *         description: List of all quizzes
 */
router.get('/', quizController.getAllQuizzes);

/**
 * @swagger
 * /api/quiz/{id}:
 *   get:
 *     summary: Get a quiz by ID
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Quiz details
 *       404:
 *         description: Quiz not found
 */
router.get('/:id', quizController.getQuizById);

/**
 * @swagger
 * /api/quiz:
 *   post:
 *     summary: Create a new quiz
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - language_id
 *               - difficulty_level
 *               - questions
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               language_id:
 *                 type: integer
 *               difficulty_level:
 *                 type: string
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, quizController.createQuiz);

/**
 * @swagger
 * /api/quiz/{id}:
 *   delete:
 *     summary: Delete a quiz
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Quiz deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Quiz not found
 */
router.delete('/:id', authMiddleware, quizController.deleteQuiz);

module.exports = router;

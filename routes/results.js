const express = require('express');
const router = express.Router();
const resultsController = require('../controllers/resultsController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     QuizResult:
 *       type: object
 *       required:
 *         - user_id
 *         - quiz_id
 *         - score
 *       properties:
 *         result_id:
 *           type: integer
 *           description: The auto-generated id of the result
 *           readOnly: true
 *         user_id:
 *           type: integer
 *           description: The id of the user who took the quiz
 *         quiz_id:
 *           type: integer
 *           description: The id of the quiz taken
 *         score:
 *           type: integer
 *           description: The score achieved in the quiz
 *         date_taken:
 *           type: string
 *           format: date-time
 *           description: The date and time when the quiz was taken
 *       example:
 *         user_id: 1
 *         quiz_id: 1
 *         score: 85
 */

/**
 * @swagger
 * /api/results:
 *   post:
 *     summary: Create a new quiz result
 *     tags: [Results]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuizResult'
 *     responses:
 *       201:
 *         description: Result created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuizResult'
 */
router.post('/', authMiddleware, resultsController.createResult);

module.exports = router;

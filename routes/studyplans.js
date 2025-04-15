const express = require('express');
const router = express.Router();
const studyplansController = require('../controllers/studyplansController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: StudyPlans
 *   description: API for managing study plans
 */

/**
 * @swagger
 * /api/studyplans/{user_id}:
 *   get:
 *     summary: Get study plans for a user
 *     tags: [StudyPlans]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 # Define your StudyPlan schema here or reference it
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   user_id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   # Add other properties as needed
 *       500:
 *         description: Internal Server Error
 */
router.get('/:user_id', studyplansController.getStudyPlans);

/**
 * @swagger
 * /api/studyplans:
 *   post:
 *     summary: Create a new study plan
 *     tags: [StudyPlans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             # Define your StudyPlan creation schema
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               user_id:
 *                 type: integer
 *               # Add other properties as needed
 *     responses:
 *       201:
 *         description: Study plan created successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post('/', authMiddleware, studyplansController.createStudyPlan);

/**
 * @swagger
 * /api/studyplans/{id}:
 *   put:
 *     summary: Update a study plan
 *     tags: [StudyPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the study plan to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             # Define your StudyPlan update schema (can be similar to creation)
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               # Add other properties as needed (optional fields should not be required)
 *     responses:
 *       200:
 *         description: Study plan updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Study plan not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/:id', authMiddleware, studyplansController.updateStudyPlan);

/**
 * @swagger
 * /api/studyplans/{id}:
 *   delete:
 *     summary: Delete a study plan
 *     tags: [StudyPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the study plan to delete
 *     responses:
 *       204:
 *         description: Study plan deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Study plan not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:id', authMiddleware, studyplansController.deleteStudyPlan);

module.exports = router;

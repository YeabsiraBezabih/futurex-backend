const express = require('express');
const router = express.Router();
const hobbiesController = require('../controllers/hobbiesController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Hobbies
 *   description: API for managing user hobbies
 */

/**
 * @swagger
 * /api/hobbies:
 *   get:
 *     summary: Get all hobbies
 *     tags: [Hobbies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a list of hobbies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 */
router.get('/', authMiddleware, hobbiesController.getAllHobbies);

/**
 * @swagger
 * /api/hobbies/{id}:
 *   get:
 *     summary: Get a hobby by ID
 *     tags: [Hobbies]
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
 *         description: Returns the hobby
 *       404:
 *         description: Hobby not found
 */
router.get('/:id', authMiddleware, hobbiesController.getHobbyById);

/**
 * @swagger
 * /api/hobbies:
 *   post:
 *     summary: Create a new hobby
 *     tags: [Hobbies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Hobby created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', authMiddleware, hobbiesController.createHobby);

/**
 * @swagger
 * /api/hobbies/{id}:
 *   put:
 *     summary: Update a hobby
 *     tags: [Hobbies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Hobby updated successfully
 *       404:
 *         description: Hobby not found
 */
router.put('/:id', authMiddleware, hobbiesController.updateHobby);

/**
 * @swagger
 * /api/hobbies/{id}:
 *   delete:
 *     summary: Delete a hobby
 *     tags: [Hobbies]
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
 *         description: Hobby deleted successfully
 *       404:
 *         description: Hobby not found
 */
router.delete('/:id', authMiddleware, hobbiesController.deleteHobby);

module.exports = router;

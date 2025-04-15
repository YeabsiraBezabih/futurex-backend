const express = require('express');
const router = express.Router();
const hobbiesController = require('../controllers/hobbiesController'); // Assuming this exists
const authMiddleware = require('../middlewares/authMiddleware'); // Assuming this exists

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
 *                   // Add other properties as needed
 */
router.get('/', hobbiesController.getAllHobbies); // Assuming this function exists

/**
 * @swagger
 * /api/hobbies/{id}:
 *   get:
 *     summary: Get a specific hobby by ID
 *     tags: [Hobbies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the hobby to retrieve
 *     responses:
 *       200:
 *         description: Returns the hobby with the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               // Define properties as needed
 *       404:
 *         description: Hobby not found
 */
router.get('/:id', hobbiesController.getHobbie); // Assuming this function exists

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
 *             // Define properties for creating a hobby, e.g., name, description
 *     responses:
 *       201:
 *         description: Hobby created successfully
 *       401:
 *         description: Unauthorized - authentication required
 */
router.post('/', authMiddleware, hobbiesController.createHobbie); // Assuming these exist

// Add similar Swagger definitions for PUT and DELETE routes, including request body and parameters as needed.

module.exports = router;

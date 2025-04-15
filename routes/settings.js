const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const authMiddleware = require('../middlewares/authMiddleware');
/**
 * @swagger
 * components:
 *   schemas:
 *     Settings:
 *       type: object
 *       required:
 *         - user_id
 *         - theme_preference
 *         - notification_enabled
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the setting
 *           readOnly: true
 *         user_id:
 *           type: integer
 *           description: The id of the user associated with these settings
 *         theme_preference:
 *           type: string
 *           enum: [light, dark, system]
 *           description: The user's preferred theme
 *         notification_enabled:
 *           type: boolean
 *           description: Whether notifications are enabled for the user
 *       example:
 *         user_id: 1
 *         theme_preference: light
 *         notification_enabled: true
 */

/**
 * @swagger
 * /api/settings/{user_id}:
 *   get:
 *     summary: Get settings for a user
 *     tags: [Settings]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The id of the user to retrieve settings for
 *     responses:
 *       200:
 *         description: Settings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Settings'
 *       404:
 *         description: Settings not found for the user
 */
router.get('/:user_id',authMiddleware, settingsController.getSettings);

/**
 * @swagger
 * /api/settings/{id}:
 *   put:
 *     summary: Update a user's settings
 *     tags: [Settings]
 *     description: Updates the settings for a specific user.  Requires authentication.
 */
router.put('/:id', authMiddleware, settingsController.updateSetting);

module.exports = router;

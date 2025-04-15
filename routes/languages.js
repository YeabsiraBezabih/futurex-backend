const express = require('express');
const router = express.Router();
const languageController = require('../controllers/languagesController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Language:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the language
 *           readOnly: true
 *         name:
 *           type: string
 *           description: The name of the language
 *       example:
 *         name: English
 */

/**
 * @swagger
 * /api/languages:
 *   get:
 *     summary: Returns the list of all the languages
 *     tags: [Languages]
 *     responses:
 *       200:
 *         description: The list of the languages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Language'
 */
router.get('/', languageController.getAllLanguages);

/**
 * @swagger
 * /api/languages/{id}:
 *   get:
 *     summary: Get language by id
 *     tags: [Languages]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The language id
 *     responses:
 *       200:
 *         description: The language description by id
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Language'
 *       404:
 *         description: The language was not found\n */
router.get('/:id', languageController.getLanguageById);

/**
 * @swagger
 * /api/languages:
 *   post:
 *     summary: Create a new language
 *     tags: [Languages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Language'
 *     responses:
 *       200:
 *         description: The language was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Language'
 *       500:
 *         description: Some server error
 */
router.post('/', authMiddleware, languageController.createLanguage);
router.put('/:id', authMiddleware, languageController.updateLanguage);

/**
 * @swagger
 * /api/languages/{id}:
 *   delete:
 *     summary: Delete language by id
 *     tags: [Languages]
 */
router.delete('/:id', authMiddleware, languageController.deleteLanguage);

module.exports = router;

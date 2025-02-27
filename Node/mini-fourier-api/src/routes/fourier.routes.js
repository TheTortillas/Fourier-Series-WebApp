const express = require('express');
const router = express.Router();
const fourierController = require('../controllers/fourier.controller');

/**
 * @openapi
 * /fourier/trigonometric:
 *   post:
 *     summary: Calcula la serie trigonométrica
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               funcion:
 *                 type: string
 *               periodo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Respuesta con coeficientes
 */
router.post('/trigonometric', fourierController.calculateTrigonometric);

/**
 * @openapi
 * /fourier/complex:
 *   post:
 *     summary: Calcula la serie compleja
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               funcion:
 *                 type: string
 *               periodo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Respuesta con coeficientes
 */

router.post('/complex', fourierController.calculateComplex);

module.exports = router;
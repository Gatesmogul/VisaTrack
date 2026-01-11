import express from 'express';
import {
    createEmbassy,
    getEmbassies,
    getEmbassyById,
    updateEmbassy,
    deleteEmbassy
} from '../services/embassy.service.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /embassy:
 *   get:
 *     summary: List all embassies
 *     description: Retrieve a list of embassies with optional filtering.
 *     tags: [Embassies]
 *     responses:
 *       200:
 *         description: A list of embassies.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Embassy'
 *   post:
 *     summary: Create a new embassy
 *     description: Create a new embassy entry in the directory.
 *     tags: [Embassies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Embassy'
 *     responses:
 *       201:
 *         description: The created embassy.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Embassy'
 */
router.post('/', authMiddleware, async (req, res) => {
    try {
        const embassy = await createEmbassy(req.body);
        res.status(201).json(embassy);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const embassies = await getEmbassies(req.query);
        res.json(embassies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /embassy/{id}:
 *   get:
 *     summary: Get embassy by ID
 *     description: Retrieve detailed information about a specific embassy.
 *     tags: [Embassies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The embassy ID
 *     responses:
 *       200:
 *         description: Embassy details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Embassy'
 *       404:
 *         description: Embassy not found
 *   put:
 *     summary: Update embassy
 *     description: Update an existing embassy's information.
 *     tags: [Embassies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Embassy'
 *     responses:
 *       200:
 *         description: Updated embassy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Embassy'
 *   delete:
 *     summary: Delete embassy
 *     description: Remove an embassy from the directory.
 *     tags: [Embassies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Embassy removed
 */
router.get('/:id', async (req, res) => {
    try {
        const embassy = await getEmbassyById(req.params.id);
        if (!embassy) return res.status(404).json({ message: 'Embassy not found' });
        res.json(embassy);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const embassy = await updateEmbassy(req.params.id, req.body);
        if (!embassy) return res.status(404).json({ message: 'Embassy not found' });
        res.json(embassy);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const embassy = await deleteEmbassy(req.params.id);
        if (!embassy) return res.status(404).json({ message: 'Embassy not found' });
        res.json({ message: 'Embassy removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;

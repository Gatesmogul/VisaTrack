const express = require('express');
const router = express.Router();
const {
    createEmbassy,
    getEmbassies,
    getEmbassyById,
    updateEmbassy,
    deleteEmbassy
} = require('../services/embassyService');

/**
 * @swagger
 * /embassies:
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
 * 
 * /embassies/{id}:
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
// Create embassy
router.post('/', async (req, res) => {
    try {
        const embassy = await createEmbassy(req.body);
        res.status(201).json(embassy);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all embassies (with optional filters)
router.get('/', async (req, res) => {
    try {
        const embassies = await getEmbassies(req.query);
        res.json(embassies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single embassy
router.get('/:id', async (req, res) => {
    try {
        const embassy = await getEmbassyById(req.params.id);
        if (!embassy) return res.status(404).json({ message: 'Embassy not found' });
        res.json(embassy);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update embassy
router.put('/:id', async (req, res) => {
    try {
        const embassy = await updateEmbassy(req.params.id, req.body);
        if (!embassy) return res.status(404).json({ message: 'Embassy not found' });
        res.json(embassy);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete embassy
router.delete('/:id', async (req, res) => {
    try {
        const embassy = await deleteEmbassy(req.params.id);
        if (!embassy) return res.status(404).json({ message: 'Embassy not found' });
        res.json({ message: 'Embassy removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

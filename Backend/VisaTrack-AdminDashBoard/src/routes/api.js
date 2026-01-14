const express = require('express');
const router = express.Router();
const VisaService = require('../services/visaService');
const VisaRequirement = require('../models/VisaRequirement');

const visaService = new VisaService(VisaRequirement);

// Route to get all visa requirements
router.get('/visa-requirements', async (req, res) => {
	try {
		const visas = await visaService.getAllVisaRequirements();
		return res.json(visas);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
});

// Route to create a new visa requirement
router.post('/visa-requirements', async (req, res) => {
	try {
		const created = await visaService.createVisaRequirement(req.body);
		return res.status(201).json(created);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
});

// Route to update an existing visa requirement
router.put('/visa-requirements/:id', async (req, res) => {
	try {
		const updated = await visaService.updateVisaRequirement(req.params.id, req.body);
		return res.json(updated);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
});

// Route to delete a visa requirement
router.delete('/visa-requirements/:id', async (req, res) => {
	try {
		await visaService.deleteVisaRequirement(req.params.id);
		return res.status(204).end();
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
});

module.exports = router;
const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parse/sync');
const fs = require('fs');
const adminController = require('../controllers/adminController');
const visaController = require('../controllers/visaController');
const authMiddleware = require('../middlewares/auth');
const VisaService = require('../services/visaService');
const VisaRequirement = require('../models/VisaRequirement');

const visaService = new VisaService(VisaRequirement);

// Configure multer
const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            cb(null, true);
        } else {
            cb(new Error('Only CSV files are allowed'));
        }
    }
});

// Admin Dashboard
router.get('/dashboard', authMiddleware.isAuthenticated, adminController.renderDashboard);

// Visa Requirements Management
router.get('/visas', authMiddleware.isAuthenticated, visaController.listVisaRequirements.bind(visaController));
router.get('/visas/new', authMiddleware.isAuthenticated, visaController.renderVisaForm.bind(visaController));
router.post('/visas', authMiddleware.isAuthenticated, visaController.createVisaRequirement.bind(visaController));
router.get('/visas/:id/edit', authMiddleware.isAuthenticated, visaController.renderVisaForm.bind(visaController));
router.put('/visas/:id', authMiddleware.isAuthenticated, visaController.updateVisaRequirement.bind(visaController));
router.delete('/visas/:id', authMiddleware.isAuthenticated, visaController.deleteVisaRequirement.bind(visaController));

// CSV Upload
router.post('/visas/upload', authMiddleware.isAuthenticated, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            const visas = await visaService.getAllVisaRequirements();
            return res.status(400).render('admin/visas', {
                visas,
                adminName: req.user?.username || 'Admin',
                error: 'Please select a CSV file to upload.'
            });
        }

        const fileContent = fs.readFileSync(req.file.path, 'utf-8');
        const records = csv.parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });

        let successCount = 0;
        const errors = [];

        for (const record of records) {
            try {
                const visaData = {
                    country: record.country?.trim(),
                    visaType: record.visaType?.trim(),
                    requirements: record.requirements?.split(';').map(r => r.trim()).filter(r => r.length > 0),
                    processingTime: record.processingTime?.trim(),
                    fees: parseFloat(record.fees)
                };

                if (!visaData.country || !visaData.visaType || !visaData.requirements || !visaData.processingTime || isNaN(visaData.fees)) {
                    errors.push(`Row skipped: Missing required fields`);
                    continue;
                }

                await visaService.createVisaRequirement(visaData);
                successCount++;
            } catch (err) {
                errors.push(`Error: ${err.message}`);
            }
        }

        fs.unlinkSync(req.file.path);

        const visas = await visaService.getAllVisaRequirements();
        const successMsg = successCount > 0 
            ? `Successfully uploaded ${successCount} visa requirement(s).` 
            : 'No records were uploaded.';

        return res.render('admin/visas', {
            visas,
            adminName: req.user?.username || 'Admin',
            success: successMsg,
            uploadErrors: errors.length > 0 ? errors : null
        });
    } catch (error) {
        console.error('CSV upload error:', error);
        if (req.file) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (e) {}
        }

        const visas = await visaService.getAllVisaRequirements();
        return res.status(500).render('admin/visas', {
            visas,
            adminName: req.user?.username || 'Admin',
            error: `Upload failed: ${error.message}`
        });
    }
});

module.exports = router;
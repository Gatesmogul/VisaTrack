const multer = require('multer');
const csv = require('csv-parse');
const fs = require('fs');
const path = require('path');
const VisaService = require('../services/visaService');
const VisaRequirement = require('../models/VisaRequirement');

const visaService = new VisaService(VisaRequirement);

// Configure multer for file uploads
const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (['.csv', '.json'].includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Only CSV and JSON files are allowed'));
        }
    }
});

class VisaUploadController {
    async uploadFile(req, res) {
        try {
            if (!req.file) {
                return res.status(400).render('admin/visas', { 
                    visas: [],
                    adminName: req.user?.username || 'Admin',
                    error: 'Please select a file to upload'
                });
            }

            const file = req.file;
            const ext = path.extname(file.originalname).toLowerCase();
            let visasToAdd = [];

            if (ext === '.csv') {
                visasToAdd = await parseCSV(file.path);
            } else if (ext === '.json') {
                visasToAdd = JSON.parse(fs.readFileSync(file.path, 'utf-8'));
                if (!Array.isArray(visasToAdd)) {
                    throw new Error('JSON file must contain an array of visa requirements');
                }
            }

            // Validate and insert visa requirements
            for (const visa of visasToAdd) {
                if (!visa.country || !visa.visaType || !visa.requirements || !visa.processingTime || !visa.fees) {
                    throw new Error('Missing required fields: country, visaType, requirements, processingTime, fees');
                }
                if (typeof visa.requirements === 'string') {
                    visa.requirements = visa.requirements.split(',').map(r => r.trim());
                }
                await visaService.createVisaRequirement(visa);
            }

            fs.unlinkSync(file.path); // Delete temp file

            const visas = await visaService.getAllVisaRequirements();
            return res.render('admin/visas', { 
                visas,
                adminName: req.user?.username || 'Admin',
                success: `Successfully uploaded ${visasToAdd.length} visa requirements`
            });
        } catch (error) {
            if (req.file) fs.unlinkSync(req.file.path);
            const visas = await visaService.getAllVisaRequirements();
            return res.render('admin/visas', { 
                visas,
                adminName: req.user?.username || 'Admin',
                error: `Upload failed: ${error.message}`
            });
        }
    }
}

function parseCSV(filePath) {
    return new Promise((resolve, reject) => {
        const visas = [];
        fs.createReadStream(filePath)
            .pipe(csv.parse({ headers: true, skip_empty_lines: true }))
            .on('data', (row) => {
                visas.push({
                    country: row.country,
                    visaType: row.visaType,
                    requirements: row.requirements.split(',').map(r => r.trim()),
                    processingTime: row.processingTime,
                    fees: parseFloat(row.fees)
                });
            })
            .on('error', reject)
            .on('end', () => resolve(visas));
    });
}

module.exports = { VisaUploadController: new VisaUploadController(), upload };

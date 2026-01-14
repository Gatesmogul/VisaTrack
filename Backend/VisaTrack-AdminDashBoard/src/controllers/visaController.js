const VisaService = require('../services/visaService');
const VisaRequirement = require('../models/VisaRequirement');

class VisaController {
    constructor(visaService) {
        this.visaService = visaService;
    }

    async listVisaRequirements(req, res) {
        try {
            const visaRequirements = await this.visaService.getAllVisaRequirements();
            return res.render('admin/visas', { 
                visas: visaRequirements,
                adminName: req.user?.username || 'Admin',
                error: null
            });
        } catch (error) {
            console.error('List visas error:', error);
            return res.status(500).render('admin/visas', { 
                visas: [],
                adminName: req.user?.username || 'Admin',
                error: 'Failed to load visa requirements. Please refresh and try again.' 
            });
        }
    }

    async renderVisaForm(req, res) {
        try {
            const id = req.params.id;
            if (id) {
                const visa = await this.visaService.getVisaRequirementById(id);
                return res.render('admin/visa-form', { 
                    visa,
                    adminName: req.user?.username || 'Admin',
                    error: null
                });
            }
            return res.render('admin/visa-form', { 
                visa: null,
                adminName: req.user?.username || 'Admin',
                error: null
            });
        } catch (error) {
            console.error('Form render error:', error);
            return res.status(500).render('admin/visa-form', { 
                visa: null,
                adminName: req.user?.username || 'Admin',
                error: 'Failed to load form. Please try again.' 
            });
        }
    }

    async createVisaRequirement(req, res) {
        try {
            const visaData = req.body;
            
            // Parse requirements from comma-separated string to array
            if (typeof visaData.requirements === 'string') {
                visaData.requirements = visaData.requirements.split(',').map(r => r.trim()).filter(r => r.length > 0);
            }
            
            if (!visaData.requirements || visaData.requirements.length === 0) {
                const visas = await this.visaService.getAllVisaRequirements();
                return res.status(400).render('admin/visas', { 
                    visas,
                    adminName: req.user?.username || 'Admin',
                    error: 'Requirements field cannot be empty. Enter at least one requirement.' 
                });
            }
            
            await this.visaService.createVisaRequirement(visaData);
            return res.redirect('/admin/visas');
        } catch (error) {
            console.error('Create visa error:', error);
            const visas = await this.visaService.getAllVisaRequirements();
            return res.status(500).render('admin/visas', { 
                visas,
                adminName: req.user?.username || 'Admin',
                error: `Failed to create visa: ${error.message}` 
            });
        }
    }

    async updateVisaRequirement(req, res) {
        try {
            const visaId = req.params.id;
            const visaData = req.body;
            
            // Parse requirements from comma-separated string to array
            if (typeof visaData.requirements === 'string') {
                visaData.requirements = visaData.requirements.split(',').map(r => r.trim()).filter(r => r.length > 0);
            }
            
            await this.visaService.updateVisaRequirement(visaId, visaData);
            return res.redirect('/admin/visas');
        } catch (error) {
            console.error('Update visa error:', error);
            const visas = await this.visaService.getAllVisaRequirements();
            return res.status(500).render('admin/visas', { 
                visas,
                adminName: req.user?.username || 'Admin',
                error: `Failed to update visa: ${error.message}` 
            });
        }
    }

    async deleteVisaRequirement(req, res) {
        try {
            const visaId = req.params.id;
            await this.visaService.deleteVisaRequirement(visaId);
            return res.redirect('/admin/visas');
        } catch (error) {
            return res.status(500).send('Error deleting visa requirement');
        }
    }
}

const visaService = new VisaService(VisaRequirement);
module.exports = new VisaController(visaService);
const VisaApplicationDocument = require('../models/VisaApplicationDocument');
const VisaRequiredDocument = require('../models/VisaRequiredDocument');
const VisaApplication = require('../models/VisaApplication');
const cloudinary = require('../config/cloudinaryConfig');

/**
 * Service to handle document-related logic
 */

/**
 * Checks if all mandatory documents for a visa application are uploaded.
 * @param {String} visaApplicationId - The ID of the visa application
 * @returns {Promise<Object>} Completeness status and list of missing mandatory documents
 */
const checkDocumentCompleteness = async (visaApplicationId) => {
    try {
        const application = await VisaApplication.findById(visaApplicationId);
        if (!application) throw new Error('Application not found');

        // 1. Get all mandatory documents for the requirement
        const mandatoryDocs = await VisaRequiredDocument.find({
            visaRequirementId: application.visaRequirementId,
            mandatory: true
        });

        // 2. Get all uploaded documents for this application
        const uploadedDocs = await VisaApplicationDocument.find({
            visaApplicationId: visaApplicationId,
            uploaded: true
        });

        const uploadedTypes = uploadedDocs.map(d => d.documentType);
        const missingDocs = mandatoryDocs.filter(d => !uploadedTypes.includes(d.documentType));

        const isComplete = missingDocs.length === 0;

        // Auto-update status if documents are complete and status was NOT_STARTED
        if (isComplete && application.status === 'NOT_STARTED') {
            application.status = 'DOCUMENTS_IN_PROGRESS';
            await application.save();
        }

        return {
            isComplete,
            totalMandatory: mandatoryDocs.length,
            uploadedCount: uploadedDocs.length,
            missingMandatory: missingDocs.map(d => d.documentType)
        };
    } catch (error) {
        console.error('Error checking completeness:', error);
        throw error;
    }
};

/**
 * Uploads a document to Cloudinary and updates the VisaApplicationDocument record
 * @param {String} visaApplicationId 
 * @param {String} documentType 
 * @param {Buffer|String} fileSource - Path to file or buffer
 */
const uploadDocument = async (visaApplicationId, documentType, fileSource) => {
    try {
        const result = await cloudinary.uploader.upload(fileSource, {
            folder: 'visa_track_docs',
            resource_type: 'auto'
        });

        // Find existing record or create new
        let docRecord = await VisaApplicationDocument.findOne({
            visaApplicationId,
            documentType
        });

        if (docRecord) {
            // Delete old one if exists
            if (docRecord.cloudinaryId) {
                await cloudinary.uploader.destroy(docRecord.cloudinaryId);
            }
            docRecord.fileUrl = result.secure_url;
            docRecord.cloudinaryId = result.public_id;
            docRecord.uploaded = true;
        } else {
            docRecord = new VisaApplicationDocument({
                visaApplicationId,
                documentType,
                fileUrl: result.secure_url,
                cloudinaryId: result.public_id,
                uploaded: true
            });
        }

        await docRecord.save();
        
        // Triggers completeness check
        await checkDocumentCompleteness(visaApplicationId);

        return docRecord;
    } catch (error) {
        console.error('Error uploading document:', error);
        throw error;
    }
};

module.exports = {
    checkDocumentCompleteness,
    uploadDocument
};

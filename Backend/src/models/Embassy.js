import mongoose from "mongoose";

const embassySchema = new mongoose.Schema({
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    },
    locatedInCountry: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    },
    city: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    contactInfo: {
        phone: String,
        email: String,
        website: String
    },
    services: [{
        type: String,
        enum: ['VISA_APPLICATION', 'PASSPORT_RENEWAL', 'NOTARY', 'EMERGENCY_ASSISTANCE']
    }],
    operatingHours: {
        type: String
    },
    notes: String
}, {
    timestamps: true
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Embassy:
 *       type: object
 *       required:
 *         - city
 *         - address
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the embassy
 *         country:
 *           type: string
 *           description: Country ID represented by the embassy
 *         locatedInCountry:
 *           type: string
 *           description: Country ID where the embassy is located
 *         city:
 *           type: string
 *         address:
 *           type: string
 *         contactInfo:
 *           type: object
 *           properties:
 *             phone:
 *               type: string
 *             email:
 *               type: string
 *             website:
 *               type: string
 *         services:
 *           type: array
 *           items:
 *             type: string
 *       example:
 *         city: New York
 *         address: 123 Embassy Row
 *         services: [VISA_APPLICATION]
 */
export default mongoose.model('Embassy', embassySchema);
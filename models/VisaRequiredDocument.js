const mongoose = require('mongoose');

const visaRequiredDocumentSchema = new mongoose.Schema({
    visaRequirementId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VisaRequirement',
        required: true
    },
    documentType: {
        type: String,
        enum: ['PASSPORT', 'PHOTO', 'FLIGHT_RESERVATION', 'HOTEL_BOOKING', 'BANK_STATEMENT', 'INVITATION_LETTER', 'TRAVEL_INSURANCE', 'EMPLOYMENT_LETTER', 'STUDENT_LETTER', 'OTHER'],
        required: true
    },
    description: {
        type: String
    },
    mandatory: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('VisaRequiredDocument', visaRequiredDocumentSchema);

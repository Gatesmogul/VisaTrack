const mongoose = require('mongoose');

const visaApplicationDocumentSchema = new mongoose.Schema({
    visaApplicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VisaApplication',
        required: true
    },
    documentType: {
        type: String,
        enum: ['PASSPORT', 'PHOTO', 'FLIGHT_RESERVATION', 'HOTEL_BOOKING', 'BANK_STATEMENT', 'INVITATION_LETTER', 'TRAVEL_INSURANCE', 'EMPLOYMENT_LETTER', 'STUDENT_LETTER', 'OTHER'],
        required: true
    },
    uploaded: {
        type: Boolean,
        default: false
    },
    fileUrl: {
        type: String
    },
    cloudinaryId: {
        type: String
    },
    verified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('VisaApplicationDocument', visaApplicationDocumentSchema);

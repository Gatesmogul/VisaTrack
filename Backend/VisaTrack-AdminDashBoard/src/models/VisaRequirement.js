const mongoose = require('mongoose');

const visaRequirementSchema = new mongoose.Schema({
    country: {
        type: String,
        required: true,
    },
    visaType: {
        type: String,
        required: true,
    },
    requirements: {
        type: [String],
        required: true,
    },
    processingTime: {
        type: String,
        required: true,
    },
    fees: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const VisaRequirement = mongoose.model('VisaRequirement', visaRequirementSchema);

module.exports = VisaRequirement;
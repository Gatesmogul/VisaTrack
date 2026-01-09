const mongoose = require('mongoose');

const visaRequirementSchema = new mongoose.Schema({
    passportCountry: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    },
    destinationCountry: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    },
    travelPurpose: {
        type: String,
        enum: ['TOURISM', 'BUSINESS', 'TRANSIT', 'STUDY', 'WORK', 'DIPLOMATIC'],
        required: true
    },
    visaType: {
        type: String,
        enum: ['VISA_FREE', 'E_VISA', 'VISA_ON_ARRIVAL', 'EMBASSY_VISA', 'TRANSIT_VISA'],
        required: true
    },
    visaFreeDays: {
        type: Number
    },
    feeStructure: [{
        description: String,
        amount: Number,
        currency: String,
        mandatory: {
            type: Boolean,
            default: true
        }
    }],
    currency: {
        type: String
    },
    processingTimeMin: {
        type: Number
    },
    processingTimeMax: {
        type: Number
    },
    validityPeriodDays: {
        type: Number
    },
    allowedStayDays: {
        type: Number
    },
    applicationMethod: {
        type: String,
        enum: ['ONLINE', 'EMBASSY', 'VISA_ON_ARRIVAL', 'CONSULATE', 'NONE'],
        required: true
    },
    applicationUrl: {
        type: String
    },
    notes: {
        type: String
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('VisaRequirement', visaRequirementSchema);

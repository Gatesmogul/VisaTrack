const mongoose = require('mongoose');

const tripDestinationSchema = new mongoose.Schema({
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true
    },
    countryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    },
    entryDate: {
        type: Date,
        required: true
    },
    exitDate: {
        type: Date,
        required: true
    },
    travelPurpose: {
        type: String,
        enum: ['TOURISM', 'BUSINESS', 'TRANSIT', 'STUDY', 'WORK', 'DIPLOMATIC'],
        required: true
    },
    visaRequired: {
        type: Boolean
    },
    visaType: {
        type: String
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('TripDestination', tripDestinationSchema);

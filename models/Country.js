const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isoCode: {
        type: String,
        required: true,
        unique: true
    },
    region: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Country', countrySchema);

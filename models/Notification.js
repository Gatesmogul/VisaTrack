const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['DEADLINE_APPROACHING', 'DECISION_EXPECTED', 'STATUS_UPDATE', 'SYSTEM'],
        required: true
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId, // Can be VisaApplicationId
        refPath: 'relatedModel'
    },
    relatedModel: {
        type: String,
        enum: ['VisaApplication', 'Trip']
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);

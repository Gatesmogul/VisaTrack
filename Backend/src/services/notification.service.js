import Notification from "../models/Notification.js";
import VisaApplication from "../models/VisaApplication.js";

const checkApproachingDeadlines = async () => {
    const today = new Date();
    const alertThreshold = new Date();
    alertThreshold.setDate(today.getDate() + 5);

    try {
        const applications = await VisaApplication.find({
            status: { $in: ['NOT_STARTED', 'DOCUMENTS_IN_PROGRESS', 'APPOINTMENT_BOOKED'] },
            latestSubmissionDate: { 
                $lte: alertThreshold,
                $gt: today 
            }
        }).populate('userId');

        return applications;
    } catch (error) {
        console.error('Error checking deadlines:', error);
        return [];
    }
};

const sendNotification = async (application, type) => {
    try {
        const userId = application.userId._id || application.userId;
        if (!userId) return;

        let title = 'Visa Update';
        let message = '';

        switch (type) {
            case 'DEADLINE_APPROACHING':
                title = 'Upcoming Deadline';
                message = `Your latest submission date is approaching (${application.latestSubmissionDate.toDateString()}). Please finalize your documents.`;
                break;
            case 'DECISION_EXPECTED':
                title = 'Decision Expected Today';
                message = `Your visa decision is expected today. Check your application portal or embassy status.`;
                break;
            case 'STATUS_UPDATE':
                title = 'Application Status Updated';
                message = `Your application status has been updated to ${application.status}.`;
                break;
            default:
                message = `There is an update on your visa application.`;
        }

        const notification = new Notification({
            userId,
            title,
            message,
            type,
            relatedId: application._id,
            relatedModel: 'VisaApplication'
        });

        await notification.save();
        console.log(`[Notification Service] Notification persisted for user ${userId}: ${title}`);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};

const processAllNotifications = async () => {
    const approaching = await checkApproachingDeadlines();
    for (const app of approaching) {
        await sendNotification(app, 'DEADLINE_APPROACHING');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const decisionExpected = await VisaApplication.find({
        status: 'SUBMITTED',
        expectedDecisionDate: { $gte: today, $lt: tomorrow }
    });

    for (const app of decisionExpected) {
        await sendNotification(app, 'DECISION_EXPECTED');
    }
};

export {
    checkApproachingDeadlines,
    sendNotification,
    processAllNotifications
};

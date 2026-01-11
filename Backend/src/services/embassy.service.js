import Embassy from "../models/Embassy.js";

const createEmbassy = async (data) => {
    try {
        const embassy = new Embassy(data);
        return await embassy.save();
    } catch (error) {
        console.error('Error creating embassy:', error);
        throw error;
    }
};

const getEmbassies = async (filters = {}) => {
    try {
        return await Embassy.find(filters)
            .populate('country')
            .populate('locatedInCountry');
    } catch (error) {
        console.error('Error fetching embassies:', error);
        throw error;
    }
};

const getEmbassyById = async (id) => {
    try {
        return await Embassy.findById(id)
            .populate('country')
            .populate('locatedInCountry');
    } catch (error) {
        console.error('Error fetching embassy:', error);
        throw error;
    }
};

const updateEmbassy = async (id, data) => {
    try {
        return await Embassy.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
        console.error('Error updating embassy:', error);
        throw error;
    }
};

const deleteEmbassy = async (id) => {
    try {
        return await Embassy.findByIdAndDelete(id);
    } catch (error) {
        console.error('Error deleting embassy:', error);
        throw error;
    }
};

export {
    createEmbassy,
    getEmbassies,
    getEmbassyById,
    updateEmbassy,
    deleteEmbassy
};
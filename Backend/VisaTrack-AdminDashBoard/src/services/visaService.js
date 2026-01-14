class VisaService {
    constructor(VisaRequirement) {
        this.VisaRequirement = VisaRequirement;
    }

    async getAllVisaRequirements() {
        try {
            return await this.VisaRequirement.find({});
        } catch (error) {
            throw new Error('Error fetching visa requirements: ' + error.message);
        }
    }

    async getVisaRequirementById(id) {
        try {
            return await this.VisaRequirement.findById(id);
        } catch (error) {
            throw new Error('Error fetching visa requirement: ' + error.message);
        }
    }

    async createVisaRequirement(data) {
        try {
            const visaRequirement = new this.VisaRequirement(data);
            return await visaRequirement.save();
        } catch (error) {
            throw new Error('Error creating visa requirement: ' + error.message);
        }
    }

    async updateVisaRequirement(id, data) {
        try {
            return await this.VisaRequirement.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            throw new Error('Error updating visa requirement: ' + error.message);
        }
    }

    async deleteVisaRequirement(id) {
        try {
            return await this.VisaRequirement.findByIdAndDelete(id);
        } catch (error) {
            throw new Error('Error deleting visa requirement: ' + error.message);
        }
    }
}

module.exports = VisaService;
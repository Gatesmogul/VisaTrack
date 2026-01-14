import VisaApplicationDocument from "../models/VisaApplicationDocument.js";
import VisaRequiredDocument from "../models/VisaRequiredDocument.js";
import VisaApplication from "../models/VisaApplication.js";
import cloudinary from "../config/cloudinaryConfig.js";

const checkDocumentCompleteness = async (visaApplicationId) => {
  const application = await VisaApplication.findById(visaApplicationId);
  if (!application) throw new Error("Application not found");

  const mandatoryDocs = await VisaRequiredDocument.find({
    visaRequirementId: application.visaRequirementId,
    mandatory: true
  });

  const uploadedDocs = await VisaApplicationDocument.find({
    visaApplicationId,
    uploaded: true
  });

  const uploadedTypes = uploadedDocs.map(d => d.documentType);
  const missingDocs = mandatoryDocs.filter(
    d => !uploadedTypes.includes(d.documentType)
  );

  if (missingDocs.length === 0 && application.status === "NOT_STARTED") {
    application.status = "DOCUMENTS_IN_PROGRESS";
    await application.save();
  }

  return {
    isComplete: missingDocs.length === 0,
    totalMandatory: mandatoryDocs.length,
    uploadedCount: uploadedDocs.length,
    missingMandatory: missingDocs.map(d => d.documentType)
  };
};

const uploadDocument = async (visaApplicationId, documentType, fileSource) => {
  const result = await cloudinary.uploader.upload(fileSource, {
    folder: "visa_track_docs",
    resource_type: "auto"
  });

  let doc = await VisaApplicationDocument.findOne({
    visaApplicationId,
    documentType
  });

  if (!doc) {
    doc = new VisaApplicationDocument({
      visaApplicationId,
      documentType
    });
  }

  doc.fileUrl = result.secure_url;
  doc.cloudinaryId = result.public_id;
  doc.uploaded = true;

  await doc.save();
  await checkDocumentCompleteness(visaApplicationId);

  return doc;
};

export {
  checkDocumentCompleteness,
  uploadDocument
};

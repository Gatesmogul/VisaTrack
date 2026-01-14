import { uploadDocument } from "../services/document.service.js";

export async function uploadVisaDocument(req, res) {
  const { documentType } = req.body;
  const filePath = req.file.path;

  const doc = await uploadDocument(
    req.params.id,
    documentType,
    filePath
  );

  res.json(doc);
}

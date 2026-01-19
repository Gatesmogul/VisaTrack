const STORAGE_KEY = 'visa_documents';

export function getDocuments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveDocument({ name, type, dataUrl, tags = [] }) {
  const docs = getDocuments();
  const doc = { id: Date.now().toString(), name, type, dataUrl, tags, createdAt: new Date().toISOString() };
  docs.push(doc);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  return doc;
}

export function removeDocument(id) {
  const docs = getDocuments();
  const filtered = docs.filter(d => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

export function findDocument(id) {
  return getDocuments().find(d => d.id === id) || null;
}

export default { getDocuments, saveDocument, removeDocument, findDocument };

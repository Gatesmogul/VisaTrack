const STORAGE_KEY = 'visa_applications_history';

export function getHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveApplication(app) {
  const h = getHistory();
  const entry = { id: Date.now().toString(), createdAt: new Date().toISOString(), notes: '', documents: [], ...app };
  h.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(h));
  return entry;
}

export function updateApplication(id, patch) {
  const h = getHistory();
  const updated = h.map(a => (a.id === id ? { ...a, ...patch } : a));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated.find(a => a.id === id);
}

export function removeApplication(id) {
  const h = getHistory();
  const filtered = h.filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

export default { getHistory, saveApplication, updateApplication, removeApplication };

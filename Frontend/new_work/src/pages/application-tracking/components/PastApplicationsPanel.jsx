import React, { useEffect, useState } from 'react';
import Button from '../../../components/ui/Button';
import { getHistory, removeApplication, updateApplication } from '../../../utils/appHistory';
import { getDocuments, findDocument } from '../../../utils/documents';
import Icon from '../../../components/AppIcon';

const PastApplicationsPanel = () => {
  const [history, setHistory] = useState([]);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    setHistory(getHistory());
    setDocuments(getDocuments());
  }, []);

  const handleRemove = (id) => {
    removeApplication(id);
    setHistory(getHistory());
  };

  const handleAddNote = (id) => {
    const note = prompt('Add a note for this application');
    if (!note) return;
    updateApplication(id, { notes: note });
    setHistory(getHistory());
  };

  const handleAttachDoc = (appId) => {
    const docId = prompt('Enter document id to attach (copy from Documents library)');
    if (!docId) return;
    const doc = findDocument(docId);
    if (!doc) { alert('Document not found'); return; }
    const app = history.find(h => h.id === appId);
    const docs = Array.from(new Set([...(app.documents || []), doc.id]));
    updateApplication(appId, { documents: docs });
    setHistory(getHistory());
  };

  if (!history || history.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-elevation-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-heading font-semibold text-foreground">Past Applications</h3>
      </div>
      <div className="space-y-3">
        {history.map((h) => (
          <div key={h.id} className="p-3 border rounded">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium">{h.destination} — {h.visaType || h.title}</div>
                <div className="text-sm text-muted-foreground">{new Date(h.createdAt).toLocaleDateString()}</div>
                {h.notes && <div className="text-sm mt-1">Note: {h.notes}</div>}
                {h.documents && h.documents.length > 0 && (
                  <div className="text-xs mt-2 text-muted-foreground">Documents: {h.documents.join(', ')}</div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" onClick={() => handleAddNote(h.id)}>Add note</Button>
                <Button variant="outline" size="sm" onClick={() => handleAttachDoc(h.id)}>Attach doc</Button>
                <Button variant="destructive" size="sm" onClick={() => handleRemove(h.id)}>Remove</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PastApplicationsPanel;
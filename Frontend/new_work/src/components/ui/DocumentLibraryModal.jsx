import React, { useEffect, useState } from 'react';
import Button from './Button';
import { getDocuments, saveDocument, removeDocument } from '../../utils/documents';

const DocumentLibraryModal = ({ isOpen, onClose, onSelect }) => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    setDocs(getDocuments());
  }, [isOpen]);

  const handleUpload = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      const saved = saveDocument({ name: f.name, type: f.type, dataUrl });
      setDocs(getDocuments());
      if (onSelect) onSelect(saved);
    };
    reader.readAsDataURL(f);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-500 flex items-start justify-center bg-black/40 pt-16">
      <div className="w-full max-w-2xl bg-card border border-border rounded-lg shadow-elevation-12 overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-medium">Document Library</h3>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer">
              <input type="file" onChange={handleUpload} className="hidden" />
              <Button variant="outline" size="sm">Upload</Button>
            </label>
            <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
          </div>
        </div>

        <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
          {docs.length === 0 && <div className="text-sm text-muted-foreground">No documents yet. Upload to reuse across applications.</div>}
          {docs.map((d) => (
            <div key={d.id} className="p-2 border rounded flex items-center justify-between gap-3">
              <div>
                <div className="font-medium">{d.name}</div>
                <div className="text-xs text-muted-foreground">{d.type} • {new Date(d.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => { if (onSelect) onSelect(d); }}>Attach</Button>
                <Button size="sm" variant="destructive" onClick={() => { removeDocument(d.id); setDocs(getDocuments()); }}>Delete</Button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border flex items-center justify-end">
          <Button onClick={onClose}>Done</Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentLibraryModal;
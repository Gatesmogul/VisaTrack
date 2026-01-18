import React, { useState, useEffect } from 'react';
import Button from './Button';
import Input from './Input';
import Icon from '../AppIcon';
import ConfirmModal from './ConfirmModal';

const emptyPassport = () => ({ id: Date.now().toString(36), country: '', number: '', expiry: '' });

const PassportsModal = ({ isOpen, onClose, passports = [], onSave }) => {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyPassport());
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  useEffect(() => {
    setItems((passports || []).map((p) => ({ ...p })));
  }, [passports]);

  useEffect(() => {
    if (!isOpen) {
      setEditingId(null);
      setForm(emptyPassport());
      setDeleteTarget(null);
      setShowDeleteConfirm(false);
      setDraggedId(null);
      setDragOverId(null);
    }
  }, [isOpen]);

  const startAdd = () => {
    setEditingId(null);
    setForm(emptyPassport());
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({ ...p });
  };

  const saveItem = () => {
    if (!form.country?.trim() || !form.number?.trim() || !form.expiry) return;
    setItems((prev) => {
      const exists = prev.find((x) => x.id === form.id);
      if (exists) {
        return prev.map((x) => (x.id === form.id ? { ...form } : x));
      }
      return [...prev, { ...form }];
    });
    setEditingId(null);
    setForm(emptyPassport());
  };

  const confirmRemove = (id) => {
    setDeleteTarget(id);
    setShowDeleteConfirm(true);
  };

  const performRemove = () => {
    if (!deleteTarget) return;
    setItems((prev) => prev.filter((p) => p.id !== deleteTarget));
    setDeleteTarget(null);
    setShowDeleteConfirm(false);
  };

  const setPrimary = (id) => {
    setItems((prev) => prev.map((p) => ({ ...p, primary: p.id === id })));
  };

  // Drag & drop handlers (simple HTML5)
  const onDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    try { e.dataTransfer.setData('text/plain', id); } catch (err) {}
  };

  const onDragOver = (e, id) => {
    e.preventDefault();
    setDragOverId(id);
  };

  const onDrop = (e, id) => {
    e.preventDefault();
    const fromId = draggedId || (e.dataTransfer && e.dataTransfer.getData && e.dataTransfer.getData('text/plain'));
    const toId = id;
    if (!fromId || !toId || fromId === toId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }
    setItems((prev) => {
      const next = [...prev];
      const fromIndex = next.findIndex((p) => p.id === fromId);
      const toIndex = next.findIndex((p) => p.id === toId);
      if (fromIndex < 0 || toIndex < 0) return prev;
      const [removed] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, removed);
      return next;
    });
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleSaveAll = () => {
    // ensure only one primary
    const primaryExists = items.some((p) => p.primary);
    if (!primaryExists && items[0]) {
      items[0].primary = true;
    }
    onSave(items);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-300 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl bg-card border border-border rounded-lg shadow-elevation-8 p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-medium">Manage Passports</h3>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="p-2 rounded hover:bg-muted">
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-sm text-muted-foreground">No passports added yet. Click “Add passport” to begin.</div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.map((p) => (
                <div
                  key={p.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, p.id)}
                  onDragOver={(e) => onDragOver(e, p.id)}
                  onDrop={(e) => onDrop(e, p.id)}
                  className={`flex items-center justify-between gap-4 p-3 rounded border border-border ${p.primary ? 'bg-primary/5' : ''} ${dragOverId === p.id ? 'ring-2 ring-primary/30' : ''}`}
                >
                  <div>
                    <div className="font-medium">{p.country || '—'}</div>
                    <div className="text-sm text-muted-foreground">{p.number} • {p.expiry}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!p.primary && (
                      <button onClick={() => setPrimary(p.id)} className="text-sm text-primary hover:underline">Set primary</button>
                    )}
                    {p.primary && <span className="text-xs text-primary-foreground bg-primary/10 px-2 py-1 rounded">Primary</span>}
                    <button aria-label="Edit passport" onClick={() => startEdit(p)} className="p-2 hover:bg-muted rounded"><Icon name="Edit" size={16} /></button>
                    <button aria-label="Delete passport" onClick={() => confirmRemove(p.id)} className="p-2 hover:bg-muted text-error rounded"><Icon name="Trash" size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">{editingId ? 'Edit passport' : 'Add passport'}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input label="Country" value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} />
              <Input label="Passport Number" value={form.number} onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))} />
              <div>
                <label className="block text-sm font-medium mb-2">Expiry date</label>
                <input type="date" value={form.expiry} onChange={(e) => setForm((f) => ({ ...f, expiry: e.target.value }))} className="w-full border border-input rounded-lg px-3 py-2" />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button onClick={saveItem}>{editingId ? 'Save changes' : 'Add passport'}</Button>
              <Button variant="outline" onClick={() => { setForm(emptyPassport()); setEditingId(null); }}>Reset</Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSaveAll}>Save passports</Button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete passport"
        description="This will remove the selected passport from your profile. This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        danger
        onCancel={() => { setShowDeleteConfirm(false); setDeleteTarget(null); }}
        onConfirm={() => performRemove()}
      />
    </div>
  );
};

export default PassportsModal;

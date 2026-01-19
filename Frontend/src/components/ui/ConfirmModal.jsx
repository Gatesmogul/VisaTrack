import React, { useState, useEffect } from 'react';
import Button from './Button';
import Icon from '../AppIcon';

const ConfirmModal = ({ isOpen, title = 'Confirm', description = '', confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel, danger = false }) => {
  const [ack, setAck] = useState(false);

  useEffect(() => {
    if (!isOpen) setAck(false);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md bg-popover border border-border rounded-lg shadow-elevation-10 overflow-hidden">
        <div className="p-4 border-b border-border flex items-start gap-3">
          <div className="p-2 rounded-md bg-accent/5">
            <Icon name="AlertTriangle" size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-foreground">{title}</h3>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
        </div>
        <div className="p-4">
          <label className="flex items-start gap-3">
            <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} className="mt-1" />
            <div>
              <div className="text-sm font-medium">I understand</div>
              <div className="text-xs text-muted-foreground">This action cannot be undone and will remove your profile locally.</div>
            </div>
          </label>
        </div>
        <div className="p-4 border-t border-border flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>{cancelLabel}</Button>
          <Button variant={danger ? 'destructive' : 'danger'} disabled={!ack} onClick={() => { if (ack) onConfirm(); }}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
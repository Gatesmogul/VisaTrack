import React, { useRef, useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import { uploadFile } from '../../utils/mockUpload';

const FileUploader = ({ onUploadComplete, onUploadError, accept = '*', multiple = true, acceptTypes = ['pdf','jpg','jpeg','png'], maxSizeMB = 10 }) => {
  const fileInputRef = useRef(null);
  const [uploads, setUploads] = useState([]); // { id, name, progress, status }
  const [error, setError] = useState('');

  const validateFile = (file) => {
    const ext = (file?.name?.split('.')?.pop() || '').toLowerCase();
    if (!acceptTypes.includes(ext)) {
      return `Invalid file type. Allowed: ${acceptTypes.join(', ')}`;
    }
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      return `File too large. Max size is ${maxSizeMB} MB`;
    }
    return null;
  };

  const handleFiles = (files) => {
    const fileList = Array.from(files || []);
    fileList.forEach(async (file) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        onUploadError && onUploadError({ file, error: validationError });
        return;
      }

      const id = `${file.name}-${Date.now()}`;
      setUploads((prev) => [...prev, { id, name: file.name, progress: 0, status: 'uploading' }]);
      const onProgress = (p) => {
        setUploads((prev) => prev.map(u => u.id === id ? { ...u, progress: p } : u));
      };
      try {
        const res = await uploadFile(file, onProgress);
        setUploads((prev) => prev.map(u => u.id === id ? { ...u, progress: 100, status: 'done' } : u));
        onUploadComplete && onUploadComplete(res);
      } catch (err) {
        setUploads((prev) => prev.map(u => u.id === id ? { ...u, status: 'error' } : u));
        setError('Upload failed. Please try again.');
        onUploadError && onUploadError({ file, error: err });
      }
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };

  const handleSelect = (e) => handleFiles(e.target.files);

  return (
    <div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-dashed border-2 border-border rounded-lg p-4 text-center bg-card"
      >
        <div className="flex flex-col items-center gap-3">
          <Icon name="Upload" size={28} className="text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Drag & drop files here, or</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              Browse files
            </Button>
            <input ref={fileInputRef} type="file" accept={accept} multiple={multiple} onChange={handleSelect} className="hidden" />
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-3 p-3 bg-error/10 border border-error/20 rounded-lg flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Icon name="AlertCircle" size={18} color="var(--color-error)" className="flex-shrink-0 mt-0.5" />
            <p className="text-sm text-error">{error}</p>
          </div>
          <button onClick={() => setError('')} className="text-sm text-muted-foreground hover:underline">Dismiss</button>
        </div>
      )}

      <div className="mt-3 space-y-2">
        {uploads?.map((u) => (
          <div key={u.id} className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{u.name}</p>
              <div className="w-full bg-muted rounded-full h-2 mt-1">
                <div className="h-2 rounded-full bg-primary transition-smooth" style={{ width: `${u.progress}%` }} />
              </div>
            </div>
            <div className="w-20 text-right text-sm text-muted-foreground">
              {u.status === 'uploading' ? `${u.progress}%` : u.status === 'error' ? 'Failed' : 'Done'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUploader;

import apiClient from './client';

export const uploadDocument = (applicationId, file, documentType) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('documentType', documentType);

  return apiClient.post(`/visa-applications/${applicationId}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export default {
  uploadDocument,
};

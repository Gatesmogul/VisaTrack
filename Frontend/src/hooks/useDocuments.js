import documentApi from '../api/document.api';
import useApi from '../api/useApi';

export const useDocuments = () => {
  const upload = useApi(documentApi.uploadDocument);

  return {
    upload,
  };
};

export default useDocuments;

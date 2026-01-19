import embassyApi from '../api/embassy.api';
import useApi from '../api/useApi';

export const useEmbassies = () => {
  const get = useApi(embassyApi.getEmbassies);
  const getById = useApi(embassyApi.getEmbassyById);
  const create = useApi(embassyApi.createEmbassy);
  const update = useApi(embassyApi.updateEmbassy);
  const remove = useApi(embassyApi.deleteEmbassy);

  return {
    get,
    getById,
    create,
    update,
    remove,
  };
};

export default useEmbassies;

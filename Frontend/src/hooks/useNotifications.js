import notificationApi from '../api/notification.api';
import useApi from '../api/useApi';

export const useNotifications = () => {
  const get = useApi(notificationApi.getNotifications);
  const read = useApi(notificationApi.markAsRead);

  return {
    get,
    read,
  };
};

export default useNotifications;

import applicationsApi from '../api/applications.api';
import useApi from '../api/useApi';

export const useApplications = () => {
  const dashboard = useApi(applicationsApi.getApplicationDashboard);
  const create = useApi(applicationsApi.createApplication);
  const checklist = useApi(applicationsApi.getApplicationChecklist);
  const updateStatus = useApi(applicationsApi.updateApplicationStatus);

  return {
    dashboard,
    create,
    checklist,
    updateStatus,
  };
};

export default useApplications;

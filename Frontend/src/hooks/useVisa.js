import useApi from '../api/useApi';
import visaApi from '../api/visa.api';

export const useVisa = () => {
  const lookup = useApi(visaApi.lookupVisa);
  const details = useApi(visaApi.getVisaDetails);
  const recent = useApi(visaApi.getRecentLookups);
  const save = useApi(visaApi.saveRequirement);
  const saved = useApi(visaApi.getSavedRequirements);
  const removeSaved = useApi(visaApi.removeSavedRequirement);
  const timeline = useApi(visaApi.calculateTimeline);
  const plan = useApi(visaApi.planTrip);
  const feasibility = useApi(visaApi.getTripFeasibility);

  return {
    lookup,
    details,
    recent,
    save,
    saved,
    removeSaved,
    timeline,
    plan,
    feasibility,
  };
};

export default useVisa;

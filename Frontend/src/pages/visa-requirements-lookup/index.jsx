// DATA SOURCE: useVisa.lookup -> POST /api/v1/visa/lookup
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import TripContextSelector from '../../components/ui/TripContextSelector';
import useVisa from '../../hooks/useVisa';
import ApplicationActions from './components/ApplicationActions';
import BookingModal from './components/BookingModal';
import ComparisonMode from './components/ComparisonMode';
import PolicyUpdates from './components/PolicyUpdates';
import RequirementDetails from './components/RequirementDetails';
import SearchForm from './components/SearchForm';
import VisaStatusCard from './components/VisaStatusCard';

const VisaRequirementsLookup = () => {
  const [searchResults, setSearchResults] = useState(null);
  const { lookup } = useVisa();
  const { loading: isLoading, request: performVisaLookup } = lookup;
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparisonDestinations, setComparisonDestinations] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [pendingEmbassy, setPendingEmbassy] = useState(null);

  // Policy updates would ideally come from another endpoint, but for now we'll show empty or fetch recent
  const policyUpdates = []; 


  const handleSearch = async (searchParams) => {
    try {
      const { passportCountry, destination, purpose } = searchParams || {};
      const res = await performVisaLookup({
        passportCountry: passportCountry?.toUpperCase(),
        destinationCountry: destination?.toUpperCase(),
        purpose: purpose || 'TOURISM'
      });

      const data = res.data || res;
      
      // Build processing time strings
      const processingStrings = [];
      if (data.processingTime?.min && data.processingTime?.max) {
        processingStrings.push(`Standard: ${data.processingTime.min}-${data.processingTime.max} ${data.processingTime.unit || 'business days'}`);
      } else if (data.processingTime?.max) {
        processingStrings.push(`Standard: Up to ${data.processingTime.max} ${data.processingTime.unit || 'business days'}`);
      }

      // Build fees strings
      const feesStrings = [];
      if (data.fees?.visaCost) {
        feesStrings.push(`Visa Fee: ${data.fees.visaCost} ${data.fees.currency || 'USD'}`);
      }
      if (data.fees?.additionalFees?.length > 0) {
        data.fees.additionalFees.forEach(fee => {
          feesStrings.push(`${fee.name}: ${fee.amount} ${fee.currency || 'USD'}`);
        });
      }
      if (feesStrings.length === 0) {
        feesStrings.push('No visa fee required');
      }

      // Build documents list from API
      const documents = data.requiredDocuments || [];
      if (documents.length === 0) {
        // Fallback to pre-arrival requirements if no requiredDocuments
        if (data.preArrivalRequirements?.length > 0) {
          data.preArrivalRequirements.forEach(r => documents.push(r.name));
        }
        // Add standard documents if none specified
        if (documents.length === 0) {
          documents.push('Valid passport', 'Completed visa application (if applicable)');
        }
      }

      // Build restrictions list
      const restrictions = data.restrictions || [];
      if (data.warnings?.length > 0) {
        data.warnings.forEach(w => restrictions.push(w.message));
      }
      if (data.yellowFeverRequired === 'ALWAYS') {
        restrictions.push('Yellow fever vaccination certificate required');
      } else if (data.yellowFeverRequired === 'CONDITIONAL') {
        restrictions.push('Yellow fever certificate may be required (check conditions)');
      }
      if (data.passportValidityDays > 0) {
        restrictions.push(`Passport must be valid for ${data.passportValidityDays} days beyond travel date`);
      }
      if (data.blankPagesRequired > 0) {
        restrictions.push(`${data.blankPagesRequired} blank passport pages required`);
      }
      
      // Map Backend Data to UI Structure
      const result = {
        visaType: data.visaType?.toLowerCase() || 'embassy',
        status: data.visaType === 'VISA_FREE' ? 'not-required' : 'required',
        title: data.visaTypeFriendly || 'Visa Required',
        description: data.notes || `Visa requirements for ${data.destination?.name || destination}`,
        details: data.preArrivalRequirements?.map(r => r.name) || [],
        requirements: {
          documents: documents,
          processing: processingStrings,
          costs: feesStrings,
          restrictions: restrictions.length > 0 ? restrictions : ['No special restrictions']
        },
        processingTime: `${data.processingTime?.max || 'Varies'} ${data.processingTime?.unit || 'days'}`,
        cost: data.fees?.visaCost ? `${data.fees.visaCost} ${data.fees.currency}` : 'Varies',
        validity: data.allowedStayDays ? `${data.allowedStayDays} days` : 'Varies',
        icon: data.visaType === 'VISA_FREE' ? 'CheckCircle' : (data.visaType === 'E_VISA' || data.visaType === 'ETA' ? 'Globe' : 'Building'),
        color: data.visaType === 'VISA_FREE' ? 'success' : (data.visaType === 'VISA_ON_ARRIVAL' ? 'warning' : 'primary'),
        searchParams
      };

      setSearchResults(result);
    } catch (error) {
      console.error('Visa lookup failed', error);
      // Fallback or error state could be handled here
    }
  };

  const handleAddToComparison = () => {
    if (searchResults && !comparisonDestinations?.find(d => d?.name === getCountryName(searchResults?.searchParams?.destination))) {
      const newDest = {
        flag: getCountryFlag(searchResults?.searchParams?.destination),
        name: getCountryName(searchResults?.searchParams?.destination),
        visaType: searchResults?.visaType,
        processing: searchResults?.processingTime,
        cost: searchResults?.cost
      };
      setComparisonDestinations([...comparisonDestinations, newDest]);
      setComparisonMode(true);
    }
  };

  const handleRemoveFromComparison = (index) => {
    const updated = comparisonDestinations?.filter((_, i) => i !== index);
    setComparisonDestinations(updated);
    if (updated?.length === 0) {
      setComparisonMode(false);
    }
  };

  const getCountryName = (code) => {
    const names = {
      'us': 'United States',
      'uk': 'United Kingdom',
      'fr': 'France',
      'de': 'Germany',
      'it': 'Italy',
      'es': 'Spain',
      'jp': 'Japan',
      'cn': 'China',
      'au': 'Australia',
      'ca': 'Canada',
      'th': 'Thailand',
      'sg': 'Singapore',
      'ae': 'United Arab Emirates',
      'br': 'Brazil',
      'mx': 'Mexico',
      'in': 'India'
    };
    return names?.[code] || code?.toUpperCase();
  };

  const getCountryFlag = (code) => {
    const flags = {
      'us': '🇺🇸',
      'uk': '🇬🇧',
      'fr': '🇫🇷',
      'de': '🇩🇪',
      'it': '🇮🇹',
      'es': '🇪🇸',
      'jp': '🇯🇵',
      'cn': '🇨🇳',
      'au': '🇦🇺',
      'ca': '🇨🇦',
      'th': '🇹🇭',
      'sg': '🇸🇬',
      'ae': '🇦🇪',
      'br': '🇧🇷',
      'mx': '🇲🇽',
      'in': '🇮🇳'
    };
    return flags?.[code] || '🌍';
  };

  return (
    <>
      <Helmet>
        <title>Visa Requirements Lookup - VisaTrack</title>
        <meta name="description" content="Find instant visa requirements for your destination. Check visa-free entry, visa-on-arrival, eVisa, and embassy visa requirements with detailed processing information." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex flex-col lg:flex-row items-start gap-4 mb-6">
            <TripContextSelector />
            <div className="flex-1" />
            <Button
              variant="outline"
              iconName="GitCompare"
              iconPosition="left"
              onClick={() => setComparisonMode(!comparisonMode)}
            >
              {comparisonMode ? 'Hide' : 'Show'} Comparison
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <SearchForm onSearch={handleSearch} isLoading={isLoading} />

              {isLoading && (
                <div className="bg-card border border-border rounded-lg p-8 md:p-12 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-foreground font-medium">Searching visa requirements...</p>
                  <p className="text-sm text-muted-foreground mt-2">This may take a few seconds</p>
                </div>
              )}

              {!isLoading && searchResults && (
                <>
                  <VisaStatusCard
                    type={searchResults?.visaType}
                    title={searchResults?.title}
                    description={searchResults?.description}
                    details={searchResults?.details}
                    icon={searchResults?.icon}
                    color={searchResults?.color}
                  />

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      iconName="Plus"
                      iconPosition="left"
                      onClick={handleAddToComparison}
                      fullWidth
                      className="sm:flex-1"
                    >
                      Add to Comparison
                    </Button>
                    <Button
                      variant="outline"
                      iconName="Share2"
                      iconPosition="left"
                      fullWidth
                      className="sm:flex-1"
                    >
                      Share Results
                    </Button>
                    <Button
                      variant="outline"
                      iconName="Download"
                      iconPosition="left"
                      fullWidth
                      className="sm:flex-1"
                    >
                      Download PDF
                    </Button>
                  </div>

                  <RequirementDetails requirements={searchResults?.requirements} />

                  {comparisonMode && comparisonDestinations?.length > 0 && (
                    <ComparisonMode
                      destinations={comparisonDestinations}
                      onRemove={handleRemoveFromComparison}
                      onAddMore={() => {}}
                    />
                  )}
                </>
              )}

              {!isLoading && !searchResults && (
                <div className="bg-card border border-border rounded-lg p-8 md:p-12 text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Search" size={32} color="var(--color-primary)" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-foreground mb-2">Start Your Search</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Enter your passport country and destination to get instant visa requirements and detailed application guidance.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {searchResults && (
                <ApplicationActions
                  destination={getCountryName(searchResults?.searchParams?.destination)}
                  visaType={searchResults?.title}
                  appointmentRequired={searchResults?.appointmentRequired}
                  onBook={() => { setPendingEmbassy(searchResults?.embassyContact); setShowBookingModal(true); }}
                />
              )}

              <BookingModal
                isOpen={showBookingModal}
                onClose={() => { setShowBookingModal(false); setPendingEmbassy(null); }}
                destination={getCountryName(searchResults?.searchParams?.destination)}
                embassy={pendingEmbassy}
                onSaved={() => { /* placeholder - bookings persisted and scheduler runs */ }}
              />

              <PolicyUpdates updates={policyUpdates} />

              <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-elevation-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Icon name="HelpCircle" size={20} color="var(--color-accent)" />
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-foreground">Need Help?</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Our visa experts are available to answer your questions and provide personalized guidance.
                </p>
                <Button variant="outline" iconName="MessageCircle" iconPosition="left" fullWidth>
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default VisaRequirementsLookup;

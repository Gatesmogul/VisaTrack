import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import TripContextSelector from '../../components/ui/TripContextSelector';
import useEmbassies from '../../hooks/useEmbassies';
import ComparisonPanel from './components/ComparisonPanel';
import EmbassyList from './components/EmbassyList';
import MapView from './components/MapView';
import SearchFilters from './components/Searchfilters';

const EmbassyFinder = () => {
  const { get: getEmbassiesHook } = useEmbassies();
  const { loading: isLoading, data, error, request: fetchEmbassies } = getEmbassiesHook;
  
  const [filters, setFilters] = useState({
    country: 'all',
    serviceType: 'all',
    radius: '25',
    searchQuery: ''
  });

  const [userLocation, setUserLocation] = useState(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [selectedEmbassy, setSelectedEmbassy] = useState(null);
  const [comparisonList, setComparisonList] = useState([]);
  const [viewMode, setViewMode] = useState('split');

  const embassies = (data?.embassies || data || [])?.map(e => ({
    id: e._id,
    name: `${e.country?.name || 'Embassy'} in ${e.city}`,
    country: e.country?.name,
    city: e.city,
    address: e.address,
    phone: e.contactInfo?.phone || 'N/A',
    email: e.contactInfo?.email,
    website: e.contactInfo?.website,
    services: e.services || [],
    hours: e.operatingHours || 'Mon-Fri 9:00 AM - 5:00 PM',
    status: 'open', // Placeholder unless calculated
    flag: e.country?.flag || '🌍',
    lat: e.lat || 40.7128,
    lng: e.lng || -74.0060,
    distance: e.distance || Math.floor(Math.random() * 50),
    rating: 4.5,
    reviewCount: 120,
    verified: true,
    processingTime: '5-10 business days',
    paymentMethods: ['Credit Card', 'Cash']
  })) || [];

  const [filteredEmbassies, setFilteredEmbassies] = useState([]);

  useEffect(() => {
    fetchEmbassies(filters);
  }, [filters, fetchEmbassies]);

  useEffect(() => {
    setFilteredEmbassies(embassies);
  }, [data]);

  const filterEmbassies = () => {
    fetchEmbassies(filters);
  };

  const handleDetectLocation = () => {
    setIsDetectingLocation(true);
    setTimeout(() => {
      setUserLocation({ lat: 40.7128, lng: -74.0060 });
      setIsDetectingLocation(false);
    }, 1500);
  };

  const handleGetDirections = (embassy) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${embassy?.lat},${embassy?.lng}`;
    window.open(url, '_blank');
  };

  const handleAddToComparison = (embassy) => {
    if (comparisonList?.length < 3 && !comparisonList?.find((e) => e?.id === embassy?.id)) {
      setComparisonList([...comparisonList, embassy]);
    }
  };

  const handleRemoveFromComparison = (embassyId) => {
    setComparisonList(comparisonList?.filter((e) => e?.id !== embassyId));
  };

  return (
    <>
      <Helmet>
        <title>Embassy Finder - VisaTrack</title>
        <meta name="description" content="Find nearest visa processing offices with comprehensive contact information and service details" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 md:mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                Embassy Finder
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Locate nearest visa processing offices with complete service information
              </p>
            </div>
            <TripContextSelector />
          </div>

          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            <Button
              variant={viewMode === 'split' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('split')}
              iconName="LayoutGrid"
              iconPosition="left">

              Split View
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('map')}
              iconName="Map"
              iconPosition="left">

              Map Only
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              iconName="List"
              iconPosition="left">

              List Only
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            <div className="lg:col-span-3">
              <SearchFilters
                filters={filters}
                onFilterChange={setFilters}
                onDetectLocation={handleDetectLocation}
                isDetectingLocation={isDetectingLocation}
                onSearch={filterEmbassies} />

            </div>

            <div className="lg:col-span-9">
              {viewMode === 'split' &&
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  <div className="h-[400px] md:h-[600px]">
                    <MapView
                    embassies={filteredEmbassies}
                    selectedEmbassy={selectedEmbassy}
                    onEmbassySelect={setSelectedEmbassy}
                    userLocation={userLocation}
                    searchRadius={filters?.radius !== 'any' ? parseInt(filters?.radius) : null} />

                  </div>
                  <div className="h-[400px] md:h-[600px] overflow-y-auto">
                    <EmbassyList
                    embassies={filteredEmbassies}
                    selectedEmbassy={selectedEmbassy}
                    onEmbassySelect={setSelectedEmbassy}
                    onGetDirections={handleGetDirections}
                    isLoading={isLoading} />

                  </div>
                </div>
              }

              {viewMode === 'map' &&
              <div className="h-[600px] md:h-[700px]">
                  <MapView
                  embassies={filteredEmbassies}
                  selectedEmbassy={selectedEmbassy}
                  onEmbassySelect={setSelectedEmbassy}
                  userLocation={userLocation}
                  searchRadius={filters?.radius !== 'any' ? parseInt(filters?.radius) : null} />

                </div>
              }

              {viewMode === 'list' &&
              <EmbassyList
                embassies={filteredEmbassies}
                selectedEmbassy={selectedEmbassy}
                onEmbassySelect={setSelectedEmbassy}
                onGetDirections={handleGetDirections}
                isLoading={isLoading} />

              }

              {comparisonList?.length > 0 &&
              <div className="mt-6 md:mt-8">
                  <ComparisonPanel
                  embassies={comparisonList}
                  onRemove={handleRemoveFromComparison}
                  onClearAll={() => setComparisonList([])} />

                </div>
              }
            </div>
          </div>

          <div className="mt-8 md:mt-12 bg-accent/10 rounded-lg p-4 md:p-6">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={20} className="flex-shrink-0 mt-0.5 text-accent" />
              <div>
                <h3 className="font-heading font-semibold text-foreground mb-2">
                  Important Information
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Always verify embassy hours and appointment requirements before visiting</li>
                  <li>• Processing times are estimates and may vary based on application volume</li>
                  <li>• Some embassies require advance online appointment booking</li>
                  <li>• Bring all required documents and payment methods as specified</li>
                  <li>• Check embassy websites for holiday closures and special notices</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>);

};

export default EmbassyFinder;

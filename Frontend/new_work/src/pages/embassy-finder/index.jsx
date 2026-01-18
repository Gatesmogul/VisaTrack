import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import TripContextSelector from '../../components/ui/TripContextSelector';
import SearchFilters from './components/SearchFilters';
import MapView from './components/MapView';
import EmbassyList from './components/EmbassyList';
import ComparisonPanel from './components/ComparisonPanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const EmbassyFinder = () => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('split');

  const embassies = [
  {
    id: 1,
    name: "Embassy of the United States",
    country: "usa",
    address: "885 2nd Avenue, New York, NY 10017, United States",
    phone: "+1 212-415-4000",
    email: "newyork@usembassy.gov",
    website: "https://us.usembassy.gov",
    hours: "Mon-Fri: 9:00 AM - 5:00 PM",
    status: "open",
    lat: 40.7489,
    lng: -73.9680,
    distance: 2.3,
    flag: "https://images.unsplash.com/photo-1523057832542-7dc5b4854b36",
    flagAlt: "American flag waving against blue sky with stars and stripes clearly visible",
    services: ["Tourist Visa", "Business Visa", "Student Visa", "Work Visa", "Passport Services"],
    processingTime: "5-7 business days (normal), 2-3 days (expedited)",
    paymentMethods: ["Credit Card", "Debit Card", "Money Order"],
    appointmentRequired: true,
    rating: 4.5,
    reviewCount: 1247,
    verified: true
  },
  {
    id: 2,
    name: "British Consulate General",
    country: "uk",
    address: "845 3rd Avenue, New York, NY 10022, United States",
    phone: "+1 212-745-0200",
    email: "newyork@fco.gov.uk",
    website: "https://www.gov.uk/world/usa",
    hours: "Mon-Fri: 8:30 AM - 4:30 PM",
    status: "open",
    lat: 40.7614,
    lng: -73.9776,
    distance: 3.1,
    flag: "https://images.unsplash.com/photo-1433847566288-8b7e7fb16ef9",
    flagAlt: "Union Jack British flag with red white and blue colors displayed prominently",
    services: ["Tourist Visa", "Business Visa", "Student Visa", "Transit Visa"],
    processingTime: "3-5 business days (normal), 1-2 days (expedited)",
    paymentMethods: ["Credit Card", "Debit Card"],
    appointmentRequired: true,
    rating: 4.3,
    reviewCount: 892,
    verified: true
  },
  {
    id: 3,
    name: "Consulate General of Canada",
    country: "canada",
    address: "466 Lexington Avenue, New York, NY 10017, United States",
    phone: "+1 212-596-1628",
    email: "newyork@international.gc.ca",
    website: "https://www.canada.ca/en/immigration-refugees-citizenship.html",
    hours: "Mon-Fri: 9:00 AM - 12:00 PM, 1:00 PM - 4:00 PM",
    status: "closing-soon",
    lat: 40.7505,
    lng: -73.9764,
    distance: 2.8,
    flag: "https://images.unsplash.com/photo-1581465304683-f55a09acac8c",
    flagAlt: "Canadian flag with red maple leaf on white background between red vertical bands",
    services: ["Tourist Visa", "Business Visa", "Student Visa", "Work Visa", "Passport Services"],
    processingTime: "4-6 business days (normal), 2-3 days (expedited)",
    paymentMethods: ["Credit Card", "Debit Card", "Cash"],
    appointmentRequired: true,
    rating: 4.6,
    reviewCount: 1056,
    verified: true
  },
  {
    id: 4,
    name: "Consulate General of Germany",
    country: "germany",
    address: "871 United Nations Plaza, New York, NY 10017, United States",
    phone: "+1 212-610-9700",
    email: "info@new-york.diplo.de",
    website: "https://www.germany.info/us-en",
    hours: "Mon-Fri: 8:30 AM - 12:00 PM",
    status: "open",
    lat: 40.7489,
    lng: -73.9680,
    distance: 2.5,
    flag: "https://images.unsplash.com/photo-1676970121820-4219064a72af",
    flagAlt: "German flag with horizontal black red and gold stripes representing national colors",
    services: ["Tourist Visa", "Business Visa", "Student Visa", "Work Visa"],
    processingTime: "10-15 business days (normal), 5-7 days (expedited)",
    paymentMethods: ["Credit Card", "Cash"],
    appointmentRequired: true,
    rating: 4.2,
    reviewCount: 734,
    verified: true
  },
  {
    id: 5,
    name: "Consulate General of France",
    country: "france",
    address: "934 5th Avenue, New York, NY 10021, United States",
    phone: "+1 212-606-3600",
    email: "info@consulfrance-newyork.org",
    website: "https://newyork.consulfrance.org",
    hours: "Mon-Fri: 9:00 AM - 1:00 PM",
    status: "open",
    lat: 40.7736,
    lng: -73.9632,
    distance: 4.2,
    flag: "https://images.unsplash.com/photo-1675855508131-798d42b6f1ee",
    flagAlt: "French tricolor flag with vertical blue white and red stripes in equal proportions",
    services: ["Tourist Visa", "Business Visa", "Student Visa", "Transit Visa"],
    processingTime: "7-10 business days (normal), 3-5 days (expedited)",
    paymentMethods: ["Credit Card", "Debit Card"],
    appointmentRequired: true,
    rating: 4.4,
    reviewCount: 968,
    verified: true
  },
  {
    id: 6,
    name: "Consulate General of Japan",
    country: "japan",
    address: "299 Park Avenue, New York, NY 10171, United States",
    phone: "+1 212-371-8222",
    email: "ryoji@ny.mofa.go.jp",
    website: "https://www.ny.us.emb-japan.go.jp",
    hours: "Mon-Fri: 9:30 AM - 12:00 PM, 1:30 PM - 4:00 PM",
    status: "open",
    lat: 40.7580,
    lng: -73.9755,
    distance: 3.4,
    flag: "https://img.rocket.new/generatedImages/rocket_gen_img_1cbc8e9c0-1764746751204.png",
    flagAlt: "Japanese flag with red circle representing sun centered on white rectangular background",
    services: ["Tourist Visa", "Business Visa", "Student Visa", "Work Visa"],
    processingTime: "5-7 business days (normal), 2-3 days (expedited)",
    paymentMethods: ["Credit Card", "Money Order"],
    appointmentRequired: true,
    rating: 4.7,
    reviewCount: 1523,
    verified: true
  }];


  const [filteredEmbassies, setFilteredEmbassies] = useState(embassies);

  useEffect(() => {
    filterEmbassies();
  }, [filters]);

  const filterEmbassies = () => {
    setIsLoading(true);
    setTimeout(() => {
      let filtered = [...embassies];

      if (filters?.country !== 'all') {
        filtered = filtered?.filter((e) => e?.country === filters?.country);
      }

      if (filters?.serviceType !== 'all') {
        filtered = filtered?.filter((e) =>
        e?.services?.some((s) => s?.toLowerCase()?.includes(filters?.serviceType?.toLowerCase()))
        );
      }

      if (filters?.radius !== 'any') {
        const maxDistance = parseInt(filters?.radius);
        filtered = filtered?.filter((e) => e?.distance <= maxDistance);
      }

      setFilteredEmbassies(filtered);
      setIsLoading(false);
    }, 500);
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

import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import TripContextSelector from '../../components/ui/TripContextSelector';
import SearchForm from './components/SearchForm';
import VisaStatusCard from './components/VisaStatusCard';
import RequirementDetails from './components/RequirementDetails';
import ApplicationActions from './components/ApplicationActions';
import BookingModal from './components/BookingModal';
import { lookupVisaRequirement, getVisaTypeLabel } from '../../utils/visaRulesEngine';
import ComparisonMode from './components/ComparisonMode';
import PolicyUpdates from './components/PolicyUpdates';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const VisaRequirementsLookup = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparisonDestinations, setComparisonDestinations] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [pendingEmbassy, setPendingEmbassy] = useState(null);

  const mockVisaData = {
    'in-us': {
      visaType: 'embassy',
      status: 'required',
      title: 'Embassy Visa Required',
      description: 'You need to apply for a B1/B2 visa at the US Embassy or Consulate',
      details: [
        'Valid passport with at least 6 months validity',
        'Completed DS-160 form',
        'Visa application fee payment receipt',
        'Interview appointment confirmation',
        '2x2 inch photograph with white background'
      ],
      requirements: {
        documents: [
          'Valid passport with minimum 6 months validity beyond intended stay',
          'Completed DS-160 online application form',
          'One 2x2 inch color photograph taken within last 6 months',
          'Proof of financial ability to cover trip expenses',
          'Travel itinerary including flight bookings',
          'Hotel reservations or invitation letter from US host',
          'Employment verification letter or business registration',
          'Bank statements for last 6 months',
          'Previous travel history documentation',
          'Purpose of visit supporting documents'
        ],
        processing: [
          'Standard processing: 3-5 weeks after interview',
          'Expedited processing: Not available for tourist visas',
          'Interview wait time: 2-4 weeks (varies by location)',
          'Administrative processing: Additional 4-8 weeks if required',
          'Peak season delays: Add 2-3 weeks during summer months'
        ],
        costs: [
          'Visa application fee (MRV): $185 USD (non-refundable)',
          'SEVIS fee (if applicable): $350 USD',
          'Courier service for passport return: $15-25 USD',
          'Photo service at visa center: $10-15 USD',
          'Document translation (if needed): $50-100 USD per document'
        ],
        restrictions: [
          'Single entry valid for 10 years (multiple entries allowed)',
          'Maximum stay: 180 days per entry (determined by CBP officer)',
          'No work authorization included',
          'Must maintain ties to home country',
          'Cannot change status to immigrant visa while in US',
          'Overstaying can result in visa cancellation and future bans'
        ]
      },
      processingTime: '3-5 weeks',
      cost: '$185 USD',
      validity: '10 years',
      icon: 'Building',
      color: 'error'
    },
    'in-th': {
      visaType: 'visa-on-arrival',
      status: 'available',
      title: 'Visa on Arrival Available',
      description: 'You can obtain a visa upon arrival at Thai airports',
      details: [
        'Valid passport with 6 months validity',
        'Return flight ticket',
        'Proof of accommodation',
        'Passport-sized photograph',
        'Visa fee: 2,000 THB (approximately $60 USD)'
      ],
      requirements: {
        documents: [
          'Valid passport with minimum 6 months validity',
          'Confirmed return flight ticket within 15 days',
          'Proof of accommodation (hotel booking or invitation letter)',
          'One recent passport-sized photograph (4x6 cm)',
          'Completed visa on arrival application form',
          'Proof of sufficient funds (10,000 THB per person or 20,000 THB per family)',
          'Travel itinerary',
          'Contact information in Thailand'
        ],
        processing: [
          'On-arrival processing: 30-60 minutes at airport',
          'Available at major international airports only',
          'Processing counters open 24/7',
          'Queue times vary by flight arrival times',
          'Peak hours (morning): 1-2 hours wait time'
        ],
        costs: [
          'Visa on arrival fee: 2,000 THB (approximately $60 USD)',
          'Payment accepted: Thai Baht cash only',
          'Currency exchange available at airport',
          'No credit card payments accepted',
          'Fee is non-refundable regardless of approval'
        ],
        restrictions: [
          'Valid for 15 days only (non-extendable)',
          'Single entry only',
          'Cannot be converted to other visa types',
          'Must enter through designated airports',
          'No work or business activities permitted',
          'Overstaying fine: 500 THB per day'
        ]
      },
      processingTime: '30-60 minutes',
      cost: '2,000 THB',
      validity: '15 days',
      icon: 'Clock',
      color: 'warning'
    },
    'in-sg': {
      visaType: 'visa-free',
      status: 'not-required',
      title: 'Visa-Free Entry',
      description: 'Indian passport holders can enter Singapore without a visa for tourism',
      details: [
        'Valid passport with 6 months validity',
        'Return flight ticket',
        'Sufficient funds for stay',
        'Proof of accommodation',
        'Stay duration: Up to 30 days'
      ],
      requirements: {
        documents: [
          'Valid passport with minimum 6 months validity from date of entry',
          'Confirmed return or onward flight ticket',
          'Proof of sufficient funds (recommended: SGD 100-150 per day)',
          'Hotel reservation or invitation letter from Singapore resident',
          'Travel insurance (recommended but not mandatory)',
          'Yellow fever vaccination certificate (if arriving from endemic countries)'
        ],
        processing: [
          'No advance processing required',
          'Immigration clearance at airport: 10-30 minutes',
          'Automated clearance gates available for eligible travelers',
          'Biometric data collection at entry',
          'Health declaration form completion required'
        ],
        costs: [
          'No visa fees required',
          'Airport departure tax: Included in flight ticket',
          'Travel insurance: $20-50 USD (optional)',
          'SG Arrival Card: Free (mandatory online submission)'
        ],
        restrictions: [
          'Maximum stay: 30 days (non-extendable for visa-free entry)',
          'Tourism and business meetings only',
          'No employment or paid activities allowed',
          'Must not engage in any form of work',
          'Overstaying can result in fines and immigration ban',
          'Must have sufficient funds for entire stay'
        ]
      },
      processingTime: 'Not required',
      cost: 'Free',
      validity: '30 days',
      icon: 'CheckCircle',
      color: 'success'
    },
    'in-ae': {
      visaType: 'evisa',
      status: 'available',
      title: 'eVisa Available Online',
      description: 'Apply for UAE eVisa online before your travel',
      details: [
        'Valid passport with 6 months validity',
        'Digital passport photograph',
        'Confirmed flight booking',
        'Hotel reservation',
        'Processing time: 3-5 business days'
      ],
      requirements: {
        documents: [
          'Valid passport with minimum 6 months validity',
          'Digital color passport photograph (white background)',
          'Confirmed round-trip flight booking',
          'Hotel reservation or invitation letter from UAE sponsor',
          'Travel insurance covering UAE stay',
          'Bank statements for last 3 months',
          'Employment letter or business registration',
          'Previous visa copies (if applicable)'
        ],
        processing: [
          'Standard processing: 3-5 business days',
          'Express processing: 24-48 hours (additional fee)',
          'Application submitted online through official portal',
          'Email notification upon approval',
          'Print eVisa approval before travel'
        ],
        costs: [
          'Single entry 30-day visa: 250 AED (approximately $68 USD)',
          'Multiple entry 30-day visa: 350 AED (approximately $95 USD)',
          'Single entry 90-day visa: 650 AED (approximately $177 USD)',
          'Express processing fee: Additional 100 AED',
          'Service fee: 50 AED',
          'Payment methods: Credit/debit card online'
        ],
        restrictions: [
          'Valid for entry within 60 days of issue',
          'Stay duration as per visa type (30 or 90 days)',
          'No work authorization included',
          'Must enter through designated ports',
          'Extension possible through immigration office',
          'Overstaying fine: 100 AED per day after grace period'
        ]
      },
      processingTime: '3-5 business days',
      cost: '250-650 AED',
      validity: '60 days',
      icon: 'Globe',
      color: 'primary'
    }
  };

  const policyUpdates = [
    {
      type: 'new',
      title: 'New Visa-Free Agreement with Thailand',
      description: 'Thailand announces visa-free entry for Indian passport holders for stays up to 60 days, effective from November 2025.',
      country: 'Thailand',
      date: 'Jan 10, 2026',
      urgent: false
    },
    {
      type: 'change',
      title: 'US Visa Interview Wait Times Reduced',
      description: 'US Embassy announces reduced interview wait times across major Indian cities. New slots available for February 2026.',
      country: 'United States',
      date: 'Jan 8, 2026',
      urgent: false
    },
    {
      type: 'alert',
      title: 'UK Visa Processing Delays',
      description: 'UK visa processing experiencing delays of 4-6 weeks due to system upgrades. Apply well in advance of travel dates.',
      country: 'United Kingdom',
      date: 'Jan 5, 2026',
      urgent: true
    },
    {
      type: 'new',
      title: 'Singapore eVisa Launch',
      description: 'Singapore introduces new eVisa system for Indian nationals. Online applications now accepted with 48-hour processing.',
      country: 'Singapore',
      date: 'Jan 3, 2026',
      urgent: false
    }
  ];

  const handleSearch = (searchParams) => {
    setIsLoading(true);

    setTimeout(() => {
      const { passportCountry, destination } = searchParams || {};
      const rule = lookupVisaRequirement(passportCountry, destination);

      let result;
      if (!rule?.found) {
        result = {
          visaType: 'embassy',
          status: 'required',
          title: 'Visa Required',
          description: 'Please contact the embassy for specific requirements',
          details: ['Valid passport', 'Visa application form', 'Supporting documents'],
          requirements: {
            documents: ['Valid passport with 6 months validity', 'Completed visa application form', 'Passport photographs', 'Proof of travel arrangements'],
            processing: ['Standard processing: 2-4 weeks', 'Expedited processing may be available'],
            costs: ['Visa application fee varies by visa type', 'Additional service fees may apply'],
            restrictions: ['Stay duration as per visa type', 'No work authorization unless specified']
          },
          processingTime: '2-4 weeks',
          cost: 'Varies',
          validity: 'Varies',
          icon: 'FileText',
          color: 'primary'
        };
      } else {
        const d = rule.details || {};
        result = {
          visaType: rule.type,
          status: rule.type === 'visa_free' ? 'not-required' : 'required',
          title: getVisaTypeLabel(rule.type),
          description: rule.recommendation,
          details: d.details || d.documents || [],
          requirements: {
            documents: d.documents || [],
            processing: [`Standard processing: ${d.processingDays?.normal || 'Varies'} days`],
            costs: [`Approx: ${d.feeUSD ? '$' + d.feeUSD : 'Varies'}`],
            restrictions: []
          },
          processingTime: `${d.processingDays?.normal || 'Varies'} days`,
          cost: d.feeUSD ? `$${d.feeUSD} USD` : (d.feeUSD === 0 ? 'Free' : 'Varies'),
          validity: 'Varies',
          icon: rule.type === 'visa_free' ? 'CheckCircle' : (rule.type === 'evisa' ? 'Globe' : 'Building'),
          color: rule.type === 'visa_free' ? 'success' : (rule.type === 'visa_on_arrival' ? 'warning' : 'primary'),
          appointmentRequired: d.appointmentRequired,
          embassyContact: d.embassyContact || {}
        };
      }

      setSearchResults({
        ...result,
        searchParams
      });
      setIsLoading(false);
    }, 800);
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

              {/* Community reviews for the current destination */}
              {searchResults && (
                <CommunityReviews country={getCountryName(searchResults?.searchParams?.destination)} />
              )}

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

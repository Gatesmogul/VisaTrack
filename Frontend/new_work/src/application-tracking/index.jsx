import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import TripContextSelector from '../../components/ui/TripContextSelector';
import ApplicationCard from './components/ApplicationCard';
import DeadlineAlert from './components/DeadlineAlert';
import DocumentChecklist from './components/DocumentChecklist';
import ApplicationDetailsModal from './components/ApplicationDetailsModal';
import FilterBar from './components/FilterBar';
import StatisticsCard from './components/StatisticsCard';
import BookingsPanel from './components/BookingsPanel';

const ApplicationTracking = () => {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    urgency: 'all',
    sort: 'deadline-asc',
  });

  const [applications, setApplications] = useState([
    {
      id: 1,
      destination: 'Japan',
      visaType: 'Tourist Visa (Single Entry)',
      status: 'under-review',
      statusLabel: 'Under Review',
      submissionDate: '2026-01-10',
      expectedDecision: '2026-01-25',
      documentProgress: 100,
      urgency: 'medium',
      countryFlag:
        'https://img.rocket.new/generatedImages/rocket_gen_img_1cbc8e9c0-1764746751204.png',
      countryFlagAlt:
        'Japanese flag with red circle on white background representing the rising sun',
      applicationId: 'JP-2026-001234',
      processingTime: '10-15 business days',
      fee: '$35 USD',
      nextAction: null,
      timeline: [
        { title: 'Application Submitted', date: '2026-01-10', completed: true, status: 'submitted' },
        { title: 'Documents Verified', date: '2026-01-12', completed: true, status: 'under-review' },
        { title: 'Under Review', date: '2026-01-15', completed: true, status: 'under-review' },
        { title: 'Decision Pending', date: '2026-01-25', completed: false, status: 'pending' },
      ],
      uploadedDocuments: [
        { name: 'Passport Copy', uploaded: true },
        { name: 'Passport Photo', uploaded: true },
        { name: 'Flight Itinerary', uploaded: true },
        { name: 'Hotel Reservation', uploaded: true },
        { name: 'Bank Statement', uploaded: true },
      ],
      embassyContact: {
        email: 'visa@jp-embassy.org',
        phone: '+1-202-238-6700',
      },
    },
    {
      id: 2,
      destination: 'United Kingdom',
      visaType: 'Standard Visitor Visa',
      status: 'pending-documents',
      statusLabel: 'Pending Documents',
      submissionDate: '2026-01-08',
      expectedDecision: '2026-02-05',
      documentProgress: 75,
      urgency: 'high',
      countryFlag: 'https://images.unsplash.com/photo-1433847566288-8b7e7fb16ef9',
      countryFlagAlt:
        'Union Jack flag of United Kingdom with red white and blue colors waving in wind',
      applicationId: 'UK-2026-005678',
      processingTime: '15-20 business days',
      fee: '£100 GBP',
      nextAction: 'Upload proof of accommodation and travel insurance by January 20, 2026',
      timeline: [
        { title: 'Application Submitted', date: '2026-01-08', completed: true, status: 'submitted' },
        { title: 'Initial Review', date: '2026-01-11', completed: true, status: 'under-review' },
        { title: 'Additional Documents Requested', date: '2026-01-14', completed: true, status: 'pending-documents' },
        { title: 'Final Review', date: '2026-02-05', completed: false, status: 'pending' },
      ],
      uploadedDocuments: [
        { name: 'Passport Copy', uploaded: true },
        { name: 'Passport Photos', uploaded: true },
        { name: 'Bank Statements (6 months)', uploaded: true },
      ],
      appointmentDetails: {
        date: '2026-01-28',
        time: '10:00 AM',
        location: 'UK Visa Application Centre, 123 Embassy Row, Washington DC',
      },
      embassyContact: {
        email: 'ukvi.enquiries@fco.gov.uk',
        phone: '+1-212-745-0200',
      },
    },
    {
      id: 3,
      destination: 'Australia',
      visaType: 'eVisitor (subclass 651)',
      status: 'approved',
      statusLabel: 'Approved',
      submissionDate: '2025-12-20',
      expectedDecision: '2026-01-05',
      documentProgress: 100,
      urgency: 'low',
      countryFlag: 'https://images.unsplash.com/photo-1680173764109-bfe1a34a1877',
      countryFlagAlt:
        'Australian flag with Union Jack and Southern Cross stars on blue background',
      applicationId: 'AU-2025-009876',
      processingTime: '1-2 business days',
      fee: 'Free',
      nextAction: null,
      timeline: [
        { title: 'Application Submitted', date: '2025-12-20', completed: true, status: 'submitted' },
        { title: 'Automated Processing', date: '2025-12-21', completed: true, status: 'under-review' },
        { title: 'Approved', date: '2026-01-05', completed: true, status: 'approved' },
        { title: 'Visa Issued', date: '2026-01-05', completed: true, status: 'approved' },
      ],
      uploadedDocuments: [
        { name: 'Passport Copy', uploaded: true },
        { name: 'Travel Itinerary', uploaded: true },
      ],
      embassyContact: {
        email: 'info@homeaffairs.gov.au',
        phone: '+61-2-6196-0196',
      },
    },
    {
      id: 4,
      destination: 'India',
      visaType: 'e-Tourist Visa',
      status: 'interview-scheduled',
      statusLabel: 'Interview Scheduled',
      submissionDate: '2026-01-05',
      expectedDecision: '2026-01-30',
      documentProgress: 100,
      urgency: 'critical',
      countryFlag: 'https://images.unsplash.com/photo-1661010502407-045d636bf3c2',
      countryFlagAlt:
        'Indian flag with saffron white and green horizontal stripes and blue Ashoka Chakra wheel',
      applicationId: 'IN-2026-112233',
      processingTime: '3-5 business days',
      fee: '$80 USD',
      nextAction: 'Attend biometric appointment on January 22, 2026 at 2:00 PM',
      timeline: [
        { title: 'Application Submitted', date: '2026-01-05', completed: true, status: 'submitted' },
        { title: 'Payment Confirmed', date: '2026-01-06', completed: true, status: 'under-review' },
        { title: 'Biometric Appointment Scheduled', date: '2026-01-10', completed: true, status: 'interview-scheduled' },
        { title: 'Final Decision', date: '2026-01-30', completed: false, status: 'pending' },
      ],
      uploadedDocuments: [
        { name: 'Passport Copy', uploaded: true },
        { name: 'Passport Photo', uploaded: true },
        { name: 'Travel Itinerary', uploaded: true },
        { name: 'Hotel Booking', uploaded: true },
      ],
      appointmentDetails: {
        date: '2026-01-22',
        time: '2:00 PM',
        location: 'VFS Global India Visa Application Centre, 456 Consular Drive, New York',
      },
      embassyContact: {
        email: 'cons.newyork@mea.gov.in',
        phone: '+1-212-774-0600',
      },
    },
  ]);

  const upcomingDeadlines = [
    {
      id: 1,
      title: 'UK Visa - Document Submission',
      description: 'Upload proof of accommodation and travel insurance',
      date: '2026-01-20',
      urgency: 'high',
      icon: 'FileText',
    },
    {
      id: 2,
      title: 'India Visa - Biometric Appointment',
      description: 'Attend biometric appointment at VFS Global Centre',
      date: '2026-01-22',
      urgency: 'critical',
      icon: 'Calendar',
    },
    {
      id: 3,
      title: 'Japan Visa - Expected Decision',
      description: 'Decision expected for tourist visa application',
      date: '2026-01-25',
      urgency: 'medium',
      icon: 'Clock',
    },
  ];

  const [documentChecklist, setDocumentChecklist] = useState([
    {
      id: 1,
      name: 'Proof of Accommodation',
      description: 'Hotel booking confirmation or invitation letter from host',
      required: true,
      completed: false,
      specifications: ['Must cover entire stay', 'Official letterhead'],
    },
    {
      id: 2,
      name: 'Travel Insurance',
      description: 'Comprehensive travel insurance covering medical emergencies',
      required: true,
      completed: false,
      specifications: ['Minimum $50,000 coverage', 'Valid for trip duration'],
    },
    {
      id: 3,
      name: 'Return Flight Ticket',
      description: 'Confirmed return or onward journey ticket',
      required: true,
      completed: true,
      specifications: ['Confirmed booking', 'Valid dates'],
    },
    {
      id: 4,
      name: 'Employment Letter',
      description: 'Letter from employer confirming employment and leave approval',
      required: false,
      completed: false,
      specifications: ['Company letterhead', 'Signed by HR'],
    },
  ]);

  const statistics = [
    { icon: 'FileText', label: 'Active Applications', value: '4', color: 'bg-primary/10 text-primary', trend: 'up', trendValue: '+2' },
    { icon: 'CheckCircle', label: 'Approved Visas', value: '1', color: 'bg-success/10 text-success', trend: 'up', trendValue: '+1' },
    { icon: 'Clock', label: 'Pending Review', value: '2', color: 'bg-warning/10 text-warning' },
    { icon: 'AlertCircle', label: 'Action Required', value: '1', color: 'bg-error/10 text-error', trend: 'down', trendValue: '-1' },
  ];

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  const handleUploadDocument = (application) => {
    // Open details modal so user can upload documents for this application
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  const handleAddUploadedDocument = (applicationId, uploadedDoc) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              uploadedDocuments: [...(app.uploadedDocuments || []), { name: uploadedDoc.name, uploaded: true, url: uploadedDoc.url }],
              documentProgress: Math.min(100, (app.documentProgress || 0) + 10),
            }
          : app
      )
    );

    // Also update selectedApplication if it's the same
    if (selectedApplication?.id === applicationId) {
      setSelectedApplication((prev) => ({
        ...prev,
        uploadedDocuments: [...(prev.uploadedDocuments || []), { name: uploadedDoc.name, uploaded: true, url: uploadedDoc.url }],
      }));
    }
  };

  const handleDeleteUploadedDocument = (applicationId, docName) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              uploadedDocuments: (app.uploadedDocuments || []).filter((d) => d.name !== docName),
              documentProgress: Math.max(0, (app.documentProgress || 0) - 10),
            }
          : app
      )
    );

    if (selectedApplication?.id === applicationId) {
      setSelectedApplication((prev) => ({
        ...prev,
        uploadedDocuments: (prev.uploadedDocuments || []).filter((d) => d.name !== docName),
      }));
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = (value) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleToggleDocument = (docId, completed) => {
    setDocumentChecklist((prev) => prev?.map((doc) => (doc?.id === docId ? { ...doc, completed } : doc)));
  };

  const filteredApplications = applications?.filter((app) => {
    if (activeTab === 'active' && app?.status === 'approved') return false;
    if (activeTab === 'completed' && app?.status !== 'approved') return false;
    if (filters?.status !== 'all' && app?.status !== filters?.status) return false;
    if (filters?.urgency !== 'all' && app?.urgency !== filters?.urgency) return false;
    if (
      filters?.search &&
      !app?.destination?.toLowerCase()?.includes(filters?.search?.toLowerCase()) &&
      !app?.applicationId?.toLowerCase()?.includes(filters?.search?.toLowerCase())
    )
      return false;

    return true;
  });

  return (
    <>
      <Helmet>
        <title>Application Tracking - VisaTrack</title>
        <meta name="description" content="Track your visa applications with real-time status updates, deadline reminders, and document management" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 md:mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">Application Tracking</h1>
              <p className="text-sm md:text-base text-muted-foreground">Monitor your visa applications and manage deadlines</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <TripContextSelector />
              <Link to="/visa-requirements-lookup">
                <Button variant="default" iconName="Plus" iconPosition="left" fullWidth>
                  New Application
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {statistics?.map((stat, index) => (
              <StatisticsCard key={index} {...stat} />
            ))}
          </div>

          <div className="mb-6 md:mb-8">
            <FilterBar filters={filters} onFilterChange={handleFilterChange} onSearch={handleSearch} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-4 md:mb-6 border-b border-border overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('active')}
                    className={`px-4 py-2 text-sm md:text-base font-medium transition-smooth whitespace-nowrap ${
                      activeTab === 'active' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
                    }`}>
                    Active Applications ({applications?.filter((a) => a?.status !== 'approved')?.length})
                  </button>

                  <button
                    onClick={() => setActiveTab('completed')}
                    className={`px-4 py-2 text-sm md:text-base font-medium transition-smooth whitespace-nowrap ${
                      activeTab === 'completed' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
                    }`}>
                    Completed ({applications?.filter((a) => a?.status === 'approved')?.length})
                  </button>
                </div>

                {filteredApplications?.length === 0 ? (
                  <div className="bg-card border border-border rounded-lg p-8 md:p-12 text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name="FileText" size={32} className="text-muted-foreground" />
                    </div>
                    <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-2">No Applications Found</h3>
                    <p className="text-sm md:text-base text-muted-foreground mb-6">
                      {activeTab === 'active' ? 'Start tracking your visa applications by creating a new application' : 'You have no completed applications yet'}
                    </p>
                    <Link to="/visa-requirements-lookup">
                      <Button variant="default" iconName="Plus" iconPosition="left">
                        Create New Application
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4 md:space-y-6">
                    {filteredApplications?.map((application) => (
                      <ApplicationCard
                        key={application?.id}
                        application={application}
                        onViewDetails={handleViewDetails}
                        onUploadDocument={handleUploadDocument}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6 md:space-y-8">
              <div>
                <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-4">Upcoming Deadlines</h2>
                <div className="space-y-3 md:space-y-4">
                  {upcomingDeadlines?.map((deadline) => (
                    <DeadlineAlert key={deadline?.id} deadline={deadline} />
                  ))}
                </div>
              </div>

              <BookingsPanel />

              <PastApplicationsPanel />

              <DocumentChecklist documents={documentChecklist} onToggle={handleToggleDocument} />

              <div className="bg-card border border-border rounded-lg p-4 md:p-6">
                <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Link to="/embassy-finder">
                    <Button variant="outline" iconName="MapPin" iconPosition="left" fullWidth>
                      Find Embassy
                    </Button>
                  </Link>

                  <Link to="/visa-requirements-lookup">
                    <Button variant="outline" iconName="Search" iconPosition="left" fullWidth>
                      Check Requirements
                    </Button>
                  </Link>

                  <Button variant="outline" iconName="Bell" iconPosition="left" fullWidth>
                    Manage Notifications
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showDetailsModal && (
        <ApplicationDetailsModal
          application={selectedApplication}
          onClose={() => setShowDetailsModal(false)}
          onAddDocument={(doc) => handleAddUploadedDocument(selectedApplication?.id, doc)}
          onDeleteDocument={(docName) => handleDeleteUploadedDocument(selectedApplication?.id, docName)}
        />
      )}
    </>
  );
};

export default ApplicationTracking;

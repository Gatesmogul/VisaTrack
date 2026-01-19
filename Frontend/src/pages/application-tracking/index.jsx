// DATA SOURCE: useApplications.dashboard -> GET /api/v1/applications/dashboard
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import TripContextSelector from '../../components/ui/TripContextSelector';
import useApplications from '../../hooks/useApplications';
import ApplicationCard from './components/ApplicationCard';
import ApplicationDetailsModal from './components/ApplicationDetailsModal';
import BookingsPanel from './components/BookingsPanel';
import DeadlineAlert from './components/DeadlineAlert';
import DocumentChecklist from './components/DocumentChecklist';
import FilterBar from './components/FilterBar';
import PastApplicationsPanel from './components/PastApplicationsPanel';
import StatisticsCard from './components/StatisticsCard';

const ApplicationTracking = () => {
  const { dashboard } = useApplications();
  const { loading: isLoading, data, error, request: fetchDashboard } = dashboard;
  
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    urgency: 'all',
    sort: 'deadline-asc',
  });

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Derived from API data
  const applications = data?.applications || [];
  const statusSummary = data?.statusSummary || {};
  
  const statistics = [
    { icon: 'FileText', label: 'Not Started', value: statusSummary.notStarted || '0', color: 'bg-primary/10 text-primary' },
    { icon: 'CheckCircle', label: 'Approved Visas', value: statusSummary.approved || '0', color: 'bg-success/10 text-success' },
    { icon: 'Clock', label: 'In Progress', value: statusSummary.inProgress || '0', color: 'bg-warning/10 text-warning' },
    { icon: 'AlertCircle', label: 'Needs Attention', value: statusSummary.needsAttention || '0', color: 'bg-error/10 text-error' },
  ];
  const upcomingDeadlines = data?.upcomingDeadlines || [];
  const documentChecklist = data?.checklist || [];


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
    // Re-fetch dashboard to update progress and stats
    fetchDashboard();
  };

  const handleDeleteUploadedDocument = (applicationId, docName) => {
    // Re-fetch dashboard after deletion
    fetchDashboard();
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = (value) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleToggleDocument = (docId, completed) => {
    // Ideally call updateStatus or similar
    console.log('Toggle document:', docId, completed);
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

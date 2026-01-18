import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import TripContextSelector from '../../components/ui/TripContextSelector';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import TripCard from './components/TripCard';
import CreateTripModal from './components/CreateTripModal';
import TimelinePanel from './components/TimelinePanel';
import QuickActions from './components/QuickActions';
import CostEstimatorModal from './components/CostEstimatorModal';
import EmptyState from './components/EmptyState';

const TripPlanningDashboard = () => {
  const [trips, setTrips] = useState([
    {
      id: 1,
      name: 'European Business Tour',
      purpose: 'business',
      departureDate: '2026-03-15',
      returnDate: '2026-03-30',
      destinations: [
        { country: 'France', flag: '🇫🇷', visaStatus: 'approved' },
        { country: 'Germany', flag: '🇩🇪', visaStatus: 'pending' },
        { country: 'Italy', flag: '🇮🇹', visaStatus: 'not_started' }
      ],
      status: 'active',
      urgentDeadlines: ['Germany visa application due in 7 days']
    },
    {
      id: 2,
      name: 'Southeast Asia Adventure',
      purpose: 'tourism',
      departureDate: '2026-05-20',
      returnDate: '2026-06-10',
      destinations: [
        { country: 'Thailand', flag: '🇹🇭', visaStatus: 'not_started' },
        { country: 'Vietnam', flag: '🇻🇳', visaStatus: 'not_started' },
        { country: 'Singapore', flag: '🇸🇬', visaStatus: 'not_started' }
      ],
      status: 'planning',
      urgentDeadlines: []
    }
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCostEstimator, setShowCostEstimator] = useState(false);

  const handleCreateTrip = (newTrip) => {
    setTrips([...trips, newTrip]);
  };

  const handleEditTrip = (trip) => {
    console.log('Edit trip:', trip);
  };

  const handleDeleteTrip = (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      setTrips(trips?.filter(t => t?.id !== tripId));
    }
  };

  const filteredTrips = filterStatus === 'all' 
    ? trips 
    : trips?.filter(t => t?.status === filterStatus);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-4 mb-6 md:mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
              Trip Planning Dashboard
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Manage your trips and track visa requirements across multiple destinations
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <TripContextSelector />
            <Button 
              onClick={() => setIsCreateModalOpen(true)} 
              iconName="Plus" 
              iconPosition="left"
              className="w-full sm:w-auto"
            >
              Create New Trip
            </Button>
          </div>
        </div>

        <QuickActions onAction={(action) => {
          if (action === 'cost-estimator') setShowCostEstimator(true);
        }} />

        <div className="mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground">Your Trips</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-smooth ${
                    filterStatus === 'all' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus('active')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-smooth ${
                    filterStatus === 'active' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilterStatus('planning')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-smooth ${
                    filterStatus === 'planning' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  Planning
                </button>
              </div>
            </div>

            {filteredTrips?.length === 0 && trips?.length === 0 ? (
              <EmptyState onCreateTrip={() => setIsCreateModalOpen(true)} />
            ) : filteredTrips?.length === 0 ? (
              <div className="bg-card border border-border rounded-lg shadow-elevation-2 p-8 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Filter" size={32} className="text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No trips found with the selected filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                {filteredTrips?.map(trip => (
                  <TripCard
                    key={trip?.id}
                    trip={trip}
                    onEdit={handleEditTrip}
                    onDelete={handleDeleteTrip}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <TimelinePanel trips={trips} />
          </div>
        </div>
      </main>
      <CreateTripModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTrip={handleCreateTrip}
      />

      <CostEstimatorModal isOpen={showCostEstimator} onClose={() => setShowCostEstimator(false)} trips={trips} />
    </div>
  );
};

export default TripPlanningDashboard;

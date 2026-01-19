import { useEffect, useRef, useState } from 'react';
import { useTrips } from '../../hooks/useTrips';
import Icon from '../AppIcon';

const TripContextSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const dropdownRef = useRef(null);
  
  const { myTrips } = useTrips();
  const { data, request: fetchTrips } = myTrips;
  const trips = data?.trips || data || [];

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  useEffect(() => {
    if (trips?.length > 0 && !selectedTrip) {
      setSelectedTrip(trips?.[0]);
    }
  }, [trips, selectedTrip]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event?.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleTripSelect = (trip) => {
    setSelectedTrip(trip);
    setIsOpen(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysUntilDeparture = (dateString) => {
    const departure = new Date(dateString);
    const today = new Date();
    const diffTime = departure - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (!selectedTrip) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted transition-smooth min-w-[240px]"
        aria-label="Select trip context"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 flex-1">
          <div className="flex -space-x-1">
            {selectedTrip?.destinations?.slice(0, 3)?.map((dest, index) => (
              <span
                key={index}
                className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm border-2 border-card"
              >
                {dest?.countryFlag || '🌍'}
              </span>
            ))}
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-foreground truncate">{selectedTrip?.name}</p>
            <p className="text-xs text-muted-foreground">
              {getDaysUntilDeparture(selectedTrip?.departureDate)} days until departure
            </p>
          </div>
        </div>
        <Icon
          name="ChevronDown"
          size={16}
          className={`text-muted-foreground transition-smooth ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-[320px] bg-popover border border-border rounded-lg shadow-elevation-4 overflow-hidden z-200">
          <div className="p-3 border-b border-border">
            <h3 className="text-sm font-heading font-semibold text-popover-foreground">Your Trips</h3>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {trips?.map((trip) => (
              <button
                key={trip?.id}
                onClick={() => handleTripSelect(trip)}
                className={`w-full p-4 text-left hover:bg-muted transition-smooth border-b border-border last:border-b-0 ${
                  selectedTrip?.id === trip?.id ? 'bg-accent/5' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex -space-x-1 mt-1">
                    {trip?.destinations?.slice(0, 3)?.map((dest, index) => (
                      <span
                        key={index}
                        className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-base border-2 border-popover"
                      >
                        {dest?.countryFlag || '🌍'}
                      </span>
                    ))}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-popover-foreground">{trip?.name}</p>
                      {selectedTrip?.id === trip?.id && (
                        <Icon name="Check" size={16} color="var(--color-primary)" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {trip?.destinations?.map(d => d.countryName || d.countryId?.name || d.countryCode)?.join(' → ')}
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Icon name="Calendar" size={12} />
                        {formatDate(trip?.departureDate)}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-medium ${
                          trip?.status === 'active' ?'bg-success/10 text-success' :'bg-accent/10 text-accent'
                        }`}
                      >
                        {trip?.status === 'active' ? 'Active' : 'Planning'}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="p-3 border-t border-border">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-muted rounded-lg transition-smooth">
              <Icon name="Plus" size={16} />
              Create New Trip
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripContextSelector;
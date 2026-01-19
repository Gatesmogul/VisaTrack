import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CreateTripModal = ({ isOpen, onClose, onCreateTrip }) => {
  const [tripName, setTripName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [destinations, setDestinations] = useState([{ country: '', flag: '' }]);
  const [errors, setErrors] = useState({});

  const countries = [
    { value: 'france', label: 'France', flag: '🇫🇷' },
    { value: 'germany', label: 'Germany', flag: '🇩🇪' },
    { value: 'italy', label: 'Italy', flag: '🇮🇹' },
    { value: 'spain', label: 'Spain', flag: '🇪🇸' },
    { value: 'uk', label: 'United Kingdom', flag: '🇬🇧' },
    { value: 'usa', label: 'United States', flag: '🇺🇸' },
    { value: 'canada', label: 'Canada', flag: '🇨🇦' },
    { value: 'japan', label: 'Japan', flag: '🇯🇵' },
    { value: 'china', label: 'China', flag: '🇨🇳' },
    { value: 'thailand', label: 'Thailand', flag: '🇹🇭' },
    { value: 'vietnam', label: 'Vietnam', flag: '🇻🇳' },
    { value: 'singapore', label: 'Singapore', flag: '🇸🇬' },
    { value: 'australia', label: 'Australia', flag: '🇦🇺' },
    { value: 'brazil', label: 'Brazil', flag: '🇧🇷' },
    { value: 'india', label: 'India', flag: '🇮🇳' }
  ];

  const purposeOptions = [
    { value: 'tourism', label: 'Tourism' },
    { value: 'business', label: 'Business' },
    { value: 'transit', label: 'Transit' },
    { value: 'study', label: 'Study' },
    { value: 'work', label: 'Work' },
    { value: 'family', label: 'Family Visit' }
  ];

  const handleAddDestination = () => {
    setDestinations([...destinations, { country: '', flag: '' }]);
  };

  const handleRemoveDestination = (index) => {
    if (destinations?.length > 1) {
      const newDestinations = destinations?.filter((_, i) => i !== index);
      setDestinations(newDestinations);
    }
  };

  const handleDestinationChange = (index, value) => {
    const selectedCountry = countries?.find(c => c?.value === value);
    const newDestinations = [...destinations];
    newDestinations[index] = {
      country: selectedCountry?.label || '',
      flag: selectedCountry?.flag || ''
    };
    setDestinations(newDestinations);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!tripName?.trim()) {
      newErrors.tripName = 'Trip name is required';
    }

    if (!purpose) {
      newErrors.purpose = 'Travel purpose is required';
    }

    if (!departureDate) {
      newErrors.departureDate = 'Departure date is required';
    }

    if (!returnDate) {
      newErrors.returnDate = 'Return date is required';
    }

    if (departureDate && returnDate && new Date(returnDate) <= new Date(departureDate)) {
      newErrors.returnDate = 'Return date must be after departure date';
    }

    const hasEmptyDestination = destinations?.some(d => !d?.country);
    if (hasEmptyDestination) {
      newErrors.destinations = 'All destinations must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newTrip = {
      id: Date.now(),
      name: tripName,
      purpose,
      departureDate,
      returnDate,
      destinations: destinations?.map(d => ({
        ...d,
        visaStatus: 'not_started'
      })),
      status: 'planning',
      createdAt: new Date()?.toISOString()
    };

    onCreateTrip(newTrip);
    handleClose();
  };

  const handleClose = () => {
    setTripName('');
    setPurpose('');
    setDepartureDate('');
    setReturnDate('');
    setDestinations([{ country: '', flag: '' }]);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-300 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card border border-border rounded-lg shadow-elevation-5 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <h2 className="text-xl md:text-2xl font-heading font-semibold text-card-foreground">Create New Trip</h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-smooth"
            aria-label="Close modal"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-4 md:space-y-6">
            <Input
              label="Trip Name"
              type="text"
              placeholder="e.g., European Business Tour"
              value={tripName}
              onChange={(e) => setTripName(e?.target?.value)}
              error={errors?.tripName}
              required
            />

            <Select
              label="Travel Purpose"
              placeholder="Select purpose"
              options={purposeOptions}
              value={purpose}
              onChange={setPurpose}
              error={errors?.purpose}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Departure Date"
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e?.target?.value)}
                error={errors?.departureDate}
                required
              />

              <Input
                label="Return Date"
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e?.target?.value)}
                error={errors?.returnDate}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-foreground">
                  Destinations <span className="text-error">*</span>
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAddDestination}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Add Destination
                </Button>
              </div>

              <div className="space-y-3">
                {destinations?.map((destination, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="flex-1">
                      <Select
                        placeholder="Select country"
                        options={countries}
                        value={countries?.find(c => c?.label === destination?.country)?.value || ''}
                        onChange={(value) => handleDestinationChange(index, value)}
                        searchable
                      />
                    </div>
                    {destinations?.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveDestination(index)}
                        className="p-2 rounded-lg text-error hover:bg-error/10 transition-smooth flex-shrink-0 mt-1"
                        aria-label="Remove destination"
                      >
                        <Icon name="Trash2" size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {errors?.destinations && (
                <p className="text-sm text-error mt-2">{errors?.destinations}</p>
              )}
            </div>

            {destinations?.length > 1 && (
              <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <Icon name="Info" size={16} className="text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-accent">
                    Multi-country trips require careful visa coordination. We'll help you determine the optimal application sequence.
                  </p>
                </div>
              </div>
            )}
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 p-4 md:p-6 border-t border-border">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} iconName="Plus" iconPosition="left">
            Create Trip
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateTripModal;
import { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CreateTripModal = ({ isOpen, onClose, onCreateTrip, initialData = null }) => {
  const [tripName, setTripName] = useState(initialData?.name || '');
  const [purpose, setPurpose] = useState(initialData?.purpose || '');
  const [departureDate, setDepartureDate] = useState(initialData?.departureDate ? initialData.departureDate.split('T')[0] : '');
  const [returnDate, setReturnDate] = useState(initialData?.returnDate ? initialData.returnDate.split('T')[0] : '');
  const [destinations, setDestinations] = useState(
    initialData?.destinations?.length 
      ? initialData.destinations.map(d => ({ country: d.country, countryCode: d.countryCode, flag: d.flag }))
      : [{ country: '', countryCode: '', flag: '' }]
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setTripName(initialData.name || '');
      setPurpose(initialData.purpose || '');
      setDepartureDate(initialData.departureDate ? initialData.departureDate.split('T')[0] : '');
      setReturnDate(initialData.returnDate ? initialData.returnDate.split('T')[0] : '');
      setDestinations(
        initialData.destinations?.length 
          ? initialData.destinations.map(d => ({ country: d.country, countryCode: d.countryCode, flag: d.flag }))
          : [{ country: '', countryCode: '', flag: '' }]
      );
    } else {
      setTripName('');
      setPurpose('');
      setDepartureDate('');
      setReturnDate('');
      setDestinations([{ country: '', countryCode: '', flag: '' }]);
    }
  }, [initialData]);

  const countries = [
    { value: 'us', label: 'United States', flag: '🇺🇸' },
    { value: 'gb', label: 'United Kingdom', flag: '🇬🇧' },
    { value: 'ca', label: 'Canada', flag: '🇨🇦' },
    { value: 'au', label: 'Australia', flag: '🇦🇺' },
    { value: 'de', label: 'Germany', flag: '🇩🇪' },
    { value: 'fr', label: 'France', flag: '🇫🇷' },
    { value: 'jp', label: 'Japan', flag: '🇯🇵' },
    { value: 'in', label: 'India', flag: '🇮🇳' },
    { value: 'cn', label: 'China', flag: '🇨🇳' },
    { value: 'br', label: 'Brazil', flag: '🇧🇷' },
    { value: 'mx', label: 'Mexico', flag: '🇲🇽' },
    { value: 'sg', label: 'Singapore', flag: '🇸🇬' },
    { value: 'ae', label: 'United Arab Emirates', flag: '🇦🇪' },
    { value: 'za', label: 'South Africa', flag: '🇿🇦' },
    { value: 'kr', label: 'South Korea', flag: '🇰🇷' }
  ];

  const purposeOptions = [
    { value: 'TOURISM', label: 'Tourism' },
    { value: 'BUSINESS', label: 'Business' },
    { value: 'TRANSIT', label: 'Transit' },
    { value: 'STUDY', label: 'Study' },
    { value: 'WORK', label: 'Work' },
    { value: 'FAMILY_VISIT', label: 'Family Visit' }
  ];

  const handleAddDestination = () => {
    setDestinations([...destinations, { country: '', countryCode: '', flag: '' }]);
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
      countryCode: selectedCountry?.value?.toUpperCase() || '',
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

    const tripData = {
      title: tripName,
      name: tripName,
      purpose,
      startDate: departureDate,
      endDate: returnDate,
      departureDate,
      returnDate,
      destinations: destinations?.map(d => ({
        ...d,
        visaStatus: d.visaStatus || 'not_started'
      })),
      status: initialData?.status || 'planning'
    };

    onCreateTrip(tripData);
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
          <h2 className="text-xl md:text-2xl font-heading font-semibold text-card-foreground">
            {initialData ? 'Edit Trip' : 'Create New Trip'}
          </h2>
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

          <div className="flex items-center justify-end gap-3 p-4 md:p-6 border-t border-border mt-6">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" loading={false} iconName={initialData ? "Save" : "Plus"} iconPosition="left">
              {initialData ? 'Save Changes' : 'Create Trip'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTripModal;
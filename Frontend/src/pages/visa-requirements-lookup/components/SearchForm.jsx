import { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const SearchForm = ({ onSearch, isLoading }) => {
  const [passportCountry, setPassportCountry] = useState('');
  const [destination, setDestination] = useState('');
  const [travelPurpose, setTravelPurpose] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [errors, setErrors] = useState({});

  const passportCountries = [
    { value: 'us', label: '🇺🇸 United States' },
    { value: 'in', label: '🇮🇳 India' },
    { value: 'gb', label: '🇬🇧 United Kingdom' },
    { value: 'cn', label: '🇨🇳 China' },
    { value: 'jp', label: '🇯🇵 Japan' },
    { value: 'de', label: '🇩🇪 Germany' },
    { value: 'fr', label: '🇫🇷 France' },
    { value: 'au', label: '🇦🇺 Australia' },
    { value: 'ca', label: '🇨🇦 Canada' },
    { value: 'br', label: '🇧🇷 Brazil' },
    { value: 'mx', label: '🇲🇽 Mexico' },
    { value: 'za', label: '🇿🇦 South Africa' },
    { value: 'ng', label: '🇳🇬 Nigeria' },
    { value: 'ae', label: '🇦🇪 United Arab Emirates' },
    { value: 'sg', label: '🇸🇬 Singapore' }
  ];

  const destinations = [
    { value: 'us', label: '🇺🇸 United States' },
    { value: 'gb', label: '🇬🇧 United Kingdom' },
    { value: 'fr', label: '🇫🇷 France' },
    { value: 'de', label: '🇩🇪 Germany' },
    { value: 'it', label: '🇮🇹 Italy' },
    { value: 'es', label: '🇪🇸 Spain' },
    { value: 'jp', label: '🇯🇵 Japan' },
    { value: 'cn', label: '🇨🇳 China' },
    { value: 'au', label: '🇦🇺 Australia' },
    { value: 'ca', label: '🇨🇦 Canada' },
    { value: 'th', label: '🇹🇭 Thailand' },
    { value: 'sg', label: '🇸🇬 Singapore' },
    { value: 'ae', label: '🇦🇪 United Arab Emirates' },
    { value: 'br', label: '🇧🇷 Brazil' },
    { value: 'mx', label: '🇲🇽 Mexico' }
  ];

  const travelPurposes = [
    { value: 'tourism', label: 'Tourism' },
    { value: 'business', label: 'Business' },
    { value: 'transit', label: 'Transit' },
    { value: 'study', label: 'Study' },
    { value: 'work', label: 'Work' },
    { value: 'medical', label: 'Medical' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!passportCountry) {
      newErrors.passportCountry = 'Please select your passport country';
    }

    if (!destination) {
      newErrors.destination = 'Please select your destination';
    }

    if (passportCountry && destination && passportCountry === destination) {
      newErrors.destination = 'Destination cannot be same as passport country';
    }

    if (!travelPurpose) {
      newErrors.travelPurpose = 'Please select travel purpose';
    }

    if (!departureDate) {
      newErrors.departureDate = 'Please select departure date';
    }

    if (departureDate) {
      const selectedDate = new Date(departureDate);
      const today = new Date();
      today?.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.departureDate = 'Departure date cannot be in the past';
      }
    }

    if (returnDate && departureDate) {
      const departure = new Date(departureDate);
      const returnD = new Date(returnDate);

      if (returnD <= departure) {
        newErrors.returnDate = 'Return date must be after departure date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();

    if (validateForm()) {
      onSearch({
        passportCountry,
        destination,
        travelPurpose,
        departureDate,
        returnDate
      });
    }
  };

  const handleReset = () => {
    setPassportCountry('');
    setDestination('');
    setTravelPurpose('');
    setDepartureDate('');
    setReturnDate('');
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-4 md:p-6 lg:p-8 shadow-elevation-2">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Search" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground">Visa Requirements Lookup</h2>
          <p className="text-sm text-muted-foreground">Find visa requirements for your destination</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Select
          label="Your Passport Country"
          placeholder="Select your passport country"
          options={passportCountries}
          value={passportCountry}
          onChange={setPassportCountry}
          error={errors?.passportCountry}
          required
          searchable
        />

        <Select
          label="Destination Country"
          placeholder="Select destination country"
          options={destinations}
          value={destination}
          onChange={setDestination}
          error={errors?.destination}
          required
          searchable
        />

        <Select
          label="Travel Purpose"
          placeholder="Select travel purpose"
          options={travelPurposes}
          value={travelPurpose}
          onChange={setTravelPurpose}
          error={errors?.travelPurpose}
          required
        />

        <Input
          label="Departure Date"
          type="date"
          value={departureDate}
          onChange={(e) => setDepartureDate(e?.target?.value)}
          error={errors?.departureDate}
          required
          min={new Date()?.toISOString()?.split('T')?.[0]}
        />

        <Input
          label="Return Date (Optional)"
          type="date"
          value={returnDate}
          onChange={(e) => setReturnDate(e?.target?.value)}
          error={errors?.returnDate}
          min={departureDate || new Date()?.toISOString()?.split('T')?.[0]}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Button
          type="submit"
          variant="default"
          iconName="Search"
          iconPosition="left"
          loading={isLoading}
          fullWidth
          className="sm:flex-1"
        >
          Search Requirements
        </Button>
        <Button
          type="button"
          variant="outline"
          iconName="RotateCcw"
          iconPosition="left"
          onClick={handleReset}
          disabled={isLoading}
          className="sm:w-auto"
        >
          Reset
        </Button>
      </div>
    </form>
  );
};

export default SearchForm;
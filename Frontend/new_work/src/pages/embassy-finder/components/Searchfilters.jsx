import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';


const SearchFilters = ({ 
  filters, 
  onFilterChange, 
  onDetectLocation, 
  isDetectingLocation,
  onSearch 
}) => {
  const countryOptions = [
    { value: 'all', label: 'All Countries' },
    { value: 'usa', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'canada', label: 'Canada' },
    { value: 'australia', label: 'Australia' },
    { value: 'germany', label: 'Germany' },
    { value: 'france', label: 'France' },
    { value: 'japan', label: 'Japan' },
    { value: 'china', label: 'China' },
    { value: 'india', label: 'India' },
    { value: 'brazil', label: 'Brazil' }
  ];

  const serviceTypeOptions = [
    { value: 'all', label: 'All Services' },
    { value: 'tourist', label: 'Tourist Visa' },
    { value: 'business', label: 'Business Visa' },
    { value: 'student', label: 'Student Visa' },
    { value: 'work', label: 'Work Visa' },
    { value: 'transit', label: 'Transit Visa' },
    { value: 'passport', label: 'Passport Services' }
  ];

  const radiusOptions = [
    { value: '5', label: '5 km' },
    { value: '10', label: '10 km' },
    { value: '25', label: '25 km' },
    { value: '50', label: '50 km' },
    { value: '100', label: '100 km' },
    { value: 'any', label: 'Any Distance' }
  ];

  return (
    <div className="bg-card rounded-lg shadow-elevation-2 p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground">
          Search Filters
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFilterChange({
            country: 'all',
            serviceType: 'all',
            radius: 'any',
            searchQuery: ''
          })}
        >
          Reset
        </Button>
      </div>
      <div className="space-y-4">
        <Select
          label="Destination Country"
          options={countryOptions}
          value={filters?.country}
          onChange={(value) => onFilterChange({ ...filters, country: value })}
          searchable
        />

        <Select
          label="Visa Service Type"
          options={serviceTypeOptions}
          value={filters?.serviceType}
          onChange={(value) => onFilterChange({ ...filters, serviceType: value })}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Your Location
          </label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter city or postal code"
              value={filters?.searchQuery}
              onChange={(e) => onFilterChange({ ...filters, searchQuery: e?.target?.value })}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="default"
              onClick={onDetectLocation}
              loading={isDetectingLocation}
              iconName="Locate"
              iconPosition="left"
            >
              Detect
            </Button>
          </div>
        </div>

        <Select
          label="Search Radius"
          options={radiusOptions}
          value={filters?.radius}
          onChange={(value) => onFilterChange({ ...filters, radius: value })}
        />

        <Button
          variant="default"
          fullWidth
          onClick={onSearch}
          iconName="Search"
          iconPosition="left"
        >
          Search Embassies
        </Button>
      </div>
    </div>
  );
};

export default SearchFilters;
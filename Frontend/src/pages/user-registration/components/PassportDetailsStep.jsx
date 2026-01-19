import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const PassportDetailsStep = ({ formData, errors, onChange, onCheckboxChange, onSelectChange }) => {
  const countryOptions = [
    { value: 'us', label: '🇺🇸 United States' },
    { value: 'uk', label: '🇬🇧 United Kingdom' },
    { value: 'ca', label: '🇨🇦 Canada' },
    { value: 'au', label: '🇦🇺 Australia' },
    { value: 'de', label: '🇩🇪 Germany' },
    { value: 'fr', label: '🇫🇷 France' },
    { value: 'jp', label: '🇯🇵 Japan' },
    { value: 'in', label: '🇮🇳 India' },
    { value: 'cn', label: '🇨🇳 China' },
    { value: 'br', label: '🇧🇷 Brazil' },
    { value: 'mx', label: '🇲🇽 Mexico' },
    { value: 'sg', label: '🇸🇬 Singapore' },
    { value: 'ae', label: '🇦🇪 United Arab Emirates' },
    { value: 'za', label: '🇿🇦 South Africa' },
    { value: 'kr', label: '🇰🇷 South Korea' }
  ];

  return (
    <div className="space-y-4">
      <Select
        label="Primary Passport Country"
        description="Select the country that issued your main passport"
        options={countryOptions}
        value={formData?.primaryPassport}
        onChange={(value) => onSelectChange('primaryPassport', value)}
        error={errors?.primaryPassport}
        required
        searchable
        placeholder="Search for your country..."
      />
      <Input
        label="Passport Number (Optional)"
        type="text"
        name="passportNumber"
        placeholder="e.g., N1234567"
        description="Helps us track your applications and remind you of expiration"
        value={formData?.passportNumber}
        onChange={onChange}
      />
      <Input
        label="Passport Expiry Date (Optional)"
        type="date"
        name="passportExpiry"
        description="We'll alert you 6 months before expiration"
        value={formData?.passportExpiry}
        onChange={onChange}
        min={new Date()?.toISOString()?.split('T')?.[0]}
      />
      <div className="pt-4 border-t border-border">
        <Checkbox
          label="I hold multiple passports"
          description="Check this if you have citizenship in more than one country"
          checked={formData?.hasMultiplePassports}
          onChange={(e) => onCheckboxChange('hasMultiplePassports', e?.target?.checked)}
        />
      </div>
      {formData?.hasMultiplePassports && (
        <div className="pl-4 border-l-2 border-primary/20 space-y-4">
          <Select
            label="Secondary Passport Country"
            options={countryOptions}
            value={formData?.secondaryPassport}
            onChange={(value) => onSelectChange('secondaryPassport', value)}
            searchable
            placeholder="Select second passport country..."
          />
        </div>
      )}
      <div className="pt-4">
        <Input
          label="Frequent Traveler Program (Optional)"
          type="text"
          name="frequentTravelerProgram"
          placeholder="e.g., Global Entry, TSA PreCheck"
          description="Helps us provide relevant expedited processing information"
          value={formData?.frequentTravelerProgram}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default PassportDetailsStep;
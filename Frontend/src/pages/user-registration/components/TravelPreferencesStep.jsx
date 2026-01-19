import React from 'react';
import { Checkbox, CheckboxGroup } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { useNotifications } from '../../../contexts/NotificationsContext';

const TravelPreferencesStep = ({ formData, errors, onCheckboxChange, onSelectChange }) => {
  const travelPurposes = [
    { value: 'tourism', label: 'Tourism & Leisure' },
    { value: 'business', label: 'Business Travel' },
    { value: 'study', label: 'Study & Education' },
    { value: 'work', label: 'Work & Employment' },
    { value: 'transit', label: 'Transit & Layovers' },
    { value: 'family', label: 'Family Visits' }
  ];

  const notificationPreferences = [
    { key: 'emailNotifications', label: 'Email Notifications', description: 'Visa policy updates and deadline reminders' },
    { key: 'smsNotifications', label: 'SMS Alerts', description: 'Urgent deadline warnings (requires phone number)' },
    { key: 'policyUpdates', label: 'Policy Change Alerts', description: 'Instant notifications when visa rules change' },
    { key: 'travelTips', label: 'Travel Tips & Guides', description: 'Helpful visa application advice and success stories' }
  ];

  const preferredLanguageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'zh', label: '中文' },
    { value: 'ja', label: '日本語' },
    { value: 'ar', label: 'العربية' }
  ];

  const { preferences } = useNotifications();

  const loadedFromSaved = !!preferences && (
    (preferences?.emailNotifications ?? false) === (formData?.emailNotifications ?? false) &&
    (preferences?.smsNotifications ?? false) === (formData?.smsNotifications ?? false) &&
    (preferences?.policyUpdates ?? false) === (formData?.policyUpdates ?? false) &&
    (preferences?.travelTips ?? false) === (formData?.travelTips ?? false) &&
    (preferences?.preferredLanguage ?? 'en') === (formData?.preferredLanguage ?? 'en')
  );

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Typical Travel Purposes <span className="text-error">*</span>
        </label>
        <p className="text-sm text-muted-foreground mb-4">
          Select all that apply to personalize your visa recommendations
        </p>
        <CheckboxGroup error={errors?.travelPurposes}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {travelPurposes?.map((purpose) => (
              <Checkbox
                key={purpose?.value}
                label={purpose?.label}
                checked={formData?.travelPurposes?.includes(purpose?.value)}
                onChange={(e) => {
                  const newPurposes = e?.target?.checked
                    ? [...formData?.travelPurposes, purpose?.value]
                    : formData?.travelPurposes?.filter(p => p !== purpose?.value);
                  onCheckboxChange('travelPurposes', newPurposes);
                }}
              />
            ))}
          </div>
        </CheckboxGroup>
      </div>

      <div className="pt-4 border-t border-border">
        {loadedFromSaved && (
          <div className="mb-3 p-3 bg-accent/5 border border-border rounded-md text-sm text-muted-foreground flex items-center gap-2">
            <Icon name="Info" size={16} />
            <span>Loaded from your saved preferences</span>
          </div>
        )}

        <label className="block text-sm font-medium text-foreground mb-3">
          Notification Preferences
        </label>
        <CheckboxGroup>
          <div className="space-y-3">
            {notificationPreferences?.map((pref) => (
              <Checkbox
                key={pref?.key}
                label={pref?.label}
                description={pref?.description}
                checked={formData?.[pref?.key]}
                onChange={(e) => onCheckboxChange(pref?.key, e?.target?.checked)}
              />
            ))}
          </div>
        </CheckboxGroup>
      </div>
      <div className="pt-4 border-t border-border">
        <Select
          label="Preferred Language"
          description="Choose your preferred language for notifications and interface"
          options={preferredLanguageOptions}
          value={formData?.preferredLanguage}
          onChange={(value) => onSelectChange('preferredLanguage', value)}
          required
        />
      </div>
      <div className="pt-4">
        <Checkbox
          label="I agree to the Terms of Service and Privacy Policy"
          description="By creating an account, you agree to our terms and data handling practices"
          checked={formData?.agreeToTerms}
          onChange={(e) => onCheckboxChange('agreeToTerms', e?.target?.checked)}
          error={errors?.agreeToTerms}
          required
        />
      </div>
    </div>
  );
};

export default TravelPreferencesStep;
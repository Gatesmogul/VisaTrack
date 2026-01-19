import React from 'react';
import Input from '../../../components/ui/Input';

const PersonalInfoStep = ({ formData, errors, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          type="text"
          name="firstName"
          placeholder="Enter your first name"
          value={formData?.firstName}
          onChange={onChange}
          error={errors?.firstName}
          required
        />
        <Input
          label="Last Name"
          type="text"
          name="lastName"
          placeholder="Enter your last name"
          value={formData?.lastName}
          onChange={onChange}
          error={errors?.lastName}
          required
        />
      </div>
      <Input
        label="Email Address"
        type="email"
        name="email"
        placeholder="your.email@example.com"
        description="We'll use this for account notifications and visa alerts"
        value={formData?.email}
        onChange={onChange}
        error={errors?.email}
        required
      />
      <Input
        label="Password"
        type="password"
        name="password"
        placeholder="Create a strong password"
        description="Minimum 8 characters with letters and numbers"
        value={formData?.password}
        onChange={onChange}
        error={errors?.password}
        required
        minLength={8}
      />
      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        placeholder="Re-enter your password"
        value={formData?.confirmPassword}
        onChange={onChange}
        error={errors?.confirmPassword}
        required
      />
      <Input
        label="Phone Number (Optional)"
        type="tel"
        name="phone"
        placeholder="+1 (555) 000-0000"
        description="For urgent visa deadline reminders via SMS"
        value={formData?.phone}
        onChange={onChange}
      />
    </div>
  );
};

export default PersonalInfoStep;
// DATA SOURCE: useAuth.register -> POST /api/v1/auth/register (via Firebase + Backend sync)
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationsContext';
import { useToast } from '../../contexts/ToastContext';
import PassportDetailsStep from './components/PassportDetailsStep';
import PersonalInfoStep from './components/PersonalInfoStep';
import RegistrationProgress from './components/RegistrationProgress';
import SocialLoginOptions from './components/SocialLoginOptions';
import TravelPreferencesStep from './components/TravelPreferencesStep';
import TrustSignals from './components/TrustSignals';

const UserRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { preferences, updatePreferences } = useNotifications();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState(() => ({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    primaryPassport: '',
    passportNumber: '',
    passportExpiry: '',
    hasMultiplePassports: false,
    secondaryPassport: '',
    frequentTravelerProgram: '',
    travelPurposes: [],
    emailNotifications: preferences?.emailNotifications ?? true,
    smsNotifications: preferences?.smsNotifications ?? false,
    policyUpdates: preferences?.policyUpdates ?? true,
    travelTips: preferences?.travelTips ?? false,
    preferredLanguage: preferences?.preferredLanguage ?? 'en',
    agreeToTerms: false
  }));

  const totalSteps = 3;

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData?.firstName?.trim()) newErrors.firstName = 'First name is required';
      if (!formData?.lastName?.trim()) newErrors.lastName = 'Last name is required';
      if (!formData?.email?.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData?.password) {
        newErrors.password = 'Password is required';
      } else if (formData?.password?.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (formData?.password !== formData?.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (step === 2) {
      if (!formData?.primaryPassport) {
        newErrors.primaryPassport = 'Please select your passport country';
      }
    }

    if (step === 3) {
      if (formData?.travelPurposes?.length === 0) {
        newErrors.travelPurposes = 'Please select at least one travel purpose';
      }
      if (!formData?.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the terms to continue';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    setIsLoading(true);

    try {
      // Sync notification preferences into NotificationsContext so user settings persist across the app
      try {
        updatePreferences({
          emailNotifications: !!formData?.emailNotifications,
          smsNotifications: !!formData?.smsNotifications,
          policyUpdates: !!formData?.policyUpdates,
          travelTips: !!formData?.travelTips,
          preferredLanguage: formData?.preferredLanguage || 'en',
        });
      } catch (e) {
        // ignore
      }

      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const passports = [{ country: formData.primaryPassport, number: formData.passportNumber, expiry: formData.passportExpiry }];

      await register({ name: fullName, email: formData.email, password: formData.password, phone: formData.phone, passports }, true);

      showToast({ message: 'Account created and signed in', type: 'success' });
      setIsLoading(false);
      navigate('/trip-planning-dashboard');
    } catch (e) {
      setIsLoading(false);
      showToast({ message: e?.message || 'Registration failed', type: 'error' });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
          />
        );
      case 2:
        return (
          <PassportDetailsStep
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
            onCheckboxChange={handleCheckboxChange}
            onSelectChange={handleSelectChange}
          />
        );
      case 3:
        return (
          <TravelPreferencesStep
            formData={formData}
            errors={errors}
            onCheckboxChange={handleCheckboxChange}
            onSelectChange={handleSelectChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 lg:mb-12">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center transition-smooth group-hover:bg-primary/20">
                <Icon name="Plane" size={28} color="var(--color-primary)" />
              </div>
              <span className="text-2xl font-heading font-bold text-foreground">VisaTrack</span>
            </Link>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
              Create Your Travel Account
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of travelers who successfully navigate visa requirements with confidence
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg shadow-elevation-2 p-6 md:p-8">
                <RegistrationProgress currentStep={currentStep} totalSteps={totalSteps} />

                <form onSubmit={handleSubmit}>
                  {renderStepContent()}

                  <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-border">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleBack}
                        iconName="ChevronLeft"
                        iconPosition="left"
                        className="sm:w-auto"
                      >
                        Back
                      </Button>
                    )}
                    
                    {currentStep < totalSteps ? (
                      <Button
                        type="button"
                        onClick={handleNext}
                        iconName="ChevronRight"
                        iconPosition="right"
                        fullWidth
                        className="sm:ml-auto"
                      >
                        Continue
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        loading={isLoading}
                        iconName="Check"
                        iconPosition="right"
                        fullWidth
                        className="sm:ml-auto"
                      >
                        Create Account
                      </Button>
                    )}
                  </div>
                </form>

                {currentStep === 1 && (
                  <div className="mt-6">
                    <SocialLoginOptions />
                  </div>
                )}

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link to="/user-login" className="text-primary hover:underline font-medium">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg shadow-elevation-2 p-6 sticky top-6">
                <TrustSignals />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;

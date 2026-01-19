// DATA SOURCE: useAuth.login -> POST /api/v1/auth/login (via Firebase)
// DATA SOURCE: useAuth.register -> POST /api/v1/auth/register (via Firebase + Backend sync)
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import BenefitsSection from './components/BenefitsSection';
import LoginForm from './components/LoginForm';

const UserLogin = () => {
  return (
    <>
      <Helmet>
        <title>Sign In - VisaTrack | Access Your Visa Planning Dashboard</title>
        <meta
          name="description"
          content="Sign in to VisaTrack to access your personalized visa tracking dashboard, manage applications, and plan your international travel with confidence."
        />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-start max-w-7xl mx-auto">
            <div className="order-2 lg:order-1">
              <div className="lg:sticky lg:top-24">
                <BenefitsSection />
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <LoginForm />
            </div>
          </div>
        </main>

        <footer className="border-t border-border bg-card mt-12 md:mt-16 lg:mt-20">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground text-center md:text-left">
                &copy; {new Date()?.getFullYear()} VisaTrack. All rights reserved.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
                <a
                  href="/privacy-policy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms-of-service"
                  className="text-sm text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Terms of Service
                </a>
                <a
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default UserLogin;

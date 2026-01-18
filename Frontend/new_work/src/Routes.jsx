import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import UserLogin from './pages/user-login';
import EmbassyFinder from './pages/embassy-finder';
import UserRegistration from './pages/user-registration';
import VisaRequirementsLookup from './pages/visa-requirements-lookup';
import CommunityPage from './pages/community';
import ApplicationTracking from './pages/application-tracking';
import TripPlanningDashboard from './pages/trip-planning-dashboard';
import NotificationsPage from './pages/notifications';
import ProfileSettings from './pages/profile';
import { useAuth } from './contexts/AuthContext';

const Routes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<VisaRequirementsLookup />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/embassy-finder" element={<EmbassyFinder />} />
        <Route path="/user-registration" element={<UserRegistration />} />
        <Route path="/visa-requirements-lookup" element={<VisaRequirementsLookup />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/application-tracking" element={isAuthenticated ? <ApplicationTracking /> : <Navigate to="/user-login" replace />} />
        <Route path="/trip-planning-dashboard" element={isAuthenticated ? <TripPlanningDashboard /> : <Navigate to="/user-login" replace />} />
        <Route path="/notifications" element={isAuthenticated ? <NotificationsPage /> : <Navigate to="/user-login" replace />} />
        <Route path="/profile" element={isAuthenticated ? <ProfileSettings /> : <Navigate to="/user-login" replace />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;

import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { assessTrips } from '../../../utils/feasibility';
import FullTimelineModal from './FullTimelineModal';

const TimelinePanel = ({ trips }) => {
  const getAllDeadlines = () => {
    const deadlines = [];

    trips?.forEach(trip => {
      const daysUntilDeparture = Math.ceil((new Date(trip.departureDate) - new Date()) / (1000 * 60 * 60 * 24));

      trip?.destinations?.forEach(destination => {
        if (destination?.visaStatus === 'not_started' || destination?.visaStatus === 'pending') {
          const recommendedStartDays = destination?.visaStatus === 'not_started' ? 60 : 30;
          const deadlineDate = new Date(trip.departureDate);
          deadlineDate?.setDate(deadlineDate?.getDate() - recommendedStartDays);

          deadlines?.push({
            tripName: trip?.name,
            country: destination?.country,
            flag: destination?.flag,
            type: destination?.visaStatus === 'not_started' ? 'start_application' : 'submit_documents',
            date: deadlineDate,
            daysLeft: Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24)),
            urgency: daysUntilDeparture <= 30 ? 'high' : daysUntilDeparture <= 60 ? 'medium' : 'low'
          });
        }
      });
    });

    return deadlines?.sort((a, b) => a?.date - b?.date)?.slice(0, 5);
  };

  const deadlines = getAllDeadlines();
  const assessments = assessTrips(trips);
  const [showFullTimeline, setShowFullTimeline] = useState(false);

  // Map deadlines to include feasibility status for the specific country/trip
  const deadlinesWithFeasibility = deadlines?.map((d) => {
    const tripAssessment = assessments?.find((a) => a.tripName === d.tripName);
    const dest = tripAssessment?.perDestination?.find((p) => p.country === d.country);
    return { ...d, feasibility: dest?.status || 'feasible', feasibilityReason: dest?.reason || '' };
  });

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high':
        return 'bg-error/10 border-error/20 text-error';
      case 'medium':
        return 'bg-warning/10 border-warning/20 text-warning';
      default:
        return 'bg-primary/10 border-primary/20 text-primary';
    }
  };

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case 'high':
        return 'AlertCircle';
      case 'medium':
        return 'Clock';
      default:
        return 'Info';
    }
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (deadlines?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-elevation-2 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Calendar" size={20} color="var(--color-primary)" />
          </div>
          <h2 className="text-lg md:text-xl font-heading font-semibold text-card-foreground">Timeline & Deadlines</h2>
        </div>

        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="CheckCircle" size={32} className="text-success" />
          </div>
          <p className="text-muted-foreground">No upcoming deadlines. All visa applications are on track!</p>
        </div>
      </div>
    );
  }

  // Determine if any trip is impossible or marginal and show a summary banner
  const impossibleTrips = assessments?.filter((a) => a.status === 'impossible');
  const marginalTrips = assessments?.filter((a) => a.status === 'marginal');

  const renderAssessmentBanner = () => {
    if (impossibleTrips?.length) {
      return (
        <div className="mb-4 p-3 rounded-md bg-error/10 border border-error/20 text-error text-sm">
          <strong className="font-medium">Attention:</strong> The following trips have impossible timelines: {impossibleTrips.map((t) => t.tripName).join(', ')}. Consider revising travel dates or expediting visas.
        </div>
      );
    }

    if (marginalTrips?.length) {
      return (
        <div className="mb-4 p-3 rounded-md bg-warning/10 border border-warning/20 text-warning text-sm">
          <strong className="font-medium">Warning:</strong> Some trips have tight timelines: {marginalTrips.map((t) => t.tripName).join(', ')}. Start as soon as possible.
        </div>
      );
    }

    return null;
  };


  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-2 p-4 md:p-6">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Calendar" size={20} color="var(--color-primary)" />
        </div>
        <h2 className="text-lg md:text-xl font-heading font-semibold text-card-foreground">Timeline & Deadlines</h2>
      </div>
      {renderAssessmentBanner()}
      <div className="space-y-3">
        {deadlinesWithFeasibility?.map((deadline, index) => (
          <div
            key={index}
            className={`p-3 md:p-4 border rounded-lg transition-smooth hover:shadow-elevation-1 ${getUrgencyColor(deadline?.urgency)}`}
            title={deadline?.feasibilityReason}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <Icon name={getUrgencyIcon(deadline?.urgency)} size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg flex-shrink-0">{deadline?.flag}</span>
                  <p className="font-medium text-sm md:text-base truncate">{deadline?.country}</p>
                  {deadline?.feasibility === 'impossible' && (
                    <span className="ml-2 text-xs text-error bg-error/10 px-2 py-0.5 rounded">Impossible</span>
                  )}
                  {deadline?.feasibility === 'marginal' && (
                    <span className="ml-2 text-xs text-warning bg-warning/10 px-2 py-0.5 rounded">At risk</span>
                  )}
                </div>
                <p className="text-xs md:text-sm opacity-90 mb-2 line-clamp-1">{deadline?.tripName}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-medium">
                    {deadline?.type === 'start_application' ? 'Start Application' : 'Submit Documents'}
                  </span>
                  <span className="opacity-75">•</span>
                  <span>{formatDate(deadline?.date)}</span>
                  <span className="opacity-75">•</span>
                  <span className="font-medium">
                    {deadline?.daysLeft > 0 ? `${deadline?.daysLeft} days left` : 'Overdue'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <button onClick={() => setShowFullTimeline(true)} className="w-full text-sm font-medium text-primary hover:underline">
          View Full Timeline
        </button>
      </div>

      <FullTimelineModal isOpen={showFullTimeline} onClose={() => setShowFullTimeline(false)} assessments={assessments} />
    </div>
  );
};

export default TimelinePanel;
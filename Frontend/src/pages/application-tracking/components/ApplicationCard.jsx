import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ApplicationCard = ({ application, onViewDetails, onUploadDocument }) => {
  const getStatusColor = (status) => {
    const colors = {
      'submitted': 'bg-accent/10 text-accent border-accent/20',
      'under-review': 'bg-primary/10 text-primary border-primary/20',
      'approved': 'bg-success/10 text-success border-success/20',
      'rejected': 'bg-error/10 text-error border-error/20',
      'pending-documents': 'bg-warning/10 text-warning border-warning/20',
      'interview-scheduled': 'bg-primary/10 text-primary border-primary/20'
    };
    return colors?.[status] || 'bg-muted text-muted-foreground border-border';
  };

  const getUrgencyColor = (urgency) => {
    const colors = {
      'critical': 'text-error',
      'high': 'text-warning',
      'medium': 'text-accent',
      'low': 'text-muted-foreground'
    };
    return colors?.[urgency] || 'text-muted-foreground';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysRemaining = (dateString) => {
    const target = new Date(dateString);
    const today = new Date();
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining(application?.expectedDecision);

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 hover:shadow-elevation-2 transition-smooth">
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
        <div className="flex items-start gap-3 md:gap-4 flex-1">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden flex-shrink-0 border border-border">
            <Image
              src={application?.countryFlag}
              alt={application?.countryFlagAlt}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-1 truncate">
                  {application?.destination}
                </h3>
                <p className="text-sm text-muted-foreground">{application?.visaType}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium border whitespace-nowrap ${getStatusColor(application?.status)}`}>
                {application?.statusLabel}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mt-3 md:mt-4">
              <div className="flex items-center gap-2 text-sm">
                <Icon name="Calendar" size={16} className="text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Submitted</p>
                  <p className="text-foreground font-medium">{formatDate(application?.submissionDate)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Icon name="Clock" size={16} className={`flex-shrink-0 ${getUrgencyColor(application?.urgency)}`} />
                <div>
                  <p className="text-xs text-muted-foreground">Expected Decision</p>
                  <p className={`font-medium ${daysRemaining <= 7 ? 'text-error' : daysRemaining <= 14 ? 'text-warning' : 'text-foreground'}`}>
                    {formatDate(application?.expectedDecision)} ({daysRemaining} days)
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 md:mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs md:text-sm text-muted-foreground">Document Completeness</span>
                <span className="text-xs md:text-sm font-medium text-foreground">{application?.documentProgress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-smooth ${
                    application?.documentProgress === 100 ? 'bg-success' :
                    application?.documentProgress >= 75 ? 'bg-primary' :
                    application?.documentProgress >= 50 ? 'bg-accent' : 'bg-warning'
                  }`}
                  style={{ width: `${application?.documentProgress}%` }}
                />
              </div>
            </div>

            {application?.nextAction && (
              <div className="mt-3 md:mt-4 p-3 bg-accent/5 border border-accent/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <Icon name="AlertCircle" size={16} className="text-accent flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-medium text-accent mb-1">Next Action Required</p>
                    <p className="text-xs md:text-sm text-foreground">{application?.nextAction}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-row lg:flex-col gap-2 lg:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(application)}
            iconName="Eye"
            iconPosition="left"
            className="flex-1 lg:flex-none lg:w-full"
          >
            View Details
          </Button>
          {application?.documentProgress < 100 && (
            <Button
              variant="default"
              size="sm"
              onClick={() => onUploadDocument(application)}
              iconName="Upload"
              iconPosition="left"
              className="flex-1 lg:flex-none lg:w-full"
            >
              Upload Docs
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
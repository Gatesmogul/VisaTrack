import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TripCard = ({ trip, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success border-success/20';
      case 'planning':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'completed':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getUrgencyColor = (daysLeft) => {
    if (daysLeft <= 7) return 'bg-error text-error-foreground';
    if (daysLeft <= 14) return 'bg-warning text-warning-foreground';
    return 'bg-primary text-primary-foreground';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysUntilDeparture = (dateString) => {
    const departure = new Date(dateString);
    const today = new Date();
    const diffTime = departure - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysUntilDeparture(trip?.startDate);
  const completedVisas = trip?.destinations?.filter(d => d?.visaStatus === 'approved')?.length;
  const totalVisas = trip?.destinations?.length;
  const progressPercentage = (completedVisas / totalVisas) * 100;

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-2 hover:shadow-elevation-3 transition-smooth overflow-hidden">
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg md:text-xl font-heading font-semibold text-card-foreground mb-2 truncate">
              {trip?.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(trip?.status)}`}>
                {trip?.status?.charAt(0)?.toUpperCase() + trip?.status?.slice(1)}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(daysLeft)}`}>
                {daysLeft > 0 ? `${daysLeft} days left` : 'Departed'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => onEdit(trip)}
              className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-smooth"
              aria-label="Edit trip"
            >
              <Icon name="Edit2" size={18} />
            </button>
            <button
              onClick={() => onDelete(trip?._id || trip?.id)}
              className="p-2 rounded-lg text-muted-foreground hover:bg-error/10 hover:text-error transition-smooth"
              aria-label="Delete trip"
            >
              <Icon name="Trash2" size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-card-foreground">
            <Icon name="Calendar" size={16} className="text-muted-foreground flex-shrink-0" />
            <span className="truncate">{formatDate(trip?.startDate)} - {formatDate(trip?.endDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-card-foreground">
            <Icon name="MapPin" size={16} className="text-muted-foreground flex-shrink-0" />
            <span className="truncate">{trip?.destinations?.map(d => d?.country)?.join(' → ')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-card-foreground">
            <Icon name="Briefcase" size={16} className="text-muted-foreground flex-shrink-0" />
            <span className="capitalize">{trip?.purpose}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-card-foreground">Visa Progress</span>
            <span className="text-sm font-medium text-card-foreground">{completedVisas}/{totalVisas}</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-success transition-smooth"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {trip?.destinations?.map((destination, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-muted rounded-lg"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-xl flex-shrink-0">{destination?.flag}</span>
                <span className="text-sm font-medium text-foreground truncate">{destination?.country}</span>
              </div>
              <div className="flex-shrink-0">
                {destination?.visaStatus === 'approved' && (
                  <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
                    <Icon name="Check" size={12} color="white" />
                  </div>
                )}
                {destination?.visaStatus === 'pending' && (
                  <div className="w-5 h-5 rounded-full bg-warning flex items-center justify-center">
                    <Icon name="Clock" size={12} color="white" />
                  </div>
                )}
                {destination?.visaStatus === 'not_started' && (
                  <div className="w-5 h-5 rounded-full bg-muted-foreground flex items-center justify-center">
                    <Icon name="Circle" size={12} color="white" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {trip?.urgentDeadlines && trip?.urgentDeadlines?.length > 0 && (
          <div className="mb-4 p-3 bg-error/5 border border-error/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Icon name="AlertCircle" size={16} className="text-error flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-error mb-1">Urgent Action Required</p>
                <p className="text-xs text-error/80 line-clamp-2">{trip?.urgentDeadlines?.[0]}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Link to={`/visa-requirements-lookup?trip=${trip?.id}`} className="flex-1 min-w-[140px]">
            <Button variant="outline" fullWidth iconName="Search" iconPosition="left">
              View Requirements
            </Button>
          </Link>
          <Link to={`/application-tracking?trip=${trip?.id}`} className="flex-1 min-w-[140px]">
            <Button variant="default" fullWidth iconName="FileText" iconPosition="left">
              Track Applications
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TripCard;

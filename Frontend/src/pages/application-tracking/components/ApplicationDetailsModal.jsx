import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import FileUploader from '../../../components/ui/FileUploader';

const ApplicationDetailsModal = ({ application, onClose, onAddDocument, onDeleteDocument }) => {
  if (!application) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const getStatusIcon = (status) => {
    const icons = {
      'submitted': 'Send',
      'under-review': 'Eye',
      'approved': 'CheckCircle',
      'rejected': 'XCircle',
      'pending-documents': 'FileText',
      'interview-scheduled': 'Calendar'
    };
    return icons?.[status] || 'Info';
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-300 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-elevation-5 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden flex-shrink-0 border border-border">
              <Image
                src={application?.countryFlag}
                alt={application?.countryFlagAlt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground truncate">
                {application?.destination} Visa Application
              </h2>
              <p className="text-sm md:text-base text-muted-foreground">{application?.visaType}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-smooth flex-shrink-0 ml-2"
            aria-label="Close modal"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-3 md:mb-4">Application Status</h3>
                <div className="space-y-3">
                  {application?.timeline?.map((event, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        event?.completed ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        <Icon name={event?.completed ? 'Check' : getStatusIcon(event?.status)} size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm md:text-base font-medium ${event?.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {event?.title}
                        </p>
                        <p className="text-xs md:text-sm text-muted-foreground">{formatDate(event?.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-3 md:mb-4">Application Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm md:text-base text-muted-foreground">Application ID</span>
                    <span className="text-sm md:text-base font-medium text-foreground">{application?.applicationId}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm md:text-base text-muted-foreground">Submission Date</span>
                    <span className="text-sm md:text-base font-medium text-foreground">{formatDate(application?.submissionDate)}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm md:text-base text-muted-foreground">Processing Time</span>
                    <span className="text-sm md:text-base font-medium text-foreground">{application?.processingTime}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm md:text-base text-muted-foreground">Application Fee</span>
                    <span className="text-sm md:text-base font-medium text-foreground">{application?.fee}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-3 md:mb-4">Uploaded Documents</h3>
                <div className="space-y-3">
                <FileUploader onUploadComplete={(file) => onAddDocument && onAddDocument(file)} onUploadError={(info)=>{ /* optionally handle upload errors */ }} />
                <div className="space-y-2">
                  {application?.uploadedDocuments?.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Icon name="FileText" size={16} className="text-primary flex-shrink-0" />
                        <span className="text-sm md:text-base text-foreground truncate">{doc?.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {doc?.url && (
                          <a href={doc?.url} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:underline">View</a>
                        )}
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${doc?.name}"? This cannot be undone.`)) {
                              onDeleteDocument && onDeleteDocument(doc?.name);
                            }
                          }}
                          className="text-sm text-error hover:underline"
                        >
                          Delete
                        </button>
                        <Icon name="CheckCircle" size={16} className="text-success flex-shrink-0 ml-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              </div>

              {application?.appointmentDetails && (
                <div>
                  <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-3 md:mb-4">Appointment Details</h3>
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-3">
                    <div className="flex items-center gap-2">
                      <Icon name="Calendar" size={16} className="text-primary flex-shrink-0" />
                      <span className="text-sm md:text-base text-foreground">{formatDate(application?.appointmentDetails?.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Clock" size={16} className="text-primary flex-shrink-0" />
                      <span className="text-sm md:text-base text-foreground">{application?.appointmentDetails?.time}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Icon name="MapPin" size={16} className="text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base text-foreground">{application?.appointmentDetails?.location}</span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-3 md:mb-4">Contact Information</h3>
                <div className="space-y-2">
                  <a
                    href={`mailto:${application?.embassyContact?.email}`}
                    className="flex items-center gap-2 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-smooth"
                  >
                    <Icon name="Mail" size={16} className="text-primary flex-shrink-0" />
                    <span className="text-sm md:text-base text-foreground truncate">{application?.embassyContact?.email}</span>
                  </a>
                  <a
                    href={`tel:${application?.embassyContact?.phone}`}
                    className="flex items-center gap-2 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-smooth"
                  >
                    <Icon name="Phone" size={16} className="text-primary flex-shrink-0" />
                    <span className="text-sm md:text-base text-foreground">{application?.embassyContact?.phone}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 p-4 md:p-6 border-t border-border">
          <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
            Close
          </Button>
          <Button variant="default" iconName="Download" iconPosition="left" className="flex-1 sm:flex-none">
            Download Receipt
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsModal;
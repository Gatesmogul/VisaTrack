import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const RequirementDetails = ({ requirements }) => {
  const [expandedSections, setExpandedSections] = useState({
    documents: true,
    processing: false,
    costs: false,
    restrictions: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const sections = [
    {
      id: 'documents',
      title: 'Required Documents',
      icon: 'FileText',
      items: requirements?.documents
    },
    {
      id: 'processing',
      title: 'Processing Times',
      icon: 'Clock',
      items: requirements?.processing
    },
    {
      id: 'costs',
      title: 'Fees & Costs',
      icon: 'DollarSign',
      items: requirements?.costs
    },
    {
      id: 'restrictions',
      title: 'Entry Restrictions',
      icon: 'AlertCircle',
      items: requirements?.restrictions
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-elevation-2">
      <div className="bg-muted px-4 md:px-6 py-4 border-b border-border">
        <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground">Detailed Requirements</h3>
      </div>
      <div className="divide-y divide-border">
        {sections?.map((section) => (
          <div key={section?.id}>
            <button
              onClick={() => toggleSection(section?.id)}
              className="w-full px-4 md:px-6 py-4 flex items-center justify-between hover:bg-muted transition-smooth"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={section?.icon} size={20} color="var(--color-primary)" />
                </div>
                <span className="font-medium text-foreground text-left">{section?.title}</span>
              </div>
              <Icon
                name="ChevronDown"
                size={20}
                className={`text-muted-foreground transition-smooth ${
                  expandedSections?.[section?.id] ? 'rotate-180' : ''
                }`}
              />
            </button>

            {expandedSections?.[section?.id] && (
              <div className="px-4 md:px-6 pb-4">
                <ul className="space-y-3">
                  {section?.items?.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm md:text-base text-foreground">
                      <Icon name="Check" size={16} className="text-success flex-shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequirementDetails;
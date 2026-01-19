import React from 'react';
import EmbassyCard from './EmbassyCard';
import Icon from '../../../components/AppIcon';

const EmbassyList = ({ embassies, selectedEmbassy, onEmbassySelect, onGetDirections, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 md:py-16">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-muted-foreground">Searching for embassies...</p>
      </div>
    );
  }

  if (embassies?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 md:py-16 text-center">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-muted rounded-full flex items-center justify-center mb-4">
          <Icon name="MapPin" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-2">
          No Embassies Found
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Try adjusting your search filters or expanding the search radius to find more results.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground">
          Results ({embassies?.length})
        </h2>
      </div>
      {embassies?.map((embassy) => (
        <EmbassyCard
          key={embassy?.id}
          embassy={embassy}
          isSelected={selectedEmbassy?.id === embassy?.id}
          onSelect={onEmbassySelect}
          onGetDirections={onGetDirections}
        />
      ))}
    </div>
  );
};

export default EmbassyList;
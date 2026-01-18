import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MapView = ({ embassies, selectedEmbassy, onEmbassySelect, userLocation, searchRadius }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 });
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation);
    } else if (embassies?.length > 0) {
      setMapCenter({ lat: embassies?.[0]?.lat, lng: embassies?.[0]?.lng });
    }
  }, [userLocation, embassies]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 1, 8));
  };

  const handleRecenter = () => {
    if (userLocation) {
      setMapCenter(userLocation);
      setZoom(12);
    }
  };

  return (
    <div className="relative w-full h-full bg-muted rounded-lg overflow-hidden">
      <iframe
        width="100%"
        height="100%"
        loading="lazy"
        title="Embassy Locations Map"
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps?q=${mapCenter?.lat},${mapCenter?.lng}&z=${zoom}&output=embed`}
        className="w-full h-full"
      />
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <Button
          variant="default"
          size="icon"
          onClick={handleZoomIn}
          className="bg-card shadow-elevation-3"
          aria-label="Zoom in"
        >
          <Icon name="Plus" size={20} />
        </Button>
        <Button
          variant="default"
          size="icon"
          onClick={handleZoomOut}
          className="bg-card shadow-elevation-3"
          aria-label="Zoom out"
        >
          <Icon name="Minus" size={20} />
        </Button>
        {userLocation && (
          <Button
            variant="default"
            size="icon"
            onClick={handleRecenter}
            className="bg-card shadow-elevation-3"
            aria-label="Recenter map"
          >
            <Icon name="Locate" size={20} />
          </Button>
        )}
      </div>
      <div className="absolute bottom-4 left-4 right-4 bg-card rounded-lg shadow-elevation-3 p-3 z-10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Icon name="MapPin" size={16} color="var(--color-primary)" />
            <span className="text-sm font-medium text-foreground">
              {embassies?.length} {embassies?.length === 1 ? 'embassy' : 'embassies'} found
            </span>
          </div>
          {searchRadius && (
            <span className="text-xs text-muted-foreground">
              Within {searchRadius} km
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapView;
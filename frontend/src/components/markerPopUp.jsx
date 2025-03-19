import React from 'react';
import { InfoWindow } from '@react-google-maps/api';

function MarkerInfo({ selectedMarker, newMarker, setSelectedMarker, calculateDistance }) {
  const isExistingMarker = selectedMarker && newMarker && selectedMarker.name !== newMarker.name;
  console.log({ selectedMarker, newMarker, setSelectedMarker, calculateDistance });

  return (
    <InfoWindow 
      position={selectedMarker.location} 
      onCloseClick={() => setSelectedMarker(null)}
    >
      <div className='info-window
      '>
        <h2>{selectedMarker.name}</h2>
        <p>Location: {selectedMarker.location.lat.toFixed(6)}, {selectedMarker.location.lng.toFixed(6)}</p>
        
        {isExistingMarker && (
          <p>
            Distance from search location: {calculateDistance(newMarker.location, selectedMarker.location)} km
          </p>
        )}
      </div>
    </InfoWindow>
  );
}

export { MarkerInfo };

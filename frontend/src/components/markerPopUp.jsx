import { InfoWindow } from '@react-google-maps/api';
import car from "../assets/Images/parking.svg"

function MarkerInfo({ selectedMarker, newMarker, setSelectedMarker, calculateDistance }) {
  const isExistingMarker = selectedMarker && newMarker && selectedMarker.name !== newMarker.name;
  console.log({ selectedMarker, newMarker, setSelectedMarker, calculateDistance });

  return (
    <InfoWindow 
      position={selectedMarker.location} 
      onCloseClick={() => setSelectedMarker(null)}
    >
      <div className='info-window'>
        <h2>{selectedMarker.name}</h2>
        {/* <p>Location: {selectedMarker.location.lat.toFixed(6)}, {selectedMarker.location.lng.toFixed(6)}</p> */}
        <p>Rs 20 per hour</p>
        <p >Open closes 9:00 pm </p>
        {isExistingMarker && (
          <p>
       {calculateDistance(newMarker.location, selectedMarker.location)} km
          </p>
        )}

<div className="info-section">
          <p>
            <img src="https://example.com/walking-man-icon.png" alt="Walking Man" /> 
            Walking Distance: {calculateDistance(newMarker.location, selectedMarker.location)} km
          </p>
          <p>
            <img src="" alt="Clock" /> 
            {/* Timing: {selectedMarker.timing} */} Timing: 10 
          </p>
          <p>
            <img src='../' alt="Price" /> 
            {/* Price: {selectedMarker.price} */} Price : 20 rs
          </p>
        </div>
        
      </div>
    </InfoWindow>
  );
}

export { MarkerInfo };

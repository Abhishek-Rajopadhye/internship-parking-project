import React, { useState, useRef } from 'react';
import { GoogleMap, Marker, useJsApiLoader, InfoWindow } from '@react-google-maps/api';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import MarkerInfo from "./markerPopUp"

function Map() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyC_WDLc0-lq4i-vBsGcL0EEoyLVyN5LKa0',
    libraries: ['places', 'geometry'] // Added geometry library for distance calculation
  });

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [address, setAddress] = useState("");
  const [newMarker, setNewMarker] = useState(null);
  const mapRef = useRef(null);

  const containerStyle = {
    width: '90vw',
    height: '70vh',
  };

  const mapStyles = {
    width: '80%',
    height: '80%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color:"red"
};


  const center = {
    lat: 18.519584,
    lng: 73.855421,
  };


  const markers = [
    { name: "The Mint", location: { lat: 18.559322, lng: 73.792407 } },
    { name: "Fergusson College", location: { lat: 18.522845, lng: 73.838968 } },
    { name: "Home ", location: { lat: 18.530790, lng: 73.823251 } }
  ];

  // Calculate distance between two points
  const calculateDistance = (origin, destination) => {
    if (!window.google) return null;

    const originLatLng = new window.google.maps.LatLng(
      origin.lat,
      origin.lng
    );

    const destinationLatLng = new window.google.maps.LatLng(
      destination.lat,
      destination.lng
    );

    // Distance in meters
    const distanceInMeters = window.google.maps.geometry.spherical.computeDistanceBetween(
      originLatLng,
      destinationLatLng
    );

    // Convert to kilometers with 2 decimal places
    return (distanceInMeters / 1000).toFixed(2);
  };

  const handleSelect = async (selectedAddress) => {
    setAddress(selectedAddress);

    try {
      const results = await geocodeByAddress(selectedAddress);
      const latLng = await getLatLng(results[0]);

      // Set the new marker at the selected address location
      const newSearchMarker = {
        name: selectedAddress,
        location: latLng
      };

      setNewMarker(newSearchMarker);
      setSelectedMarker(newSearchMarker);

      if (mapRef.current) {
        mapRef.current.panTo(latLng); // Move map to new location
        mapRef.current.setZoom(15); // Zoom in to the location
      }

    } catch (error) {
      console.error("Error fetching location details: ", error);
    }
  };

  return (
    <>
      {isLoaded && (
        <>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div style={{ padding: '10px', backgroundColor: 'black',color:'red' }}>
            <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div>
                  <input
                    {...getInputProps({
                      placeholder: "Enter an address...",
                      className: "autocomplete-input"
                    })}
                  />
                  <div className="autocomplete-dropdown">
                    {loading && <div>Loading...</div>}
                    {suggestions.map(suggestion => (
                      <div
                        key={suggestion.placeId}
                        {...getSuggestionItemProps(suggestion)}
                        className="suggestion-item"
                      >
                        {suggestion.description}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </PlacesAutocomplete>
          </div>
    
          <GoogleMap
            mapContainerStyle={mapStyles}
            center={center}
            zoom={10}
            onLoad={map => (mapRef.current = map)}
          >
            {/* Render Existing Markers */}
            {markers.map(marker => (
              <Marker
                key={marker.name}
                position={marker.location}
                onClick={() => setSelectedMarker(marker)}
              />
            ))}

            {/* Render New Marker from Autocomplete */}
            {newMarker && (
              <Marker
                position={newMarker.location}
                onClick={() => setSelectedMarker(newMarker)}
              />
            )}
            {/* InfoWindow for Selected Marker */}
            {/* {selectedMarker && (
              <InfoWindow position={selectedMarker.location} onCloseClick={() => setSelectedMarker(null)}>
                <div style={{ color: "black" }}>
                  <h2>{selectedMarker.name}</h2>
                  <p>Location: {selectedMarker.location.lat.toFixed(6)}, {selectedMarker.location.lng.toFixed(6)}</p>
                  {markers.some(m => m.name === selectedMarker.name) && newMarker && (
                    <p>Distance from search location: {calculateDistance(newMarker.location, selectedMarker.location)} km</p>
                  )}
                </div>
              </InfoWindow>
            )} */}
            {selectedMarker && (
              <MarkerInfo
                selectedMarker={selectedMarker}
                newMarker={newMarker}
                setSelectedMarker={setSelectedMarker}
                calculateDistance={calculateDistance}
              />
            )}
          </GoogleMap>
          </div>
          
        </>
      )}
    </>
  );
}

export default Map;
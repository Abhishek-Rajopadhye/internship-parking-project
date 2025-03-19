import { useState } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

function SearchBar({ setNewMarker, markers, setDistances }) {
  const [address, setAddress] = useState("");

  const calculateDistance = (origin, destination) => {
    if (!window.google) return null;

    const originLatLng = new window.google.maps.LatLng(origin.lat, origin.lng);
    const destinationLatLng = new window.google.maps.LatLng(destination.lat, destination.lng);

    const distanceInMeters = window.google.maps.geometry.spherical.computeDistanceBetween(
      originLatLng,
      destinationLatLng
    );

    return (distanceInMeters / 1000).toFixed(2);
  };

  const handleSelect = async (selectedAddress) => {
    setAddress(selectedAddress);

    try {
      const results = await geocodeByAddress(selectedAddress);
      const latLng = await getLatLng(results[0]);

      const newSearchMarker = { name: selectedAddress, location: latLng };
      
      setNewMarker(newSearchMarker);

      if (window.google) {
        const newDistances = {};
        markers.forEach(marker => {
          const distance = calculateDistance(latLng, marker.location);
          newDistances[marker.name] = distance;
        });
        setDistances(newDistances);
      }
    } catch (error) {
      console.error("Error fetching location details: ", error);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input {...getInputProps({ placeholder: "Enter an address..." })} />
            <div>
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => (
                <div key={suggestion.placeId} {...getSuggestionItemProps(suggestion)}>
                  {suggestion.description}
                </div>
              ))}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    </div>
  );
}

export { SearchBar };

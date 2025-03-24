import { useState } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";

const SearchBar = ({ setNewMarker, setSelectedMarker, mapRef }) => {
  const [address, setAddress] = useState("");

  const handleSelect = async (selectedAddress) => {
    setAddress(selectedAddress);

    try {
      const results = await geocodeByAddress(selectedAddress);
      const latLng = await getLatLng(results[0]);

      const newSearchMarker = {
        name: selectedAddress,
        location: latLng
      };

      setNewMarker(newSearchMarker);
      setSelectedMarker(newSearchMarker)

      if (mapRef.current) {
        mapRef.current.panTo(latLng);
        mapRef.current.setZoom(15);
      }
    } catch (error) {
      console.error("Error fetching location details: ", error);
    }
  };

  return (
    <div className="search-bar-container">
      <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input {...getInputProps({ placeholder: "Enter an address..." })} />
            <div className="autocomplete-dropdown">
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

export default  SearchBar ;


import { StandaloneSearchBox } from "@react-google-maps/api";
import { useRef, useState } from "react";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { FaTimes, FaFilter, FaRupeeSign } from 'react-icons/fa';
import { GiPathDistance } from "react-icons/gi";
import { MdOutlineDateRange } from "react-icons/md";
import * as React from 'react';

 




const SearchBar = ({ setNewMarker, setSelectedMarker, mapRef }) => {
    const searchBoxRef = useRef(null);
    const [address, setAddress] = useState("");
    const [showFilter, setShowFilter] = useState(false);


    const onPlacesChanged = async () => {
        const places = searchBoxRef.current.getPlaces();
        if (places.length === 0) return;

        const place = places[0];

        setAddress(place.formatted_address);
        const results = await geocodeByAddress(place.formatted_address);
        const latLng = await getLatLng(results[0]);

        const newSearchMarker = {
            name: place.formatted_address,
            location: latLng
        };

        setNewMarker(newSearchMarker);
        setSelectedMarker(newSearchMarker);

        if (mapRef.current) {
            mapRef.current.panTo(latLng);
            mapRef.current.setZoom(14);
            mapRef.current.center(latLng);
        }
    };

    // Function to clear the search input
    const clearInput = () => {
        setAddress("");
        setNewMarker(null);
        setSelectedMarker(null);
    }
    const handleFilter = () => {
        setShowFilter(prev => !prev)
    }


    return (
        <div style={{ marginBottom: '20px', textAlign: 'center', position: 'relative', display: 'inline-block' }}>
            <StandaloneSearchBox
                onLoad={(ref) => (searchBoxRef.current = ref)}
                onPlacesChanged={onPlacesChanged}
            >
               <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
  <input
    type="text"
    placeholder="Enter text"
    value={address}
    onChange={(e) => setAddress(e.target.value)}
    style={{
      width: '300px',
      height: '40px',
      padding: '8px 40px 8px 12px', // Adjusted padding for icons
      borderRadius: '8px',
      border: '1px solid #ccc',
      backgroundColor: '#fff',
      color: '#333', // Darker text color for better readability
      fontSize: '16px', // Slightly larger font size
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
      outline: 'none', // Remove default outline on focus
    }}
  />
  {address && (
    <FaTimes
      onClick={clearInput}
      style={{
        position: 'absolute',
        right: '40px',
        cursor: 'pointer',
        color: '#888',
        fontSize: '18px', // Slightly larger icon
      }}
    />
  )}
  <FaFilter
    onClick={handleFilter}
    style={{
      position: 'absolute',
      right: '10px',
      cursor: 'pointer',
      color: '#888',
      fontSize: '18px', // Slightly larger icon
    }}
  />
</div>
            </StandaloneSearchBox>

            {showFilter && (
                <div style={{
                    position: 'absolute',
                    top: '45px',
                    right: '0',
                    width: '50%',
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '10px',
                    zIndex: 999,
                }}>

                    <FaRupeeSign
                        style={{
                            position: 'absolute',
                            left: '10px',
                            color: 'black',
                        }}


                    />
                    <br></br>
                    <GiPathDistance
                        style={{
                            position: 'absolute',
                            left: '10px',
                            color: 'black',
                        }}
                    />
                    <br></br>
                    <MdOutlineDateRange style={{
                        position: 'absolute',
                        left: '10px',
                        color: 'black',
                    }} />
                    <br />
                    <button
                        style={{
                            marginTop: '10px',
                            padding: '5px 10px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                        onClick={() => setShowFilters(false)}
                    >
                        Apply Filters
                    </button>
                </div>
            )}
        </div>
    );
}

export default SearchBar
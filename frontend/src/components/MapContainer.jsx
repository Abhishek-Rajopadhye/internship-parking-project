import { useState, useRef, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';
import SearchBar2 from './SearchBar2';
import MarkerComponent from './MarkerComponent';
import InfoWindowComponent from './InfoWindowComponent';



function MapContainer() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyC_WDLc0-lq4i-vBsGcL0EEoyLVyN5LKa0',
    libraries: ['places', 'geometry'] // Added geometry library for distance calculation
  });

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [newMarker, setNewMarker] = useState(null);
  const [markers, setMarkers] = useState([])
  const mapRef = useRef(null);

  const mapStyles = {
    featureType: 'all',
      elementType: 'all',
    width: '90%',
    height: '90vh',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };


  const center = {
    lat: 18.519584,
    lng: 73.855421,
  };


  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/getparkingspot");
        setMarkers(response.data);

      } catch (error) {
        console.error("Error fetching markers", error);
      }
    };
    fetchMarkers();
  }, []);

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

  return (
    <div className='map-container' >
    
      {isLoaded && (
        <>
            <div style={{
            position: 'fixed',
            top: '8%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            alignContent:center,
          }}>
              <SearchBar2
                setNewMarker={setNewMarker}
                setSelectedMarker={setSelectedMarker}
                mapRef={mapRef}
                
              />

            </div>

          
          <GoogleMap
            mapContainerStyle={mapStyles}
            center={center}
            zoom={10}
            onLoad={map => (mapRef.current = map)}
          >

            {markers.map(marker => (
              <MarkerComponent
              key={marker.spot_id || marker.location}
                marker={marker}
                setSelectedMarker={setSelectedMarker}
              />
            ))}

            {selectedMarker && (
              <InfoWindowComponent
                selectedMarker={selectedMarker}
                newMarker={newMarker}
                setSelectedMarker={setSelectedMarker}
                calculateDistance={calculateDistance}
              />
            )}
          </GoogleMap>

        </>
      )}
    </div>
  );
}


export default MapContainer;
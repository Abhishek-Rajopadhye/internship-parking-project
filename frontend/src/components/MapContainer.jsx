import { useEffect } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';
import MarkerComponent from './MarkerComponent';
import InfoWindowComponent from './InfoWindowComponent';

function MapContainer({selectedMarker, setSelectedMarker, newMarker, markers, setMarkers, mapRef}) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ['places', 'geometry'] // Added geometry library for distance calculation
    });

    const mapStyles = {
        display: 'flex',
        featureType: 'all',
        elementType: 'all',
        width: '90vw',
        height: '85vh',
        position: "fixed",
        top:50,
        left:-300
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
    }, [setMarkers]);

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
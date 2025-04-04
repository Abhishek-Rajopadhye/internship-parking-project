/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import { MarkerComponent } from "./MarkerComponent";
import { InfoWindowComponent } from "./InfoWindowComponent";
import { IoLocationSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { BACKEND_URL } from "../const";

function MapContainer({ selectedMarker, setSelectedMarker, newMarker, markers, setMarkers, mapRef }) {
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ['places', 'geometry'] // Added geometry library for distance calculation
    });

    const [draggableMarker, setDraggableMarker] = useState({ lat: 18.519584, lng: 73.855421 })
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const mapStyles = {
        display: 'flex',
        featureType: 'all',
        elementType: 'all',
        width: '90vw',
        height: '85vh',
        top: 50,
        left: -300
    };

    const defaultCenter = {
        lat: 18.519584,
        lng: 73.855421,
    };

    /**
     * Fetch parking spot markers from the API
     */
    useEffect(() => {
        const fetchMarkers = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/spotdetails/getparkingspot");
                if (!response.data) {
                    throw new Error("No data received from the server");
                }

                setMarkers(response.data);
                setError(null);

            } catch (error) {
                console.error("Error fetching markers", error);
                setError("Failed to load parking spots. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchMarkers();
    }, [setMarkers]);

    const onMarkerDragEnd = (event) => {
        if (!event || !event.latLng) {
            console.error("Error: event.latLng is undefined.", event);
            return;
        }

        const newLat = event.latLng.lat?.();
        const newLng = event.latLng.lng?.();

        if (newLat === undefined || newLng === undefined) {
            console.error("Error: Could not retrieve lat/lng from event.", event);
            return;
        }

        setDraggableMarker({ lat: newLat, lng: newLng });

        console.log("New Position:", newLat, newLng);
    };

    // Calculate distance between selected marker and the seach point location 
    const calculateDistance = (origin, destination) => {
        try {
            if (!window.google?.maps?.geometry) return null;

            if (!origin?.lat || !origin?.lng || !destination?.lat || !destination?.lng) {
                throw new Error("Invalid coordinates provided for distance calculation");
            }

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

            // Converting  km with 2 decimal places
            return (distanceInMeters / 1000).toFixed(2);
        } catch (error) {
            console.error("Distance claculation error:", error);
            return null;
        }
    };

    if (loadError) {
        return <Alert severity="error">Error loading maps: {loadError.message}</Alert>;
    }

    if (!isLoaded) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
                <Box ml={2}>Loading Maps...</Box>
            </Box>
        );
    }


    return (
        <Box className='map-container' >
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                    <Box ml={2}>Loading parking spots...</Box>
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (
                <>
                    <GoogleMap
                        mapContainerStyle={mapStyles}
                        center={defaultCenter}
                        zoom={12}
                        onLoad={map => (mapRef.current = map)}
                    >
                        {/*Render existing parking spot markers */}
                        {markers.map((marker, index) => (
                            <MarkerComponent
                                key={index}
                                marker={marker}
                                setSelectedMarker={setSelectedMarker}
                            />
                        ))}
                        {/* Render search result marker when searched  */}
                        {newMarker && (
                            <MarkerComponent
                                marker={newMarker}
                                setSelectedMarker={setSelectedMarker}
                                isSearchMarker={true}
                            />
                        )}

                        {/* <Marker
                            position={draggableMarker}
                            draggable={true}
                            onDragEnd={onMarkerDragEnd}
                        /> */}

                        {selectedMarker && (
                            <InfoWindowComponent
                                selectedMarker={selectedMarker}
                                newMarker={newMarker}
                                setSelectedMarker={setSelectedMarker}
                                calculateDistance={calculateDistance}
                            />
                        )}
                    </GoogleMap>

                    {/* Navigation button to add new parking spot */}
                    <Button
                        onClick={() => navigate("/spot")}
                        variant="contained"
                        disableElevation
                        startIcon={<IoLocationSharp size={20} />}              
                    >
                        Add Parking Spot
                    </Button>
                </>
            )}
        </Box>
    );
}

export { MapContainer };

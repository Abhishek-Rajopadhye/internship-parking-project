/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { Box, Button,Alert,Snackbar } from "@mui/material";
import { GoogleMap } from "@react-google-maps/api";
import axios from "axios";
import { MarkerComponent } from "./MarkerComponent";
import { InfoWindowComponent } from "./InfoWindowComponent";
import { IoLocationSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { BACKEND_URL } from "../const";
import { MapContext } from "../context/MapContext";

function MapContainer({ selectedMarker, setSelectedMarker, newMarker, markers, setMarkers, mapRef ,filteredMarkers}) {
   
    const {isLoaded,loadError}=useContext(MapContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [currentPosition, setCurrentPosition] = useState(null);
    const [draggableMarker, setDraggableMarker] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info", // "success", "error", "warning"
    });
    const [isRetrying, setIsRetrying] = useState(false);

    
    const mapStyles = {
        display: 'flex',
        featureType: 'all',
        elementType: 'all',
        width: '90vw',
        height: '85vh',
        top: 50,
        left: -150
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
                const response = await axios.get(`${BACKEND_URL}/spotdetails/getparkingspot`);
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

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentPosition({ lat: latitude, lng: longitude });

                    setSnackbar({
                        open: true,
                        message: "📍 Location found successfully!",
                        severity: "success",
                    });
                },
                (error) => {
                    let errorMessage = "Something went wrong.";
                    if (error.code === error.PERMISSION_DENIED) {
                        errorMessage = "❌ Location permission denied.";
                    } else if (error.code === error.POSITION_UNAVAILABLE) {
                        errorMessage = "⚠️ Location unavailable.";
                    } else if (error.code === error.TIMEOUT) {
                        errorMessage = "⏳ Location request timed out.";
                    }

                    setSnackbar({
                        open: true,
                        message: errorMessage,
                        severity: "error",
                    });
                }
            );
        } else {
            setSnackbar({
                open: true,
                message: "🚫 Geolocation not supported by your browser.",
                severity: "warning",
            });
        }
    }, []);

    const handleRetryLocation = () => {
        setIsRetrying(true);

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setDraggableMarker({ lat: latitude, lng: longitude });
                    setCurrentPosition({ lat: latitude, lng: longitude });

                    setSnackbar({
                        open: true,
                        message: "📍 Location found successfully!",
                        severity: "success",
                    });
                    setIsRetrying(false);
                },
                (error) => {
                    let errorMessage = "Something went wrong.";
                    if (error.code === error.PERMISSION_DENIED) {
                        errorMessage = "❌ Location permission denied.";
                    } else if (error.code === error.POSITION_UNAVAILABLE) {
                        errorMessage = "⚠️ Location unavailable.";
                    } else if (error.code === error.TIMEOUT) {
                        errorMessage = "⏳ Location request timed out.";
                    }

                    setSnackbar({
                        open: true,
                        message: errorMessage,
                        severity: "error",
                    });
                    setIsRetrying(false); // Stop loading
                }
            );
        } else {
            setSnackbar({
                open: true,
                message: "🚫 Geolocation not supported by your browser.",
                severity: "warning",
            });
            setIsRetrying(false);
        }
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

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
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
                        center={currentPosition ||defaultCenter}
                        zoom={12}
                        onLoad={map => (mapRef.current = map)}
                    >
                        {/*Render existing parking spot markers */}


                        {filteredMarkers ? filteredMarkers.map((marker, index) => (
                           <MarkerComponent
                                key={index}
                                marker={marker}
                                setSelectedMarker={setSelectedMarker}
                            />
                        )) : markers.map((marker, index) => (
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
                     <Snackbar
                                    open={snackbar.open}
                                    autoHideDuration={4000}
                                    onClose={handleCloseSnackbar}
                                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                                >
                                    <Alert
                                        onClose={handleCloseSnackbar}
                                        severity={snackbar.severity}
                                        sx={{ width: "100%" }}
                                        action={
                                            snackbar.severity === "error" && (
                                                <Button color="inherit"
                                                    size="small"
                                                    onClick={handleRetryLocation}
                                                    disabled={isRetrying}
                                                    startIcon={
                                                        isRetrying ? <CircularProgress size={16} color="inherit" /> : null
                                                    }
                                                >
                                                    {isRetrying ? "Retrying..." : "Retry"}
                                                </Button>
                                            )
                                        }
                                    >
                                        {snackbar.message}
                                    </Alert>
                    
                                </Snackbar>
                </>
            )}
        </Box>
    );
}

export { MapContainer };

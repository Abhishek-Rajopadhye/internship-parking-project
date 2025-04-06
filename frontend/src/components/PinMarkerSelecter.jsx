

/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Box, Button, Container,Typography } from "@mui/material";
import { GoogleMap } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { Marker } from "@react-google-maps/api";
import { useMap } from "../context/MapContext";



const PinMarkerSelecter = () => {
    const { isLoaded, loadError } = useMap();
    const [draggableMarker, setDraggableMarker] = useState({ lat: 18.519584, lng: 73.855421 })
    const navigate = useNavigate();

    const mapStyles = {
        display: 'flex',
        featureType: 'all',
        elementType: 'all',
        width: '100%',
        height: "70vh",
        top: 50


    };

    const defaultCenter = {
        lat: 18.519584,
        lng: 73.855421,
    };

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

    const handleSelection = () => {
        navigate("/spot", {
            state: {
                lat: draggableMarker.lat,
                lng: draggableMarker.lng,
            }

        });
        console.log("", draggableMarker.lat,
            draggableMarker.lng)
    }


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
        <Container sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }} >
           <Box>
            <Typography variant="h6" sx={{ textAlign: 'center', mt: 2 ,top:50 }}>
                Drag the marker to your parking spot and click confirm
            </Typography>
            </Box>
            {isLoaded &&
                <>
                    <GoogleMap
                        mapContainerStyle={mapStyles}
                        center={defaultCenter}
                        zoom={12}

                    >

                        <Marker
                            position={draggableMarker}
                            draggable={true}
                            onDragEnd={onMarkerDragEnd}
                            
                        />

                    </GoogleMap>

                </>
            }
            <Box>
                <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    sx={{ borderRadius: 2, mt: 4, fontSize: "large" }}
                    onClick={handleSelection}


                >
                    Confirm Location
                </Button>
            </Box>
        </Container>

    );
}


export default PinMarkerSelecter
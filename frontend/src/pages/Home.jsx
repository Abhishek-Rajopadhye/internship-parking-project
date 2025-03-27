// Home.jsx
import { Container } from "@mui/material";
import Map from "../components/MapContainer";

function Home({selectedMarker, setSelectedMarker, newMarker, setNewMarker, markers, setMarkers, mapRef}){
    return (
        <Container>
            <Map selectedMarker={selectedMarker} setSelectedMarker={setSelectedMarker} newMarker={newMarker} setNewMarker={setNewMarker} markers={markers} setMarkers={setMarkers} mapRef={mapRef}/>
        </Container>
    )
}

export { Home };

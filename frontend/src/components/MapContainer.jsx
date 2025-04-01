import { useEffect } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import { MarkerComponent } from "./MarkerComponent";
import { InfoWindowComponent } from "./InfoWindowComponent";
import Button from "@mui/material/Button";
import { IoLocationSharp } from "react-icons/io5";

/**
 * MapContainer component renders a Google Map with markers and an info window.
 * It fetches parking spot data from an API, calculates distances between points,
 * and allows interaction with markers on the map.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.selectedMarker - The currently selected marker.
 * @param {Function} props.setSelectedMarker - Function to update the selected marker.
 * @param {Object} props.newMarker - The new marker to be added to the map.
 * @param {Array} props.markers - Array of marker objects to display on the map.
 * @param {Function} props.setMarkers - Function to update the markers array.
 * @param {Object} props.mapRef - A reference to the Google Map instance.
 *
 * @returns {JSX.Element} The rendered MapContainer component.
 */
function MapContainer({ selectedMarker, setSelectedMarker, newMarker, markers, setMarkers, mapRef }) {
	const { isLoaded } = useJsApiLoader({
		id: "google-map-script",
		googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY,
		libraries: ["places", "geometry"], // Added geometry library for distance calculation
	});

	const mapStyles = {
		display: "flex",
		featureType: "all",
		elementType: "all",
		width: "90vw",
		height: "85vh",
		position: "fixed",
		top: 50,
		left: -300,
	};

	const center = {
		lat: 18.519584,
		lng: 73.855421,
	};

	useEffect(() => {
		const fetchMarkers = async () => {
			try {
				const response = await axios.get("http://127.0.0.1:8000/spotdetails/getparkingspot");
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

		const originLatLng = new window.google.maps.LatLng(origin.lat, origin.lng);

		const destinationLatLng = new window.google.maps.LatLng(destination.lat, destination.lng);

		// Distance in meters
		const distanceInMeters = window.google.maps.geometry.spherical.computeDistanceBetween(originLatLng, destinationLatLng);

		// Convert to kilometers with 2 decimal places
		return (distanceInMeters / 1000).toFixed(2);
	};

	return (
		<div className="map-container">
			{isLoaded && (
				<>
					<GoogleMap mapContainerStyle={mapStyles} center={center} zoom={10} onLoad={(map) => (mapRef.current = map)}>
						{markers.map((marker, index) => (
							<MarkerComponent key={index} marker={marker} setSelectedMarker={setSelectedMarker} />
						))}

						{newMarker && (
							<MarkerComponent marker={newMarker} setSelectedMarker={setSelectedMarker} isSearchMarker={true} />
						)}

						{selectedMarker && (
							<InfoWindowComponent
								selectedMarker={selectedMarker}
								newMarker={newMarker}
								setSelectedMarker={setSelectedMarker}
								calculateDistance={calculateDistance}
							/>
						)}
					</GoogleMap>
					<div
						style={{
							display: "flex",
							position: "fixed",
							bottom: "8%",
							left: "10%",
							// transform: 'translateX(-50%)',
							// zIndex: 10,
							alignContent: center,
						}}
					>
						<Button variant="contained" disableElevation>
							<IoLocationSharp size={20} />
							<span
								style={{
									marginLeft: "10px",
									paddingTop: "5px",
									paddingBottom: "4px",
								}}
							>
								Add Parking Spot
							</span>
						</Button>
					</div>
				</>
			)}
		</div>
	);
}

export { MapContainer };

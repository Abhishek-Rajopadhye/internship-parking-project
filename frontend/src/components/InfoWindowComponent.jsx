import { InfoWindow } from '@react-google-maps/api';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { MdDirectionsWalk } from "react-icons/md";
import { IoTime } from "react-icons/io5";
import { IoLocationSharp } from "react-icons/io5";
import { FaRupeeSign } from "react-icons/fa6";
import { Box, Container, IconButton, Typography } from '@mui/material';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router-dom';


const InfoWindowComponent = ({ selectedMarker, newMarker, setSelectedMarker, calculateDistance }) => {

    const position = {
        lat: selectedMarker.location?.lat || selectedMarker.latitude,
        lng: selectedMarker.location?.lng || selectedMarker.longitude
    };

    const isExistingMarker = selectedMarker && newMarker &&
        (selectedMarker.name !== newMarker.name ||
            selectedMarker.spot_id !== newMarker.spot_id);

    const showDetails = () => { }

    return (
        <Container>

            <InfoWindow
                position={position}
                onCloseClick={() => setSelectedMarker(null)}
            >
                <div className='info-window' style={{ color: "black", padding: "5px", borderRadius: "5px", maxWidth: "250px" }}>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: "10px" }}>{selectedMarker.spot_title || "Destination"}</h3>
                        <IconButton>
                            <InfoIcon
                                onClick={() => (showDetails)}
                            />
                        </IconButton>
                        <Link to="/spotdetails" onClick={handleCreatePageClick}>
                            <KeyboardArrowRight />
                        </Link>
                    </div>
                    <Box style={{ margin: "10px", display: "flex" }}>
                        <LocationOnIcon /><Typography> {selectedMarker.address || selectedMarker.name}</Typography>
                    </Box>
                    {isExistingMarker && (<>
                        <Box sx={{ display: "flex", flexDirection: 'row' }}>
                            <CurrencyRupeeIcon /><Typography>  {selectedMarker.hourly_rate} (1 Hr )</Typography>
                            <AccessTimeFilledIcon /><Typography> {selectedMarker.open_time} to {selectedMarker.close_time}</Typography>
                        </Box>

                        <Box sx={{ display: "flex", padding: 2, alignItems: "center", justifyContent: "space-between" }} >
                            <Typography variant="h6" fontWeight="bold" >
                                ({calculateDistance(newMarker.location || newMarker, { lat: position.lat, lng: position.lng })} km )
                            </Typography>
                            <DirectionsWalkIcon />

                        </Box>
                    </>)}
                </div>
            </InfoWindow>
        </Container>
    );
}

export default InfoWindowComponent;


import { InfoWindow } from '@react-google-maps/api';


const InfoWindowComponent = ({ selectedMarker, newMarker, setSelectedMarker, calculateDistance }) => {
    console.log("1", selectedMarker, "2", newMarker, "3", setSelectedMarker, "4", calculateDistance)
    const position={
        lat:selectedMarker.location?.lat || selectedMarker.lat,
        lng:selectedMarker.location?.lng || selectedMarker.lng
    };

    const isExistingMarker = selectedMarker && newMarker && 
    (selectedMarker.name !== newMarker.name || 
     selectedMarker.lat !== newMarker.location.lat);

    return (
        <InfoWindow
            position={position}
            onCloseClick={() => setSelectedMarker(null)}
        >
            <div className='info-window' style={{ color: "black", padding: "5px", borderRadius: "5px" }}>
                <p>Location: {selectedMarker.lat}, {selectedMarker.lng}</p>
                {/* <h2>{selectedMarker.spot_id}</h2>
                <p>{selectedMarker.hourly_rate}</p>
                <p >{selectedMarker.openTime}</p>
                 */}
                { isExistingMarker &&  (<>

                    <p>
                        {calculateDistance(newMarker.location || newMarker, {lat:position.lat,lng:position.lng})} km
                    </p>
                </>
                )}

            </div>
        </InfoWindow>
    );
}

export default InfoWindowComponent;


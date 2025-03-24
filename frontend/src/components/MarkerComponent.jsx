import { Marker } from '@react-google-maps/api';



const MarkerComponent = ({ marker, setSelectedMarker }) => {
  return (<Marker
    position={{ lat: marker.lat, lng: marker.lng }}
    onClick={() => setSelectedMarker(marker)}
  />
  )
}
export default MarkerComponent;

import { createContext, useContext } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places", "geometry"], // Include all needed libs
  });

  return (
    <MapContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => useContext(MapContext);

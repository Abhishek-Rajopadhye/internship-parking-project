import { useState,useEffect } from "react";
import { Autocomplete, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { Search as SearchIcon, FilterAlt as FilterAltIcon } from "@mui/icons-material";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";

const SearchBar = ({ setNewMarker, setSelectedMarker, mapRef }) => {
    const [address, setAddress] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [searchOptions,setSearchoptions]=useState(null)

    

      
    const handleInputChange = (event, value) => {
        setAddress(value);
        if (value.length > 2) {
            const service = new window.google.maps.places.AutocompleteService();
            service.getPlacePredictions({ input: value ,componentRestrictions:{country:"IN"},types:["geocode"],}, (predictions, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    setSuggestions(predictions.map(prediction => prediction.description));
                }
            });
        } else {
            setSuggestions([]);
        }
    };

    const handleSelect = async (event, value) => {
        if (!value) return;
        setAddress(value);
        const results = await geocodeByAddress(value);
        const latLng = await getLatLng(results[0]);

        const newSearchMarker = { name: value, location: latLng };
        setNewMarker(newSearchMarker);
        setSelectedMarker(newSearchMarker);

        if (mapRef.current) {
             mapRef.current.panTo(latLng);
            mapRef.current.setZoom(14);
        }
    };

    const handleFilter = () => {
        setShowFilter(prev => !prev);
    };

    return (
        <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
            <SearchIcon style={{ marginRight: 8 }} />
            <Autocomplete
                freeSolo
                options={suggestions}
                value={address}
                onInputChange={handleInputChange}
                onChange={handleSelect}
                renderInput={(params) => (
                    <TextField {...params} 
                        placeholder="Search location" 
                        variant="outlined" 
                        size="small" 
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        sx={{
                            width: isFocused ? '300px' : '200px',
                            backgroundColor: isFocused ? 'white' : 'transparent',
                            transition: 'width 0.3s ease, background-color 0.3s ease',
                            borderRadius: '8px',
                            input: { color: isFocused ? 'black' : 'white' }
                        }}
                    />
                )}
            />
            <IconButton onClick={handleFilter}>
                <FilterAltIcon />
            </IconButton>

            <Dialog open={showFilter} onClose={handleFilter}>
                <DialogTitle>Filter Options</DialogTitle>
                <DialogContent>
                    {/* Add your filter components here */}
                    <p>Filter settings will go here.</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleFilter}>Apply Filters</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SearchBar;

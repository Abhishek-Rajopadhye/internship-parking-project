import { StandaloneSearchBox } from "@react-google-maps/api";
import { useRef, useState } from "react";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { GiPathDistance } from "react-icons/gi";
import { MdOutlineDateRange } from "react-icons/md";
import { Container, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Button, Box } from "@mui/material";
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { FilterAlt as FilterAltIcon, Clear as ClearIcon, CurrencyRupee as CurrencyRupeeIcon, Search as SearchIcon } from '@mui/icons-material';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

const SearchBar = ({ setNewMarker, setSelectedMarker, mapRef }) => {
    const searchBoxRef = useRef(null);
    const [address, setAddress] = useState("");
    const [showFilter, setShowFilter] = useState(false);

    const onPlacesChanged = async () => {
        const places = searchBoxRef.current.getPlaces();
        if (places.length === 0) return;

        const place = places[0];

        setAddress(place.formatted_address);
        const results = await geocodeByAddress(place.formatted_address);
        const latLng = await getLatLng(results[0]);

        const newSearchMarker = {
            name: place.formatted_address,
            location: latLng
        };

        setNewMarker(newSearchMarker);
        setSelectedMarker(newSearchMarker);

        if (mapRef.current) {
            mapRef.current.panTo(latLng);
            mapRef.current.setZoom(15);
        }
    };

    // Function to clear the search input
    const clearInput = () => {
        setAddress("");
        setNewMarker(null);
        setSelectedMarker(null);
    }

    const handleFilter = () => {
        setShowFilter(prev => !prev)
    }

    return (
        <Container sx={{ position: 'relative', zIndex: 1200 }}>
            <StandaloneSearchBox
                onLoad={(ref) => (searchBoxRef.current = ref)}
                onPlacesChanged={onPlacesChanged}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', borderRadius: 2 }}>
                    <Search value={address} onChange={(e) => setAddress(e.target.value)}>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Enter text"
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                    {address && (
                        <IconButton onClick={clearInput}>
                            <ClearIcon />
                        </IconButton>
                    )}
                    <IconButton onClick={handleFilter}>
                        <FilterAltIcon />
                    </IconButton>
                </Box>
            </StandaloneSearchBox>

            <Dialog open={showFilter} onClose={handleFilter}>
                <DialogTitle>Filter Options</DialogTitle>
                <DialogContent>
                    <CurrencyRupeeIcon
                        style={{
                            position: 'absolute',
                            left: '10px',
                            color: 'black',
                        }}
                    />
                    <br />
                    <GiPathDistance />
                    <br />
                    <MdOutlineDateRange />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleFilter}>Apply Filters</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default SearchBar;
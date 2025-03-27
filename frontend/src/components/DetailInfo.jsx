import React from "react";
import { Grid, Paper, Typography, Box, Rating, Avatar, colors, ImageList, ImageListItem, CardMedia, Card } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";


function Layout() {
    return (
        <Box sx={{ width: "80%", margin: "auto", padding: 3 }}>
            <Paper sx={{ padding: 2, textAlign: "center" }}>
                <Typography variant="h4" fontWeight="bold">Parking Spot Details</Typography>
            </Paper>
            <Grid container sx={{ marginTop: 2, }}>
                {/* left Section */}
                <Grid item xs={12} md={6} sx={{ padding: 1 }} >
                    <Paper elevation="6" sx={{ padding: 3 }} >
                        <Typography variant="h6">Left Section</Typography>

                        <Grid container spacing={0} >
                            <ImageList sx={{ width: 500, height: 65 }} cols={3} >
                                {itemData.map((item) => (
                                    <ImageListItem key={item.img}>
                                        <img
                                            srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                            src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                                            alt={item.title}
                                            loading="lazy"
                                        />
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        </Grid>


                        <Box padding={0} display="flex" sx={{ justifyContent: "flex-start" }}>
                            <Rating name="read-only" value={4} readOnly /> <Typography>(10)</Typography>
                        </Box>

                        <Box bgcolor="skyblue" sx={{ padding: 2, borderRadius: 2 ,width:"100%"}}>
                            <Typography variant="h6" fontWeight="bold">Review</Typography>
                           
                            <Grid container direction="column" spacing={2}>
                               
                                <Grid item >
                                    <Box sx={{ display: "flex",alignItems:"center",gap:1 }}>
                                        <Typography fontWeight="bold">Pradeep </Typography>
                                        <Typography>20-8-2025</Typography>
                                        <Rating name="read-only" value={4} readOnly />
                                    </Box>
                                    <Box bgcolor="gray" sx={{ padding: 2,borderRadius:4,marginTop:1 }}>
                                        <Typography color="white">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam ad commodi illum optio nemo eligendi vel molestiae doloribus consequu</Typography>
                                    </Box>

                                </Grid>
                                <Grid item >
                                <Box sx={{ display: "flex",alignItems:"center",gap:1 }}>
                                        <Typography fontWeight="bold">Pradeep </Typography>
                                        <Typography>20-8-2025</Typography>
                                        <Rating name="read-only" value={4} readOnly />
                                    </Box>
                                    <Box bgcolor="gray" sx={{ padding: 2,borderRadius:4,marginTop:1 }}>
                                        <Typography color="white">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam ad commodi illum optio nemo eligendi vel molestiae doloribus consequu</Typography>
                                    </Box>

                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>

                {/* Right  */}
                <Grid xs={12} md={6} sx={{ padding: 1 }}>
                    <Paper elevation="6" sx={{ padding: 3 }}>
                        <Typography variant="h6">Right Section</Typography>
                        {/* <Box>
                            <Typography>Owner</Typography>
                            <Typography>Pradeep Kale</Typography>
                            <Typography>+91 75583 83450</Typography>
                        </Box> */}
                        <Box>

                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

const itemData = [
    {
        img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
        title: 'Breakfast',
    },
    {
        img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
        title: 'Burger',
    },
    {
        img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
        title: 'Camera',
    },
    {
        img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
        title: 'Breakfast',
    },
    {
        img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
        title: 'Burger',
    },
    {
        img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
        title: 'Camera',
    },
    {
        img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
        title: 'Breakfast',
    },
    {
        img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
        title: 'Burger',
    },
    {
        img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
        title: 'Camera',
    },
];

const days = ["Monday", "tuesday", "wednesday"]

export default Layout;



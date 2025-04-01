import { Button, Dialog, DialogContent, DialogTitle, Rating, TextField, Typography, Alert, Input, InputLabel } from "@mui/material";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { BACKEND_URL } from "../const";

const AddReview = ({ spotId, handleClose }) => {
	const [formData, setFormData] = useState(null);
	const { user } = useContext(AuthContext);
	const [openSnackbar, setOpenSnackbar] = useState({
		open: false,
		message: "",
		severity: "info",
	});

	useEffect(() => {
		setFormData({
			id: null,
			user_id: user.id,
			spot_id: spotId,
			review_description: "",
			rating_score: 0,
			image: null,
			owner_reply: null,
			created_at: null,
		});
	}, [setFormData, spotId, user]);

	const handleSubmit = async (event) => {
        event.preventDefault();
        try {
			const response = await axios.post(`${BACKEND_URL}/reviews/`, formData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});

			if (response.status !== 200) {
				throw new Error("Failed to add review");
			}

			handleClose();
		} catch (error) {
			console.error("Error adding review:", error);
            setOpenSnackbar({
				open: true,
				message: error.message,
				severity: "error",
			});
		}
    };

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleImageChange = (event) => {
		const file = event.target.files[0];
		const maxSize = 2 * 1024 * 1024;
		if (file.size > maxSize) {
			setOpenSnackbar({
				open: true,
				message: "File Size should be less than 2MB",
				severity: "error",
			});
			return;
		}

		if (file) {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onloadend = () => {
				setFormData((prevData) => ({
					...prevData,
					image: reader.result.split(",")[1],
				}));
			};
		}
	};

	return (
		<>
			<Dialog>
				<DialogTitle>Add Review</DialogTitle>
				<DialogContent>
					<Box component="form" sx={{ m: 2 }} onSubmit={handleSubmit}>
						<TextField
							fullWidth
							label="Description"
							name="review_description"
							value={formData.review_description}
							onChange={handleChange}
						/>
						<Typography> Enter a Rating Score</Typography>
						<Rating name="rating_score" value={formData.rating_score} onChange={handleChange}></Rating>
						<Grid item xs={12}>
							<Button       
                                variant="contained"
                                color="primary"
                                startIcon={<CloudUploadIcon />}
                            >
                                Upload
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    sx={{ display: "none" }}
                                    id="image-upload"
                                />
                            </Button>
							<InputLabel htmlFor="image-upload">	Image </InputLabel>
						</Grid>
						<Button type="submit" variant="contained" color="primary" fullWidth>Submit Review</Button>
					</Box>
				</DialogContent>
			</Dialog>
			<Snackbar
				open={openSnackbar.open}
				autoHideDuration={3000}
				onClose={() => setOpenSnackbar({ ...openSnackbar, open: false })}
			>
				<Alert severity={openSnackbar.severity} variant="filled">
					{openSnackbar.message}
				</Alert>
			</Snackbar>
		</>
	);
};

export { AddReview };

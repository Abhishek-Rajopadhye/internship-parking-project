import { useState } from "react";
import { InfoWindow } from "@react-google-maps/api";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { MdDirectionsWalk } from "react-icons/md";
import { IoTime } from "react-icons/io5";
import { IoLocationSharp } from "react-icons/io5";
import { FaRupeeSign } from "react-icons/fa6";

const InfoWindowComponent = ({ selectedMarker, newMarker, setSelectedMarker, calculateDistance }) => {
	console.log("1", selectedMarker, "2", newMarker, "3", setSelectedMarker, "4", calculateDistance);
	const [showDetails, setShowDetails] = useState(false);
	const position = {
		lat: selectedMarker.location?.lat || selectedMarker.latitude,
		lng: selectedMarker.location?.lng || selectedMarker.longitude,
	};

	const isExistingMarker =
		selectedMarker && newMarker && (selectedMarker.name !== newMarker.name || selectedMarker.spot_id !== newMarker.spot_id);

	return (
		<InfoWindow position={position} onCloseClick={() => setSelectedMarker(null)}>
			<div className="info-window" style={{ color: "black", padding: "5px", borderRadius: "5px", maxWidth: "250px" }}>
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<h3 style={{ margin: "10px" }}>{selectedMarker.spot_title || "Destination"}</h3>
					<AiOutlineInfoCircle size={25} style={{ cursor: "pointer" }} onClick={() => setShowDetails(!showDetails)} />
				</div>
				<div style={{ margin: "10px", display: "flex" }}>
					{" "}
					<span>
						<IoLocationSharp size={20} />{" "}
					</span>{" "}
					<div style={{ marginLeft: "10px", fontSize: "18px" }}> {selectedMarker.address || selectedMarker.name}</div>{" "}
				</div>
				{isExistingMarker && (
					<>
						<div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
							<div style={{ margin: "10px", display: "flex" }}>
								{" "}
								<FaRupeeSign size={20} />{" "}
								<div style={{ paddingTop: "0", paddingLeft: "5px", fontSize: "20px" }}>
									{" "}
									{selectedMarker.hourly_rate} (1 Hr ){" "}
								</div>{" "}
							</div>
							<div style={{ margin: "10px", display: "flex" }}>
								{" "}
								<IoTime size={20} />{" "}
								<div style={{ paddingLeft: "5px" }}>
									{selectedMarker.open_time} to {selectedMarker.close_time}
								</div>{" "}
							</div>
						</div>

						<div
							style={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
								margin: "10px",
							}}
						>
							<h3>
								{" "}
								(
								{calculateDistance(newMarker.location || newMarker, {
									lat: position.lat,
									lng: position.lng,
								})}{" "}
								km )
							</h3>
							<MdDirectionsWalk size={20} />
						</div>
					</>
				)}
			</div>
		</InfoWindow>
	);
};

export { InfoWindowComponent };

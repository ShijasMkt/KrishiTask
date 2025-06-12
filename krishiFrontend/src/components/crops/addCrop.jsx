import React, { useState } from "react";
import Swal from "sweetalert2";
import "./crops.css";
import { getValidAccessToken } from "../../tools/tokenValidation";


export default function AddCrop({ onClose }) {
	const [formData, setFormData] = useState({
		name: "",
		variety: "",
		season: "",
		avg_yield_per_acre: 0,
		description: "",
		image: null,
	});

	const handleChange = (e) => {
		const { id, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[id]: value,
		}));
	};

	const handleFileChange = (e) => {
		setFormData((prev) => ({
			...prev,
			image: e.target.files[0],
		}));
	};

	const saveCrop = async (e) => {
		e.preventDefault();
		const body = new FormData();
		for (const key in formData) {
			body.append(key, formData[key]);
		}
		const token=await getValidAccessToken();
		const res = await fetch("http://127.0.0.1:8000/api/add_crop/", {
			method: "POST",
			body,
			headers:{
				Authorization: `Bearer ${token}`,
			}
		});

		if (res.ok) {
			Swal.fire({
				icon: "success",
				title: "Crop Added",
				text: "You’ve successfully added a crop.",
			}).then(onClose());
		} else {
			Swal.fire({
				icon: "error",
				title: "Error",
				text: "Failed to add crop, please try again.",
			}).then(onClose());
		}
	};

	return (
		<section id="add-crop">
			<div className="container">
				<form onSubmit={saveCrop}>
					<div className="row">
						<div className="col-6 form-group">
							<label htmlFor="name" className="form-label mb-0">
								Crop Name
							</label>
							<input
								value={formData.name}
								onChange={handleChange}
								type="text"
								id="name"
								className="form-control"
								required
							/>
						</div>
						<div className="col-6 form-group">
							<label htmlFor="variety" className="form-label mb-0">
								Variety
							</label>
							<input
								value={formData.variety}
								onChange={handleChange}
								type="text"
								id="variety"
								className="form-control"
							/>
						</div>
					</div>

					<div className="row pt-3">
						<div className="col-6 form-group">
							<label htmlFor="season" className="form-label mb-0">
								Season
							</label>
							<input
								value={formData.season}
								onChange={handleChange}
								type="text"
								id="season"
								className="form-control"
								required
							/>
						</div>
						<div className="col-6 form-group">
							<label htmlFor="avg_yield_per_acre" className="form-label mb-0">
								Avg Yield (per acre)
							</label>
							<input
								value={formData.avg_yield_per_acre}
								onChange={handleChange}
								type="number"
								id="avg_yield_per_acre"
								className="form-control"
							/>
						</div>
					</div>

					<div className="row pt-3">
						<div className="col-12 form-group">
							<label htmlFor="description" className="form-label mb-0">
								Description
							</label>
							<textarea
								value={formData.description}
								onChange={handleChange}
								id="description"
								className="form-control"
								rows={3}
							/>
						</div>
					</div>

					<div className="row pt-3">
						<div className="col-12 form-group">
							<label htmlFor="image" className="form-label mb-0">
								Crop Image
							</label>
							<input
								onChange={handleFileChange}
								type="file"
								id="image"
								className="form-control"
								accept="image/*"
							/>
						</div>
					</div>

					<div className="text-center pt-3">
						<button type="submit" className="btn btn-theme">
							Save
						</button>
					</div>
				</form>
			</div>
		</section>
	);
}

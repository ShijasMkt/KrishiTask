import React, { useState, useEffect } from "react";
import "./fields.css";
import Swal from 'sweetalert2';
import { getValidAccessToken } from "../../tools/tokenValidation";


export default function EditField({ field, onClose }) {
    const [formData, setFormData] = useState({});
    const [crops, setCrops] = useState([]);

    useEffect(() => {
        if (field) {
            setFormData(field);
        }
    }, [field]);

    useEffect(()=>{
        fetchCrops()
    },[])

    const fetchCrops = async () => {
		const res = await fetch("http://127.0.0.1:8000/api/fetch_crops/");
		if (res.ok) {
			const data = await res.json();
			setCrops(data);
		}
	};

    const editField = async (e) => {
        e.preventDefault();
        const body = JSON.stringify({ formData });
		const token=await getValidAccessToken();
        const res = await fetch("http://127.0.0.1:8000/api/edit_field/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
            },
            body,
        });
        if (res.ok) {
            Swal.fire({
                icon: "success",
                title: "Field Edited",
                text: "You've successfully edited field data",
            }).then(onClose());
        }
    };

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: type === 'checkbox' ? checked : value,
        }));
    };
    

   

    return (
        <section id="edit-field">
            <div className="container">
                {formData.name ? (
                    <form onSubmit={editField}>
					<div className="row">
						<div className="col-6 form-group">
							<label htmlFor="farm" className="form-label mb-0">
								Farm
							</label>
							<select
								id="farm"
								className="form-control"
								value={formData.farm}
								disabled
							>
								<option value={formData.farm}>#{formData.farm}({formData.farm_name})</option>
							</select>
						</div>
						<div className="col-6 form-group">
							<label htmlFor="name" className="form-label mb-0">
								Field Name
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
					</div>

					<div className="row pt-3">
						<div className="col-6 form-group">
							<label htmlFor="crop" className="form-label mb-0">
								Crop
							</label>
							<select
								id="crop"
								className="form-control"
								value={formData.crop}
								onChange={handleChange}
                                
							>
								<option value="" >Select Crop</option>
								{crops.map((crop) => (
									<option key={crop.id} value={crop.id}>
										{crop.name}
									</option>
								))}
							</select>
						</div>
						<div className="col-6 form-group">
							<label htmlFor="area_in_acres" className="form-label mb-0">
								Area (acres)
							</label>
							<input
								value={formData.area_in_acres}
								onChange={handleChange}
								type="number"
								step="0.01"
								id="area_in_acres"
								className="form-control"
								required
							/>
						</div>
					</div>

					<div className="row pt-3">
						<div className="col-6 form-group">
							<label htmlFor="soil_type" className="form-label mb-0">
								Soil Type
							</label>
							<input
								value={formData.soil_type}
								onChange={handleChange}
								type="text"
								id="soil_type"
								className="form-control"
							/>
						</div>
						<div className="col-6 form-group form-check d-flex align-items-end">
                            <input
								checked={formData.is_irrigated}
								onChange={handleChange}
								type="checkbox"
								id="is_irrigated"
								className="form-check-input me-2"
							/>
							<label htmlFor="is_irrigated" className="form-check-label mb-0">
								Irrigated
							</label>
                            
						</div>
					</div>

					<div className="text-center pt-3">
						<button type="submit" className="btn btn-theme">
							Save
						</button>
					</div>
				</form>
                ) : null}
            </div>
        </section>
    );
}

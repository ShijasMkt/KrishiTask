import React, { useState } from 'react';
import './farms.css';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { getValidAccessToken } from '../../tools/tokenValidation';

export default function AddFarm({ onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        contact_number: '',
        email: '',
        location: '',
        size_in_acres: '',
        image: null,
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            image: e.target.files[0],
        }));
    };

    const saveFarm = async (e) => {
        e.preventDefault();
        const body = new FormData();
        
        for (const key in formData) {
            body.append(key, formData[key]);
        }

        const token=await getValidAccessToken();
        const res = await fetch('http://127.0.0.1:8000/api/create_farm/', {
            method: 'POST',
            body,
            headers:{
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Farm Added',
                text: "You've successfully added a farm",
            }).then(onClose())
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add farm, please try again.',
            }).then(onClose())
        }
    };

    return (
        <section id="add-farm">
            <div className="container">
                <form onSubmit={saveFarm}>
                    <div className="row">
                        <div className="col-6 form-group">
                            <label htmlFor="name" className="form-label mb-0">
                                Farm Name
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
                            <label htmlFor="contact_number" className="form-label mb-0">
                                Contact Number
                            </label>
                            <input
                                value={formData.contact_number}
                                onChange={handleChange}
                                type="text"
                                id="contact_number"
                                className="form-control"
                                maxLength={10}
                            />
                        </div>
                        <div className="col-6 form-group">
                            <label htmlFor="email" className="form-label mb-0">
                                Email
                            </label>
                            <input
                                value={formData.email}
                                onChange={handleChange}
                                type="email"
                                id="email"
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="row pt-3">
                        <div className="col-6 form-group">
                            <label htmlFor="location" className="form-label mb-0">
                                Location
                            </label>
                            <input
                                value={formData.location}
                                onChange={handleChange}
                                type="text"
                                id="location"
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="col-6 form-group">
                            <label htmlFor="size_in_acres" className="form-label mb-0">
                                Size (acres)
                            </label>
                            <input
                                value={formData.size_in_acres}
                                onChange={handleChange}
                                type="number"
                                id="size_in_acres"
                                className="form-control"
                                required
                            />
                        </div>
                    </div>

                    <div className="row pt-3">
                        <div className="col-12 form-group">
                            <label htmlFor="image" className="form-label mb-0">
                                Farm Image
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

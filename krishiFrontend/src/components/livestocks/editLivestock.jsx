import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getValidAccessToken } from "../../tools/tokenValidation";

export default function EditLivestock({ livestock,onClose }) {
  const [formData, setFormData] = useState({});
  const [farms, setFarms] = useState([]);

  useEffect(()=>{
    if(livestock){
      setFormData(livestock)
    }
  },[livestock])

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    const token = await getValidAccessToken();
    const res = await fetch("http://127.0.0.1:8000/api/fetch_farms/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      setFarms(data);
    }
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const editLivestock = async(e) => {
    e.preventDefault();
    const token=await getValidAccessToken();
    const body=JSON.stringify({formData});
    const res = await fetch("http://127.0.0.1:8000/api/edit_livestock/", {
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
            title: "Livestock Edited",
            text: "You’ve successfully edited a livestock.",
          }).then(onClose());
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to edit livestock, please try again.",
          }).then(onClose());
        }
  };
  return (
    <section id="edit-livestock">
      <div className="container">
        {formData.tag?
        <form onSubmit={editLivestock}>
          <div className="row">
            <div className="col-6 form-group">
              <label htmlFor="tag" className="form-label mb-0">
                Tag
              </label>
              <input
                value={formData.tag}
                onChange={handleChange}
                type="text"
                id="tag"
                className="form-control"
                required
              />
            </div>
            <div className="col-6 form-group">
              <label htmlFor="species" className="form-label mb-0">
                Species
              </label>
              <input
                value={formData.species}
                onChange={handleChange}
                type="text"
                id="species"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="row pt-3">
            <div className="col-6 form-group">
              <label htmlFor="farm" className="form-label mb-0">
                Farm
              </label>
              <select
                id="farm"
                className="form-control"
                value={formData.farm}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select Farm
                </option>
                {farms.map((farm) => (
                  <option key={farm.id} value={farm.id}>
                    {farm.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-6 form-group">
              <label htmlFor="breed" className="form-label mb-0">
                Breed
              </label>
              <input
                value={formData.breed}
                onChange={handleChange}
                type="text"
                id="breed"
                className="form-control"
              />
            </div>
          </div>
          <div className="row pt-3">
            <div className="col-6 form-group">
              <label htmlFor="gender" className="form-label mb-0">
                Gender
              </label>
              <input
                value={formData.gender}
                onChange={handleChange}
                type="text"
                id="gender"
                className="form-control"
              />
            </div>
            <div className="col-6 form-group">
              <label htmlFor="color" className="form-label mb-0">
                Color
              </label>
              <input
                value={formData.color}
                onChange={handleChange}
                type="text"
                id="color"
                className="form-control"
              />
            </div>
          </div>
          <div className="text-center pt-3">
            <button type="submit" className="btn btn-theme">
              Save
            </button>
          </div>
        </form>:null}
      </div>
    </section>
  );
}

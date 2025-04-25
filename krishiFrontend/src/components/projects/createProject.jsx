import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function CreateProject ({onClose}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [farmField, setFarmField] = useState('');
  const [farms, setFarms] = useState([]);
  const [fields, setFields] = useState([]);

  useEffect(() => {
    fetchFarms()
  }, []);

  const fetchFarms = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/fetch_farms/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (res.ok) {
        const data = await res.json();
        setFarms(data);
    }
};

const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'farm_field') {
      setFarmField(value);
    } else if (name === 'title') {
      setTitle(value);
    } else if (name === 'description') {
      setDescription(value);
    } else if (name === 'deadline') {
      setDeadline(value);
    }
  };

  const saveProject=async(e)=>{
    e.preventDefault();

    const projectData = {
      title,
      description,
      deadline,
      farm_field: farmField
    };

    const body = JSON.stringify({ projectData });
            const res = await fetch("http://127.0.0.1:8000/api/create_project/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body,
            });
            
    
            if (res.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Project Added",
                    text: "You’ve successfully added a Project.",
                }).then(onClose());
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to add Project, please try again.",
                }).then(onClose());
            }
  }

  return (
    
        <form onSubmit={saveProject}>
        <div className="row">
          <div className="col-6 form-group">
            <label htmlFor="title" className="form-label mb-0">
              Project Title
            </label>
            <input
              value={title}
              onChange={handleChange}
              type="text"
              id="title"
              className="form-control"
              name="title"
              required
            />
          </div>
          <div className="col-6 form-group">
            <label htmlFor="description" className="form-label mb-0">
              Description
            </label>
            <textarea
              value={description}
              onChange={handleChange}
              id="description"
              className="form-control"
              name="description"
              required
            />
          </div>
        </div>

        <div className="row pt-3">
          <div className="col-6 form-group">
            <label htmlFor="deadline" className="form-label mb-0">
              Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={handleChange}
              id="deadline"
              className="form-control"
              name="deadline"
              required
            />
          </div>
          <div className="col-6 form-group">
            <label htmlFor="farm_field" className="form-label mb-0">
              Assign to Farm or Field
            </label>
            <select
              id="farm_field"
              className="form-control"
              value={farmField}
              onChange={handleChange}
              name="farm_field"
              required
            >
              <option value="">Select Farm/Field</option>
              {farms.map(farm => (
                <option key={farm.id} value={`${farm.id}`}>
                  {farm.name} (Farm)
                </option>
              ))}
              {fields.map(field => (
                <option key={field.id} value={`field_${field.id}`}>
                  {field.name} (Field)
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-center pt-3">
          <button type="submit" className="btn btn-theme">
            Save
          </button>
        </div>
      </form>
        
    
  );
};



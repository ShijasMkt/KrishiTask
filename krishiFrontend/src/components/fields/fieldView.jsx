import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import Swal from "sweetalert2";
import { getValidAccessToken } from "../../tools/tokenValidation";
import AddField from "./addField";
import EditField from "./editField";
import "./fields.css";
import { useLocation } from "react-router-dom";

export default function FieldView() {
    const [fields, setFields] = useState([]);
    const [addVisible, setAddVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [selectedField, setSelectedField] = useState(null);
    const [fieldToDelete, setFieldToDelete] = useState(null);
    const location = useLocation();
	const { selectedFarm } = location.state || {};

    useEffect(() => {
        fetchFields();
    }, []);

    const fetchFields = async () => {
        const token=await getValidAccessToken();
        const res = await fetch("http://127.0.0.1:8000/api/fetch_fields/",{
            method:"POST",
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body:JSON.stringify({farmID:selectedFarm.id})
        });
        if (res.ok) {
            const data = await res.json();
            setFields(data);
        }
    };

    const deleteField = async () => {
        const token=await getValidAccessToken();
        const res = await fetch("http://127.0.0.1:8000/api/delete_field/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ fieldID: fieldToDelete.id }),
        });
        if (res.ok) {
            setDeleteDialogVisible(false);
            Swal.fire("Deleted!", "Field has been deleted.", "success").then(() =>
                fetchFields()
            );
        }
    };

    const confirmDeleteField = (field) => {
        setFieldToDelete(field);
        setDeleteDialogVisible(true);
    };

    const closeAdd = () => {
        setAddVisible(false);
        fetchFields();
    };

    const closeEdit = () => {
        setEditVisible(false);
        setSelectedField(null);
        fetchFields();
    };

    const fieldActions = (rowData) => (
        <div className="d-flex justify-content-around">
            
            <Button
                icon="pi pi-pencil"
                rounded
                text
                severity="success"
                onClick={() => {
                    setSelectedField(rowData);
                    setEditVisible(true);
                }}
            />
            <Button
                icon="pi pi-trash"
                rounded
                text
                severity="danger"
                onClick={() => confirmDeleteField(rowData)}
            />
        </div>
    );

    const deleteDialogFooter = (
        <>
            <Button
                label="No"
                icon="pi pi-times"
                onClick={() => setDeleteDialogVisible(false)}
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                severity="danger"
                onClick={deleteField}
            />
        </>
    );

    return (
        <section className="section-body">
            <div className="container pt-3">
                <div className="d-flex justify-content-between mb-3">
                    <h5>{selectedFarm.name} Fields:</h5>
                    <Button
                        label="Add Field"
                        icon="pi pi-plus"
                        onClick={() => setAddVisible(true)}
                    />
                </div>
            </div>

            <DataTable value={fields} className="w-100" showGridlines stripedRows>
                <Column header="Sl No" body={(rowData, { rowIndex }) => rowIndex + 1} />
                <Column field="name" header="Name" />
                <Column field="area_in_acres" header="Area (acres)" />
                <Column field="crop_name" header="Crop" body={(rowData) => rowData.crop_name || "Not Specified"}/>
                <Column field="soil_type" header="Soil Type" body={(rowData) => rowData.soil_type || "Unknown"}/>
                <Column header="Irrigated" align={"center"} body={(rowData)=>(rowData.is_irrigated==true?<i className="pi pi-check text-success"></i>:<i className="pi pi-times text-danger"></i>)}></Column>
                <Column header="Actions" body={fieldActions} />
            </DataTable>

            <Dialog
                header="Add Field"
                visible={addVisible}
                onHide={() => setAddVisible(false)}
            >
                <AddField farm={selectedFarm} onClose={closeAdd} />
            </Dialog>

            <Dialog header="Edit Field" visible={editVisible} onHide={closeEdit}>
                <EditField field={selectedField} onClose={closeEdit} />
            </Dialog>

            <Dialog
                header="Confirm Delete"
                visible={deleteDialogVisible}
                onHide={() => setDeleteDialogVisible(false)}
                footer={deleteDialogFooter}
            >
                <p>
                    Are you sure you want to delete <b>{fieldToDelete?.name}</b>?
                </p>
            </Dialog>

            
        </section>
    );
}

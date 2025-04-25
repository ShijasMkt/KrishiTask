import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import Swal from "sweetalert2";

import AddCrop from "./addCrop";
import EditCrop from "./editCrop";
import "./crops.css";

export default function Crops() {
	const [crops, setCrops] = useState([]);
	const [addVisible, setAddVisible] = useState(false);
	const [editVisible, setEditVisible] = useState(false);
	const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
	const [selectedCrop, setSelectedCrop] = useState(null);
	const [cropToDelete, setCropToDelete] = useState(null);
	const [viewDialogVisible, setViewDialogVisible] = useState(false);

	useEffect(() => {
		fetchCrops();
	}, []);

	const fetchCrops = async () => {
		const res = await fetch("http://127.0.0.1:8000/api/fetch_crops/");
		if (res.ok) {
			const data = await res.json();
			setCrops(data);
		}
	};

	const deleteCrop = async () => {
		const res = await fetch("http://127.0.0.1:8000/api/delete_crop/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ cropID: cropToDelete.id }),
		});
		if (res.ok) {
			setDeleteDialogVisible(false);
			Swal.fire("Deleted!", "Crop has been deleted.", "success").then(() =>
				fetchCrops()
			);
		}
	};

	const confirmDeleteCrop = (crop) => {
		setCropToDelete(crop);
		setDeleteDialogVisible(true);
	};

	const closeAdd = () => {
		setAddVisible(false);
		fetchCrops();
	};

	const closeEdit = () => {
		setEditVisible(false);
		setSelectedCrop(null);
		fetchCrops();
	};

	const cropActions = (rowData) => (
		<div className="d-flex justify-content-around">
			<Button
				icon="pi pi-eye"
				rounded
				text
				severity="info"
				onClick={() => {
					setSelectedCrop(rowData);
					setViewDialogVisible(true);
				}}
			/>
			<Button
				icon="pi pi-pencil"
				rounded
				text
				severity="success"
				onClick={() => {
					setSelectedCrop(rowData);
					setEditVisible(true);
				}}
			/>
			<Button
				icon="pi pi-trash"
				rounded
				text
				severity="danger"
				onClick={() => confirmDeleteCrop(rowData)}
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
				onClick={deleteCrop}
			/>
		</>
	);

	return (
		<section className="section-body">
			<div className="container pt-3">
				<div className="d-flex justify-content-end mb-3">
					<Button
						label="Add Crop"
						icon="pi pi-plus"
						onClick={() => setAddVisible(true)}
					/>
				</div>
			</div>

			<DataTable value={crops} className="w-100" showGridlines stripedRows>
				<Column field="id" header="Crop ID" />
				<Column field="name" header="Name" />
				<Column field="variety" header="Variety" />
				<Column field="season" header="Season" />
				<Column field="avg_yield_per_acre" header="Avg Yield (acres)" />
				<Column header="Actions" body={cropActions} />
			</DataTable>

			<Dialog
				header="Add Crop"
				visible={addVisible}
				onHide={() => setAddVisible(false)}
			>
				<AddCrop onClose={closeAdd} />
			</Dialog>

			<Dialog header="Edit Crop" visible={editVisible} onHide={closeEdit}>
				<EditCrop crop={selectedCrop} onClose={closeEdit} />
			</Dialog>

			<Dialog
				header="Confirm Delete"
				visible={deleteDialogVisible}
				onHide={() => setDeleteDialogVisible(false)}
				footer={deleteDialogFooter}
			>
				<p>
					Are you sure you want to delete <b>{cropToDelete?.name}</b>?
				</p>
			</Dialog>

			<Dialog
				header={`Crop #${selectedCrop?.id}`}
				visible={viewDialogVisible}
				onHide={() => setViewDialogVisible(false)}
				style={{ width: "50vw" }}
			>
				{selectedCrop && (
					<>
						<div className="row ">
							<div className="col-6">
								<div className="card p-3 h-100 border-0">
                                <p>
									<strong>Name:</strong> {selectedCrop.name}
								</p>
                                <p>
									<strong>Variety:</strong> {selectedCrop.variety}
								</p>
								<p>
									<strong>Season:</strong> {selectedCrop.season}
								</p>
								<p>
									<strong>Yield:</strong> {selectedCrop.avg_yield_per_acre} /
									acre
								</p>
								<p>
									<strong>Description:</strong> {selectedCrop.description}
								</p>
                                </div>
							</div>
                            <div className="col-6">
                                <div className="card p-3 h-100 border-0">
                                {selectedCrop.image != "" ? (
												<>
													<img
														src={`http://127.0.0.1:8000${selectedCrop.image}`}
														className="farmImg"
														alt=""
														height={"100%"}
													/>
												</>
											) : (
												<>
													<span>No Farm Image found!!</span>
												</>
											)}
                                </div>
                            </div>
						</div>
                        
					</>
				)}
			</Dialog>
		</section>
	);
}

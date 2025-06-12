import React, { useEffect } from "react";
import "./farms.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import AddFarm from "./addFarm";
import EditFarm from "./editFarm";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getValidAccessToken } from "../../tools/tokenValidation";
import { se } from "date-fns/locale";

export default function Farms() {
	useEffect(() => {
		fetchFarms();
	}, []);

    const navigateTo=useNavigate();
	const [farms, setFarms] = useState();
	const [addVisible, setAddVisible] = useState(false);
	const [farmToDelete, setFarmToDelete] = useState();
	const [editVisible, setEditVisible] = useState(false);
	const [selectedFarm, setSelectedFarm] = useState([]);
	const [farmView, setFarmView] = useState(false);
	const [deleteFarmDialog, setDeleteFarmDialog] = useState(false);

	const fetchFarms = async () => {
		const token=await getValidAccessToken();
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
	const closeEvent = () => {
		fetchFarms();
		setAddVisible(false);
	};

	const deleteFarm = async () => {
		const farmID = farmToDelete.id;
		const token=await getValidAccessToken();
		const body = JSON.stringify({ farmID });
		const res = await fetch("http://127.0.0.1:8000/api/delete_farm/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body,
		});
		if (res.ok) {
			setDeleteFarmDialog(false);
			Swal.fire({
				icon: "success",
				title: "Farm Deleted",
				text: "you've successfully deleted a farm",
			}).then(fetchFarms());
		}
	};

    const toFieldView=(farm)=>{
        navigateTo("/fields/view",{state:{selectedFarm:farm}});
    }

	const actionBodyTemplate = (rowData) => {
		return (
			<div className="d-flex justify-content-around">
				<Button
					icon="pi pi-pencil"
					rounded
					outlined
					severity="info"
					onClick={() => editFarm(rowData)}
				/>
				<Button
					icon="pi pi-trash"
					rounded
					outlined
					severity="danger"
					onClick={() => confirmDeleteFarm(rowData)}
				/>
			</div>
		);
	};

    const fieldsBodyTemplate=(rowData)=>{
        return(
            <Button
					icon="pi pi-eye"
					rounded
					outlined
					severity="success"
					onClick={()=>toFieldView(rowData)}
				/>
        )
        
    }

	const onRowSelect = () => {
		setFarmView(true);
	};

	const onRowUnselect = () => {
		setFarmView(false);
		setSelectedFarm([]);
	};

	const confirmDeleteFarm = (farm) => {
		setFarmToDelete(farm);
		setDeleteFarmDialog(true);
	};

	const closeEdit = () => {
		fetchFarms();
		setSelectedFarm([]);
		setEditVisible(false);
	};

	const editFarm = (farm) => {
		setSelectedFarm(farm);
		setEditVisible(true);
	};

	const deleteFarmDialogFooter = (
		<React.Fragment>
			<Button
				label="No"
				icon="pi pi-times"
				outlined
				onClick={() => setDeleteFarmDialog(false)}
			/>
			<Button
				label="Yes"
				icon="pi pi-check"
				severity="danger"
				onClick={deleteFarm}
			/>
		</React.Fragment>
	);

	return (
		<section className="section-body">
			<div className="container pt-3">
				<div className="d-flex flex-wrap align-items-center justify-content-end mb-3">
					<Button
						label="Add Farm"
						icon="pi pi-plus"
						onClick={() => setAddVisible(true)}
					/>
				</div>
			</div>

			<DataTable
				editMode="row"
				className="w-100"
				value={farms}
				selectionMode={"single"}
				selection={selectedFarm}
				onSelectionChange={(e) => {
					setSelectedFarm(e.value);
				}}
				onRowSelect={onRowSelect}
				onRowUnselect={onRowUnselect}
				showGridlines
				stripedRows
			>
				{/* <Column
					header="Sl No"
					body={(rowData, { rowIndex }) => <>{rowIndex + 1}</>}
				></Column> */}
				<Column field="id" header="Farm ID"></Column>
				{/* <Column header="Status" body={statusBody} /> */}
				<Column
					field="name"
					header="Farm Name"
					body={(rowData) => <span className="fw-bold">{rowData.name}</span>}
				></Column>
				<Column field="location" header="Location" ></Column>
				<Column field="size_in_acres" header="Size(acres)"></Column>
                <Column header="Fields" body={fieldsBodyTemplate} align={"center"}></Column>
				<Column header="Action" body={actionBodyTemplate}></Column>
			</DataTable>

			<Dialog
				header="Add Farm"
				visible={addVisible}
				onHide={() => setAddVisible(false)}
			>
				<AddFarm onClose={closeEvent} />
			</Dialog>

			<Dialog header="Edit Farm" visible={editVisible} onHide={closeEdit}>
				<EditFarm farm={selectedFarm} onClose={closeEdit} />
			</Dialog>

			<Dialog
				visible={deleteFarmDialog}
				style={{ width: "32rem" }}
				breakpoints={{ "960px": "75vw", "641px": "90vw" }}
				footer={deleteFarmDialogFooter}
				header="Confirm"
				modal
				onHide={() => setDeleteFarmDialog(false)}
			>
				<div className="confirmation-content">
					<i
						className="pi pi-exclamation-triangle mr-3"
						style={{ fontSize: "2rem" }}
					/>
					{farmToDelete && (
						<span>
							Are you sure you want to delete <b>{farmToDelete.name}</b>?
						</span>
					)}
				</div>
			</Dialog>

			<Dialog
				header={`Farm #${selectedFarm.id}`}
				className="farm-view-box"
				visible={farmView}
				style={{ width: "60vw" }}
				onHide={onRowUnselect}
			>
				<section id="farm-view">
					<div className="container">
						{selectedFarm.name ? (
							<>
								<div className="row">
									<div className="col-6">
										<div className="card p-3 h-100">
											{selectedFarm.image != "" ? (
												<>
													<img
														src={`http://127.0.0.1:8000${selectedFarm.image}`}
														className="farmImg"
														alt=""
														
													/>
												</>
											) : (
												<>
													<span>No Farm Image found!!</span>
												</>
											)}
										</div>
									</div>
									<div className="col-6">
										<div className="card p-3 ">
											<h6 className="fw-bold">{selectedFarm.name}</h6>
											<span>{selectedFarm.location}</span>
											<span>{selectedFarm.size_in_acres} acres</span>
											<span>{selectedFarm.email}</span>
											<span>{selectedFarm.contact_number}</span>
										</div>
										
									</div>
									<div className="col-6 pt-3"></div>
								</div>
							</>
						) : (
							<></>
						)}
					</div>
				</section>
			</Dialog>
		</section>
	);
}

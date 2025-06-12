import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import Swal from "sweetalert2";
import { getValidAccessToken } from "../../tools/tokenValidation";
import "./livestocks.css";
import AddLivestock from "./addLivestock";
import EditLivestock from "./editLivestock";

export default function Livestocks() {
	const [livestocks, setLivestocks] = useState([]);
	const [addVisible, setAddVisible] = useState(false);
	const [editVisible, setEditVisible] = useState(false);
	const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
	const [selectedLivestock, setSelectedLivestock] = useState(null);
	const [livestockToDelete, setLivestockToDelete] = useState(null);
	const [viewDialogVisible, setViewDialogVisible] = useState(false);

	useEffect(() => {
		fetchLivestocks();
	}, []);

	const fetchLivestocks = async () => {
		const token = await getValidAccessToken();
		const res = await fetch("http://127.0.0.1:8000/api/fetch_livestocks/", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		if (res.ok) {
			const data = await res.json();
			setLivestocks(data);
		}
	};

	const deleteLivestock = async () => {
		const token = await getValidAccessToken();
		const res = await fetch("http://127.0.0.1:8000/api/delete_livestock/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ livestockID: livestockToDelete.id }),
		});
		if (res.ok) {
			setDeleteDialogVisible(false);
			Swal.fire("Deleted!", "Livestock has been deleted.", "success").then(() =>
				fetchLivestocks()
			);
		}
	};

	const confirmDeleteLivestock = (livestock) => {
		setLivestockToDelete(livestock);
		setDeleteDialogVisible(true);
	};

	const closeAdd = () => {
		setAddVisible(false);
		fetchLivestocks();
	};

	const closeEdit = () => {
		setEditVisible(false);
		setSelectedLivestock(null);
		fetchLivestocks();
	};

	const livestockActions = (rowData) => (
		<div className="d-flex justify-content-around">
			<Button
				icon="pi pi-eye"
				rounded
				text
				severity="info"
				onClick={() => {
					setSelectedLivestock(rowData);
					setViewDialogVisible(true);
				}}
			/>
			<Button
				icon="pi pi-pencil"
				rounded
				text
				severity="success"
				onClick={() => {
					setSelectedLivestock(rowData);
					setEditVisible(true);
				}}
			/>
			<Button
				icon="pi pi-trash"
				rounded
				text
				severity="danger"
				onClick={() => confirmDeleteLivestock(rowData)}
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
				onClick={deleteLivestock}
			/>
		</>
	);

	return (
		<section className="section-body">
			<div className="container pt-3">
				<div className="d-flex justify-content-end mb-3">
					<Button
						label="Add Livestock"
						icon="pi pi-plus"
						onClick={() => setAddVisible(true)}
					/>
				</div>
			</div>

			<DataTable value={livestocks} className="w-100" showGridlines stripedRows>
				<Column header="Sl No" body={(rowData, { rowIndex }) => rowIndex + 1} />
				<Column header="Tag" field="tag" />
				<Column header="Species" field="species" />
				<Column header="Farm" field="farm_name" />
				<Column header="Actions" body={livestockActions} />
			</DataTable>

			<Dialog
				header="Add Livestock"
				visible={addVisible}
				onHide={() => setAddVisible(false)}
			>
				<AddLivestock onClose={closeAdd} />
			</Dialog>

			<Dialog header="Edit Livestock" visible={editVisible} onHide={closeEdit}>
				<EditLivestock livestock={selectedLivestock} onClose={closeEdit} />
			</Dialog>

			<Dialog
				header="Confirm Delete"
				visible={deleteDialogVisible}
				onHide={() => setDeleteDialogVisible(false)}
				footer={deleteDialogFooter}
			>
				<p>
					Are you sure you want to delete <b>#{livestockToDelete?.tag}</b>?
				</p>
			</Dialog>
			<Dialog
				header={`Livestock #${selectedLivestock?.tag}`}
				visible={viewDialogVisible}
				onHide={() => setViewDialogVisible(false)}
				style={{ width: "50vw" }}
			>
				{selectedLivestock && (
					<>
						<div className="row ">
							<div className="col-6">
								<div className="card p-3 h-100 border-0">
									<p>
										<strong>Tag:</strong> {selectedLivestock.tag}
									</p>
									<p>
										<strong>Species:</strong> {selectedLivestock.species}
									</p>
									<p>
										<strong>Farm:</strong> {selectedLivestock.farm_name}
									</p>
								</div>
							</div>
              <div className="col-6">
                <div className="card p-3 h-100 border-0">
                  <p>
										<strong>Gender:</strong> {selectedLivestock.gender||'Not Specified'}
									</p>
									<p>
										<strong>Variety:</strong> {selectedLivestock.variety||'Not Specified'}
									</p>
                  <p>
										<strong>Color:</strong> {selectedLivestock.color||'Not Specified'}
									</p>
                </div>
              </div>
						</div>
					</>
				)}
			</Dialog>
		</section>
	);
}

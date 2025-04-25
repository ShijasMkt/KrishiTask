import React, { useEffect } from "react";
import { Dialog } from "primereact/dialog";
import CreateProject from "./createProject";
import { useState } from "react";
import { Button } from "primereact/button";
import ProjectCalendar from "./projectCalendar";

export default function Projects() {
	useEffect(() => {
		fetchProjects();
	}, []);

    const [calendarKey, setCalendarKey] = useState(0);
	const [projects, setProjects] = useState([]);
	const [addVisible, setAddVisible] = useState(false);

	const closeAdd = () => {
		setAddVisible(false);
        fetchProjects()
        setCalendarKey(prev => prev + 1);
	};

	const fetchProjects = async () => {
		const res = await fetch("http://127.0.0.1:8000/api/fetch_projects/");
		if (res.ok) {
			const data = await res.json();
			console.log(data);
			setProjects(data);
		}
	};
	return (
		<section className="section-body vh-150">
			<div className="container pt-3">
				<div className="d-flex  mb-3">
					<Button
						label="Create Project"
						icon="pi pi-plus"
						onClick={() => setAddVisible(true)}
					/>
				</div>

                <div>
                    <ProjectCalendar key={calendarKey}/>
                </div>
				<Dialog
					header="Create Project"
					visible={addVisible}
					onHide={() => setAddVisible(false)}
				>
					<CreateProject onClose={closeAdd} />
				</Dialog>
			</div>
		</section>
	);
}

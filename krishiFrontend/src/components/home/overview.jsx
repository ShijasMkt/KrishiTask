import React from "react";
import { useEffect, useState } from "react";
import "./overview.css";
import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = ["#28a745", "#dc3545"];

export default function Overview() {
	const [totals, setTotals] = useState();
	const [projectData, setProjectData] = useState([]);
	const [barData, setBarData] = useState();
	useEffect(() => {
		fetchTotals();
		fetchProjectStats();
		fetchProjectsPerFarm();
	}, []);

	const fetchTotals = async () => {
		const res = await fetch("http://127.0.0.1:8000/api/fetch_totals/");
		if (res.ok) {
			const data = await res.json();
			setTotals(data);
		}
	};

	const fetchProjectStats = async () => {
		const res = await fetch("http://127.0.0.1:8000/api/fetch_project_status/");
		if (res.ok) {
			const data = await res.json();
			setProjectData([
				{ name: "Completed", value: data.completed },
				{ name: "Not Completed", value: data.not_completed },
			]);
		}
	};

	const fetchProjectsPerFarm = () => {
		fetch("http://127.0.0.1:8000/api/fetch_projects_per_farm/")
			.then((res) => res.json())
			.then((json) => setBarData(json));
	};
	return (
		<section className="section-body">
			<div className="container pt-3">
				<div className="row">
					<div className="col-12 col-lg-7">
						<div className="row row-cols 3">
							<div className="col" >
								<div className="overview-card">
									<div className="card-body">
										<span>{totals?.total_farms}</span>
										<i className="fa-solid fa-tractor"></i>
									</div>
									<h6 className="mb-0">Total Farms</h6>
								</div>
							</div>
							<div className="col">
								<div className="overview-card">
									<div className="card-body">
										<span>{totals?.total_fields}</span>
										<i className="fa-solid fa-map"></i>
									</div>
									<h6 className="mb-0">Total Fields</h6>
								</div>
							</div>
							<div className="col">
								<div className="overview-card">
									<div className="card-body">
										<span>{totals?.total_crops}</span>
										<i className="fa-solid fa-wheat-awn"></i>
									</div>
									<h6 className="mb-0">Total Crops</h6>
								</div>
							</div>
						</div><div className="mt-4">
						<ResponsiveContainer width="100%" height={250}>
							<BarChart data={barData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis
									dataKey="name"
									angle={-45}
									textAnchor="end"
									height={70}
								/>
								<YAxis />
								<Tooltip />
								<Bar dataKey="project_count" fill="#4caf50" />
							</BarChart>
						</ResponsiveContainer>
					</div>
					</div>

					<div className="col-lg-5">
						<div className="chart-card">
							<h6 className="mb-3">Project Completion Status</h6>
							<ResponsiveContainer width="100%" height={250}>
								<PieChart>
									<Pie
										data={projectData}
										dataKey="value"
										nameKey="name"
										cx="50%"
										cy="50%"
										outerRadius={80}
										fill="#8884d8"
										label
									>
										{projectData.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={COLORS[index % COLORS.length]}
											/>
										))}
									</Pie>
									<Tooltip />
									<Legend />
								</PieChart>
							</ResponsiveContainer>
						</div>
					</div>
					
				</div>
			</div>
		</section>
	);
}

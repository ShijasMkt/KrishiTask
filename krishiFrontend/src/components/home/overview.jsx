import React from "react";
import { useEffect,useState } from "react";
import "./overview.css";

export default function Overview() {
    useEffect(()=>{
        fetchTotals()
    },[])

    const [totals,setTotals]=useState()
    const fetchTotals=async()=>{
        const res = await fetch("http://127.0.0.1:8000/api/fetch_totals/");
		if (res.ok) {
			const data = await res.json();
			setTotals(data);
		}
    }
	return (
		<section className="section-body">
            <div className="container pt-3">
			<div className="row row-cols-1 row-cols-lg-4">
				
                <div className="col">
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
			</div>
            </div>
		</section>
	);
}

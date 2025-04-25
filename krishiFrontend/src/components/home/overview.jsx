import React from "react";

import "./overview.css";

export default function Overview() {
	return (
		<section className="section-body">
            <div className="container pt-3">
			<div className="row row-cols-1 row-cols-lg-4">
				<div className="col">
					<div className="overview-card">
						<div className="card-body">
							<span>22</span>
							<i class="fa-solid fa-wave-square"></i>
						</div>
						<h6 className="mb-0">Total Farms</h6>
					</div>
				</div>
                <div className="col">
					<div className="overview-card">
						<div className="card-body">
							<span>100</span>
							<i class="fa-solid fa-wave-square"></i>
						</div>
						<h6 className="mb-0">Total Farms</h6>
					</div>
				</div>
                <div className="col">
					<div className="overview-card">
						<div className="card-body">
							<span>20+</span>
							<i class="fa-solid fa-wave-square"></i>
						</div>
						<h6 className="mb-0">Total Farms</h6>
					</div>
				</div>
                <div className="col">
					<div className="overview-card">
						<div className="card-body">
							<span>10</span>
							<i class="fa-solid fa-wave-square"></i>
						</div>
						<h6 className="mb-0">Total Farms</h6>
					</div>
				</div>
			</div>
            </div>
		</section>
	);
}

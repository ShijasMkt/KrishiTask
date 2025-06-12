import React from "react";
import "./sidebar.css";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
	const location = useLocation();
	const navigateTo = useNavigate();

	const menuItems = [
		{ label: "Dashboard", icon: "fa-solid fa-house", path: "/" },
		{ label: "Farms", icon: "fa-solid fa-tractor", path: "/farms/view" },
		{ label: "Fields", icon: "fa-solid fa-border-none", path: "/fields/" },
		{ label: "Crops", icon: "fa-solid fa-wheat-awn", path: "/crops/" },
		{ label: "Livestocks", icon: "fa-solid fa-cow", path: "/livestocks/" },
		{ label: "Projects", icon: "fa-solid fa-diagram-project", path: "/projects/" },
	];

	const handleMenuClick = (item) => {
		navigateTo(item.path);
	};

	const isActive = (item) => {
		if (item.path === "/") {
			return location.pathname === "/";
		}
		return location.pathname.startsWith(item.path);
	};


	return (
		<div className="sidebar-body">
			<div className="logo">
				<h5 className="text-theme">KrishiBot</h5>
			</div>
			<div className="menu-sec">
				<ul className="custom-menu">
					{menuItems.map((item, index) => (
						<li
							key={index}
							className={`menu-item ${isActive(item) ? "active" : ""}`}
							onClick={() => handleMenuClick(item)}
						>
							<i className={item.icon}></i>
							<span>{item.label}</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

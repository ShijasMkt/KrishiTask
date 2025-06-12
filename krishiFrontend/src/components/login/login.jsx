import React from "react";
import { useState, useRef } from "react";
import "./login.css";
import Cookies from "js-cookie";
import { Toast } from "primereact/toast";
import ReactPasswordChecklist from "react-password-checklist";
import { isValid } from "date-fns";

export default function Login() {
	const toast = useRef(null);
	const [currentCard, setCurrentCard] = useState("login");
	const [formData, setFormData] = useState({
		uName: "",
		password: "",
		email: "",
	});

	const { uName, password, email } = formData;
	const [isPasswordValid, setIsPasswordValid] = useState(false);
	const handleChange = (e) => {
		const { id, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[id]: value,
		}));
	};

	const registerUser = async (e) => {
		e.preventDefault();
		if (uName != "" && email != "" && password != "") {
			const body = JSON.stringify({ uName, email, password });
			const res = await fetch("http://127.0.0.1:8000/api/register_user/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body,
			});
			if (res.status == 201) {
				toast.current.show({
					severity: "success",
					summary: "Success",
					detail: "User Registered!",
					life: 3000,
				});
				setFormData({
					uName: "",
					password: "",
					email: "",
				});
				setCurrentCard("login");
			} else if (res.status == 400) {
				toast.current.show({
					severity: "error",
					summary: "Error",
					detail: "Email already exists!",
					life: 3000,
				});
				setFormData({
					uName: "",
					password: "",
					email: "",
				});
			} else {
				toast.current.show({
					severity: "error",
					summary: "Error",
					detail: "Cannot Register User!",
					life: 3000,
				});
			}
		} else {
			toast.current.show({
				severity: "error",
				summary: "Error",
				detail: "Please Enter all Fields!",
				life: 3000,
			});
		}
	};

	const checkLogin = async (e) => {
		e.preventDefault();

		const body = JSON.stringify({ email, password });
		const res = await fetch("http://127.0.0.1:8000/api/check_login/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body,
		});

		if (res.ok) {
			const data = await res.json();
			const { access, refresh } = data;

			Cookies.set("accessToken", access, {
				expires: 1,
				sameSite: "None",
				secure: true,
			});
			Cookies.set("refreshToken", refresh, {
				expires: 7,
				sameSite: "None",
				secure: true,
			});

			toast.current.show({
				severity: "success",
				summary: "Success",
				detail: "Logged In",
				life: 3000,
			});
			window.location = "/";
		} else {
			toast.current.show({
				severity: "error",
				summary: "Error",
				detail: "Invalid credentials!",
				life: 3000,
			});
		}
	};
	return (
		<div className="login-body">
			<Toast ref={toast} />
			<div className="row justify-content-center align-items-center">
				<div className="col-md-4">
					<div
						className={`card ${currentCard === "register" ? "flipped" : ""}`}
					>
						<div className="card-body">
							<div className="text-center">
								<h5 className="text-theme">KrishiBot</h5>
							</div>
							{currentCard === "login" ? (
								<form className="mt-3" onSubmit={checkLogin}>
									<div className="input-sec ">
										<label htmlFor="email" className="text-white fw-bold">
											Email
										</label>
										<input
											value={email}
											onChange={handleChange}
											type="email"
											id="email"
											className="form-control "
											placeholder="Enter Email"
											required
										/>
									</div>
									<div className="input-sec mt-3">
										<label htmlFor="pass" className="text-white fw-bold">
											Password
										</label>
										<input
											value={password}
											onChange={handleChange}
											type="password"
											id="password"
											className="form-control "
											placeholder="Enter Password"
											required
										/>
									</div>
									<div className="text-center mt-3">
										<button
											className="btn btn-login mt-3"
											type="submit"
										>
											Login
										</button>
									</div>
									<div className="text-center mt-2">
										<span
											className="register-link"
											onClick={() => {
												setCurrentCard("register");
											}}
										>
											Register Here
										</span>
									</div>
								</form>
							) : (
								//Register//
								<form className="mt-3" onSubmit={registerUser}>
									<div className="input-sec ">
										<label htmlFor="uName" className="text-white fw-bold">
											Username
										</label>
										<input
											value={uName}
											onChange={handleChange}
											type="text"
											id="uName"
											className="form-control "
											placeholder="Enter Username"
											required
										/>
									</div>
									<div className="input-sec mt-3">
										<label htmlFor="email" className="text-white fw-bold">
											Email
										</label>
										<input
											value={email}
											onChange={handleChange}
											type="email"
											id="email"
											className={`form-control `}
											placeholder="Enter Email"
											required
										/>
									</div>
									<div className="input-sec mt-3">
										<label htmlFor="pass" className="text-white fw-bold">
											Password
										</label>
										<input
											value={password}
											onChange={handleChange}
											type="password"
											id="password"
											className="form-control mb-2"
											placeholder="Enter Password"
											required
										/>
										<ReactPasswordChecklist
										rules={["minLength","specialChar","number","capital"]}
										minLength={6}
										value={password}
										onChange={(isValid)=>setIsPasswordValid(isValid)}
										className="password-check"
										/>
									</div>
									<div className="text-center mt-3">
										<button
											className="btn btn-login mt-3"
											type="submit"
											disabled={!isPasswordValid}
										>
											Register
										</button>
									</div>
									<div className="text-center mt-2">
										<span
											className="register-link"
											onClick={() => {
												setCurrentCard("login");
											}}
										>
											Already have an account? Login
										</span>
									</div>
								</form>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

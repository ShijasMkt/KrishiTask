import React from "react";
import { useEffect, useState } from "react";
import "./overview.css";



export default function Overview() {
	const apiKey=import.meta.env.VITE_WEATHER_API_KEY;
	const [weatherData,setWeatherData]=useState(null);
	const [city,setCity]=useState("Malappuram")
	useEffect(() => {
		fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`)
      .then((res) => res.json())
      .then((data) => setWeatherData(data))
      .catch((err) => console.error("Failed to fetch weather data:", err));
	}, [city]);

	
	return (
		<section className="section-body">
			<div className="container pt-3">
				<div className="row">
					<div className="col-8">
					<div className="row">
						<div className="col-6">
							<div className="card">
								<div className="card-body">
									Wheat data
								</div>
							</div>
						</div>
						<div className="col-6">
							<div className="card">
								<div className="card-body">
									Rice data
								</div>
							</div>
						</div>
					</div>
					</div>
					<div className="col-4">
					<div className="row">
						<div className="col-12">
							
							<div className="card weather-card">
								{weatherData!=null?<>
								<div className="d-flex justify-content-evenly  align-items-center">
									<div>
										<img src={weatherData.current.condition.icon} width={'50px'} />
									</div>
									
									<div>
										<span>Today</span>
										<h6 className="mb-0">{weatherData.current.temp_c} °c</h6>
										<span>{weatherData.current.condition.text}</span>
									</div>
								</div>
								</>:<>
								<div className="p-2">
									<h6>Weather data not available!!</h6>
								</div>
								
								</>}
							</div>
						</div>
					</div>
					</div>
				</div>
			</div>
		</section>
	);
}

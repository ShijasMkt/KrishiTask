import React,{useState,useEffect} from "react";
import "./fields.css";
import { useNavigate } from "react-router-dom";
import { getValidAccessToken } from "../../tools/tokenValidation";

export default function Fields() {

    const [farms, setFarms] = useState([]);
    const navigateTo=useNavigate();

    useEffect(() => {
		fetchFarms();
	}, []);

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

    const toFieldView=(farm)=>{
        navigateTo("/fields/view",{state:{selectedFarm:farm}});
    }
	return (
		<section className="section-body">
			<div className="container pt-3">
				<div className="row row-cols-3">
                    {farms.length>0?(
                        farms.map((farm,index)=>(
                            <div className="col" key={index}>
                            <div className="farm-card" onClick={()=>toFieldView(farm)}>
                                <i className="fa-solid fa-tractor tractor"></i>
                                <h5>{farm.name}</h5>
                                <div className="card-body">
                                    <span>
                                        Area : <span>{farm.size_in_acres} acres</span>
                                    </span>
                                    <span>
                                        Place : <span>{farm.location}</span>
                                    </span>
                                </div>
                                <i className="fa-solid fa-turn-down turn-down"></i>
                            </div>
                            </div>
                        ))
                    ):(
                        <div className="col">
                            <p>No farms available.</p>
                        </div>
                    )}
					
                    
					
				</div>
			</div>
		</section>
	);
}

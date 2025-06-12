import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import "primeicons/primeicons.css";
import "./App.css";

import Dashboard from "./components/home/dashboard";
import Login from "./components/login/login";
import Overview from "./components/home/overview";
import Farms from "./components/farms/farms";
import Fields from "./components/fields/fields";
import FieldView from "./components/fields/fieldView";
import Crops from "./components/crops/crops";
import Projects from "./components/projects/projects";
import CreateProject from "./components/projects/createProject";
import Livestocks from "./components/livestocks/livestocks";

import Cookies from "js-cookie";

const isLogged = () => {
	const token = Cookies.get("accessToken");
	return !!token;
};

const PrivateRoute = ({ children }) => {
	return isLogged() ? children : <Navigate to="/login" />;
};

function App() {
	return (
		<Router>
			<Routes>
				<Route
					path="/login"
					element={isLogged() ? <Navigate to="/" /> : <Login />}
				/>

				<Route
					path="/"
					element={
						<PrivateRoute>
							<Dashboard />
						</PrivateRoute>
					}
				>
					<Route index element={<Overview />} />
					<Route path="farms/view" element={<Farms />} />
					<Route path="fields" element={<Fields />} />
					<Route path="fields/view" element={<FieldView />} />
					<Route path="crops" element={<Crops />} />
					<Route path="projects" element={<Projects />} />
					<Route path="projects/create" element={<CreateProject />} />
					<Route path="livestocks" element={<Livestocks />} />
				</Route>

				<Route
					path="*"
					element={<Navigate to={isLogged() ? "/" : "/login"} />}
				/>
			</Routes>
		</Router>
	);
}

export default App;

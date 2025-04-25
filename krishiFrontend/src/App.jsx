import { BrowserRouter as Router, Route, Routes, Navigate, Link ,ScrollRestoration} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import 'primereact/resources/themes/bootstrap4-light-blue/theme.css';
import 'primeicons/primeicons.css';
import './App.css'
import Dashboard from "./components/home/dashboard";
import Login from "./components/login/login";
import Overview from "./components/home/overview";
import Farms from "./components/farms/farms";
import Cookies from "js-cookie";
import Fields from "./components/fields/fields";
import FieldView from "./components/fields/fieldView";
import Crops from "./components/crops/crops";

function App() {
  const isLogged = () => {
    const accessToken = Cookies.get('accessToken');
    return !!accessToken;
  }

  const isUserLogged=isLogged();
  return(
    <>
    <Router>
      <Routes>
        <Route path='/' element={isUserLogged? <Dashboard/>: <Login/>}>
            <Route index element={<Overview/>}/>
            <Route path='*' element={<Navigate to="/" />}/>
            <Route path='farms/view' element={<Farms/>}/>
            <Route path='fields' element={<Fields/>}/>
            <Route path='fields/view' element={<FieldView/>}/>
            <Route path='crops' element={<Crops/>}/>

        </Route>
      </Routes>
    </Router>
    </>
  )
}

export default App

import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from './components/Login';
import Admin from './components/Config/Admin';
import Client from './components/Config/Client';
import ChooseLogin from './components/LoginAs/choose.login';
import DashboardInitializer from './components/NewDashboard/dashboard.container.initializer';
import WindowPrint from './components/NewDashboard/window.print/window.print';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path = "/login" exact element = {<Login />} />
          <Route path = "/admin-config" exact element = {<Admin />} />
          <Route path = "/:id/client-config" exact element = {<Client />} />
          <Route path = "/:id/chooselogin" exact element = {<ChooseLogin /> } />
          <Route path = "/windowprint" element = {<WindowPrint />} />
          <Route path = "/:id/dashboardcontainer" exact element = {<DashboardInitializer />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

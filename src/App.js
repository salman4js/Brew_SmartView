import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import AppStartUpWrapper from "./components/startup/app.startup";
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
          <Route path = "/startup" exact element = {<AppStartUpWrapper />} />
          <Route path = "/admin-config" exact element = {<Admin />} />
          <Route path = "/:id/client-config" exact element = {<Client />} />
          <Route path = "/:id/choose-login" exact element = {<ChooseLogin /> } />
          <Route path = "/windowprint" element = {<WindowPrint />} />
          <Route path = "/:id/dashboard-container" exact element = {<DashboardInitializer />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

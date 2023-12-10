import './App.css';
import './customHtmlContent.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import Rooms from './components/Rooms';
import Dishes from './components/Dishes';
import Notifications from './components/Notifications';
import AddRooms from './components/AddRooms';
import UpdateRooms from './components/UpdateRooms';
import AddDishes from './components/AddDishes';
import UpdateDishes from './components/UpdateDishes';
import UserDb from './components/UserDb';
import ConfigureBill from './components/ConfigureBill';
import EditConfig from './components/EditConfig';
import Generator from './components/Generator';
import EditDish from './components/EditDish';
import Loading from './components/Loading';
import ContentNative from './components/ContentNative';
import Prebook_rooms from './components/PreBook/Prebook_rooms';
import AddData from './components/Configure_Transport/src/AddData';
import AddMode from './components/Configure_Transport/AddMode';
import Admin from './components/Config/Admin';
import Client from './components/Config/Client';
import Dashboard from './components/Dashboard/Dashboard';
import Charts from './components/Dashboard/Chart/Charts';
import EditRoom from './components/edit.room.view/edit.room.view';
import PrebookCheckin from './components/prebook.view/prebook.checkin.view';
import VoucherView from './components/vouchers/vouchers.view';
import ChooseLogin from './components/LoginAs/choose.login';
import ManageRecep from './components/ManageRecep/manage.recep';
import PaymentTracker from './components/paymentTracker/payment.tracker';
import RefundTracker from './components/refund.tracker/refund.tracker.view';
import DashboardInitializer from './components/NewDashboard/dashboard.container.initializer';
import WindowPrint from './components/NewDashboard/window.print/window.print';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path = "/login" exact element = {<Login />} />
          <Route path = "/admin-config" exact element = {<Admin />} />
          <Route path = "/:id/dashboard" exact element = {<Dashboard />} />
          <Route path = "/:id/landingpage" exact element = {<LandingPage />} />
          <Route path = "/:id/editroom" exact element = {<EditRoom />} />
          <Route path = "/:id/rooms" exact element = {<Rooms />} />
          <Route path = "/:id/prebookcheckin" exact element = {<PrebookCheckin />} />
          <Route path = "/:id/prebookrooms" exact element = {<Prebook_rooms />} />
          <Route path = "/:id/dishes" exact element = {<Dishes />} />
          <Route path = "/:id/notifications" exact element = {<Notifications />} />
          <Route path = "/:id/addrooms" exact element = {<AddRooms />} />
          <Route path = "/:id/updaterooms" exact element = {<UpdateRooms />} />
          <Route path = "/:id/adddishes" exact element = {<AddDishes />} />
          <Route path = "/:id/updatedishes" exact element = {<UpdateDishes />} />
          <Route path = "/:id/userdb" exact element = {<UserDb />} />
          <Route path = "/:id/configure" exact element = {<ConfigureBill />} />
          <Route path = "/:id/editconfig" exact element = {<EditConfig />} />
          <Route path = "/:id/generator" exact element = {<Generator /> } />
          <Route path = "/:id/editdish" exact element = {<EditDish />} />
          <Route path = "/:id/loading" exact element = {<Loading />} />
          <Route path = "/:id/contentnative" exact element = {<ContentNative />} />
          <Route path = "/:id/addData" exact element = {<AddData />} />
          <Route path = "/:id/addmode" exact element = {<AddMode />} />
          <Route path = "/:id/client-config" exact element = {<Client />} />
          <Route path = "/:id/chart-dashboard" exact element = {<Charts />} />
          <Route path = "/:id/vouchers" exact element = {<VoucherView />} />
          <Route path = "/:id/chooselogin" exact element = {<ChooseLogin /> } />
          <Route path = "/:id/managerecep" exact element = {<ManageRecep />} />
          <Route path = "/:id/paymenttracker" exact element = {<PaymentTracker />} />
          <Route path = "/:id/refundtracker" exact element = {<RefundTracker />} />
          <Route path = "/windowprint" element = {<WindowPrint />} />
          // New Dashboard Routes Starts from here!
          <Route path = "/:id/dashboardcontainer" exact element = {<DashboardInitializer />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

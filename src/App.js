import './App.css';
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

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path = "/login" exact element = {<Login />} />
          <Route path = "/:id/landingpage" exact element = {<LandingPage />} />
          <Route path = "/:id/rooms" exact element = {<Rooms />} />
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
        </Routes>
      </Router>
    </div>
  );
}

export default App;

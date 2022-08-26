import logo from './logo.svg';
import './App.css';

import {BrowserRouter , Routes , Route , Link} from 'react-router-dom'
import Register from './screens/Register';
import Login from './screens/Login';
import Home from './screens/Home';
import Nav from './screens/Nav';
import Player from './screens/Player';
import Landing from './screens/Landing';
import Admin from './screens/Admin';
import Editvideo from './screens/Editvideo';
import Videoform from './screens/Videoform';
function App() {
  return (
    <div className="App">
      <Nav/>
     <BrowserRouter>
      <Routes>
      <Route path='/home' element={<Home/>}/>
      <Route path='/api/newvideo/:id' element={<Player/>}/>
      <Route path='/api/newvideo/editvideo/:id' element={<Editvideo/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/admin' element={<Admin/>}/>
      <Route path='/' element={<Landing/>}/>
      <Route path='/videoform' element={<Videoform/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

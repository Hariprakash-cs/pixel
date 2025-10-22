import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./screens/Register";
import Login from "./screens/Login";
import Home from "./screens/Home";
import Nav from "./screens/Nav";
import ContentstackPlayer from "./screens/ContentstackPlayer";
import Landing from "./screens/Landing";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route
            path="/contentstack/:contentType"
            element={<ContentstackPlayer />}
          />
          <Route
            path="/contentstack/:contentType/:entryId"
            element={<ContentstackPlayer />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

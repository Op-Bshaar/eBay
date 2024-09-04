import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Navbar from "./components/nav/Navbar";
function App() {
    return (
        <BrowserRouter>
          <Navbar />
              <Routes>
                  <Route path="/" />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
            <Navbar />
            <Routes>
                <Route path="/" element={<div>Home</div>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

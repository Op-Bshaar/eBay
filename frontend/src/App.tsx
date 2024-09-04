import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Navbar from "./components/nav/Navbar";
function App() {
  return (
      <div className="tajawal-extralight">
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;

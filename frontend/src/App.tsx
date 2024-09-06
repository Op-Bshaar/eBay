import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/login/login";
import Register from "./pages/login/register";
import Navbar from "./components/nav/Navbar";
import Home from "./pages/Home/Home";
import AuthenticationProvider from "./context/AuthenticationProvider";
import ProductsDeatils from "./pages/ProductsDeatils/productsDeatils";
function App() {
  return (
    <AuthenticationProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products/:id" element={<ProductsDeatils />} />
        </Routes>
      </BrowserRouter>
    </AuthenticationProvider>
  );
}

export default App;

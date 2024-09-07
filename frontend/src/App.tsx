import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/login/login";
import Register from "./pages/login/register";
import Navbar from "./components/nav/Navbar";
import Home from "./pages/Home/Home";
import AuthenticationProvider from "./context/AuthenticationProvider";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Settings from "./pages/admin/Settings";
import SearchPage from "./pages/Search/Search";
function App() {
    return (
        <AuthenticationProvider>
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/products/search" element={<SearchPage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/admin/dashboard" element={<Dashboard />} />
                        <Route path="/admin/users" element={<Users />} />
                        <Route path="/admin/settings" element={<Settings />} />
                    </Routes>
                </BrowserRouter>
        </AuthenticationProvider>
    );
}

export default App;

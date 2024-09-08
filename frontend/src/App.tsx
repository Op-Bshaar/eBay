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
import ProductsDeatils from "./pages/ProductsDeatils/productsDeatils";
import EmailVerification from "./pages/login/EmailVerification";
import { PAGE_URLS } from "./constants/URL";
import Password from "./pages/login/password";

function App() {
  return (
    <AuthenticationProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path={PAGE_URLS.home} element={<Home />} />
          <Route path={PAGE_URLS.search} element={<SearchPage />} />
          <Route path={PAGE_URLS.login} element={<Login />} />
          <Route path={PAGE_URLS.register} element={<Register />} />
          <Route path={PAGE_URLS.password} element={<Password />} />
          <Route
            path={PAGE_URLS.email_verification}
            element={<EmailVerification />}
          />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/products/:id" element={<ProductsDeatils />} />
        </Routes>
      </BrowserRouter>
    </AuthenticationProvider>
  );
}

export default App;

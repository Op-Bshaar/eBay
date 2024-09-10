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
import UpdateEmail from "./pages/UpdateEmail/UpdateEmail";
import ReloadUser from "./pages/ReloadUser";
import RestPassword from "./pages/login/restpassword";
import ProductForm from "./pages/Sell/Sell";
function App() {
    const request_email_verification = <ReloadUser redirectTo={PAGE_URLS.email_verification} />;
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
                    <Route path={PAGE_URLS.restpassword} element={<RestPassword />} />
                    <Route path={PAGE_URLS.reload_user} element={<ReloadUser />} />
                    <Route path={PAGE_URLS.email_verification} element={<EmailVerification />} />
                    <Route path={PAGE_URLS.email_verified_successfuly} element={request_email_verification} />
                    <Route path={PAGE_URLS.update_email} element={<UpdateEmail />} />
                    <Route path={PAGE_URLS.request_email_verification} element={request_email_verification} />
                    <Route path={PAGE_URLS.invalid_email_verification_link} element={request_email_verification} />
                    <Route path="/admin/dashboard" element={<Dashboard />} />
                    <Route path="/admin/users" element={<Users />} />
                    <Route path="/admin/settings" element={<Settings />} />
                    <Route path="/products/:id" element={<ProductsDeatils />} />
                    <Route path="/sell" element={<ProductForm/>}/>
                </Routes>
            </BrowserRouter>
        </AuthenticationProvider>
    );
}

export default App;

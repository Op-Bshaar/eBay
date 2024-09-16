import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/login/login";
import Register from "./pages/login/register";
import Navbar from "./components/nav/Navbar";
import Home from "./pages/Home/Home";
import AdminProducts from "../../admindashboard/src/Pages/AdminProducts"
import AdminOrders from "../../admindashboard/src/Pages/AdminOrders"
import DashBoard from "../../admindashboard/src/Pages/dashboard";
import AdminChartsMenu from "../../admindashboard/src/Pages/Charts/AdminChartsMenu";
import ProductNameChart from "../../admindashboard/src/Pages/Charts/ProductNameChart";
import Users from "../../admindashboard/src/Pages/Users";
import Settings from "../../admindashboard/src/Pages/Settings";
import SearchPage from "./pages/Search/Search";
import ProductsDeatils from "./pages/ProductsDeatils/productsDeatils";
import EmailVerification from "./pages/login/EmailVerification";
import { PAGE_URLS } from "./constants/URL";
import RequestPasswordReset from "./pages/login/password";
import UpdateEmail from "./pages/UpdateEmail/UpdateEmail";
import ReloadUser from "./pages/ReloadUser";
import RestPassword from "./pages/login/restpassword";
import ProductForm from "./pages/Sell/Sell";
import AuthenticationProvider from "./context/AuthenticationProvider";
import CartProvider from "./context/cartProvider";
import CartPage from "./pages/Cart/CartPage";
import OrderPage from "./pages/Order/OrderPage";
import GetAllOrder from "./pages/Order/GetAllOrder";
function App() {
    const request_email_verification = <ReloadUser redirectTo={PAGE_URLS.email_verification} />;
    return (
        <AuthenticationProvider>
            <CartProvider>
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path={PAGE_URLS.home} element={<Home />} />
                        <Route path={PAGE_URLS.search} element={<SearchPage />} />
                        <Route path={PAGE_URLS.login} element={<Login />} />
                        <Route path={PAGE_URLS.register} element={<Register />} />
                        <Route path={PAGE_URLS.password} element={<RequestPasswordReset />} />
                        <Route path={PAGE_URLS.restpassword} element={<RestPassword />} />
                        <Route path={PAGE_URLS.reload_user} element={<ReloadUser />} />
                        <Route path={PAGE_URLS.email_verification} element={<EmailVerification />} />
                        <Route path={PAGE_URLS.email_verified_successfuly} element={request_email_verification} />
                        <Route path={PAGE_URLS.update_email} element={<UpdateEmail />} />
                        <Route path={PAGE_URLS.request_email_verification} element={request_email_verification} />
                        <Route path={PAGE_URLS.invalid_email_verification_link} element={request_email_verification} />
                        <Route path={PAGE_URLS.cart} element= <CartPage/> />
                        <Route path={"/orders/:id"} element= <OrderPage/> />
                        <Route path="/admin/dashboard" element={<DashBoard />} /> 
                        <Route path="/admin/users" element={<Users />} />
                        <Route path="/admin/settings" element={<Settings />} />
                        <Route path="/admin" element={<DashBoard />} />
                        <Route path="/admin/products" element={<AdminProducts />} />
                        <Route path="/admin/orders" element={<AdminOrders />} /> 
                        <Route path="admin/statistics" element={<AdminChartsMenu/>}/>
                        <Route path="/admin/statistics/ProductNameChart" element={<ProductNameChart />} />
                        <Route path="/products/:id" element={<ProductsDeatils />} />
                        <Route path="/sell" element={<ProductForm />} />
                        <Route path={PAGE_URLS.order}element={<GetAllOrder/>}/>
                    </Routes>
                </BrowserRouter>
            </CartProvider>
        </AuthenticationProvider>
    );
}

export default App;

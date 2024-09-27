import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "../src/styles/App.css";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Navbar from "./components/nav/Navbar";
import Home from "./pages/Home/Home";
import SearchPage from "./pages/Search/Search";
import ProductsDeatils from "./pages/ProductsDeatils/productsDeatils";
import EmailVerification from "./pages/EmailVerification/EmailVerification";
import { PAGE_URLS } from "./constants/URL";
import RequestPasswordReset from "./pages/ForgetPassword/password";
import UpdateEmail from "./pages/UpdateEmail/UpdateEmail";
import ReloadUser from "./components/ReloadUser/ReloadUser";
import RestPassword from "./pages/RestPassword/restpassword";
import AuthenticationProvider from "./context/AuthenticationProvider";
import CartProvider from "./context/cartProvider";
import CartPage from "./pages/Cart/CartPage";
import OrderPage from "./pages/Order/OrderPage";
import GetAllOrder from "./pages/Order/GetAllOrder";
import OrderStatusPage from "./pages/Order/OrderStatusPage";
import AdminRoute from "./context/AdminRoute";

import { lazy, Suspense } from "react";
import SellerPortal from "./pages/SellerPortal/SellerPortal";
import EditProfile from "./pages/EditProfile/EditProfile";
const SellerProducts = lazy(() => import("./pages/sellers/sellers"));
const ProductForm = lazy(() => import("./pages/Sell/Sell"));
const SellerOrder = lazy(() => import("./pages/SellerOrder/SellerOrder"));
const SellerOrders = lazy(
  () => import("./pages/getSellerOrders/GetSellerOrders")
);
const AdminProducts = lazy(
  () => import("../../admindashboard/src/Pages/AdminProducts")
);
const AdminOrders = lazy(
  () => import("../../admindashboard/src/Pages/AdminOrders")
);
const DashBoard = lazy(
  () => import("../../admindashboard/src/Pages/dashboard")
);
const AdminChartsMenu = lazy(
  () => import("../../admindashboard/src/Pages/Charts/AdminChartsMenu")
);
const ProductNameChart = lazy(
  () => import("../../admindashboard/src/Pages/Charts/ProductNameChart")
);
const ThisWeekUploads = lazy(
  () => import("../../admindashboard/src/Pages/Charts/ThisWeekUploadsChart")
);
const Users = lazy(() => import("../../admindashboard/src/Pages/Users"));
const Settings = lazy(() => import("../../admindashboard/src/Pages/Settings"));
function App() {
  const request_email_verification = (
    <ReloadUser>
      <EmailVerification />
    </ReloadUser>
  );
  const loader = (
    <div style={{ marginTop: "30vh" }} className="loader center-loader" />
  );
  return (
    <AuthenticationProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={<Navigate to={PAGE_URLS.home} replace />}
            />
            <Route path={PAGE_URLS.home} element={<Home />} />
            <Route path={PAGE_URLS.search} element={<SearchPage />} />
            <Route path={PAGE_URLS.login} element={<Login />} />
            <Route path={PAGE_URLS.register} element={<Register />} />
            <Route
              path={PAGE_URLS.password}
              element={<RequestPasswordReset />}
            />
            <Route path={PAGE_URLS.restpassword} element={<RestPassword />} />
            <Route
              path={PAGE_URLS.email_verification}
              element={request_email_verification}
            />
            <Route
              path={PAGE_URLS.email_verified_successfuly}
              element={request_email_verification}
            />
            <Route path={PAGE_URLS.update_email} element={<UpdateEmail />} />
            <Route path={PAGE_URLS.editprofile} element={<EditProfile />} />
            <Route
              path={PAGE_URLS.request_email_verification}
              element={request_email_verification}
            />
            <Route
              path={PAGE_URLS.invalid_email_verification_link}
              element={request_email_verification}
            />
            <Route path="/products/:id" element={<ProductsDeatils />} />
            <Route path={PAGE_URLS.cart} element={<CartPage />} />
            <Route path={PAGE_URLS.place_order} element={<OrderPage />} />
            <Route path={PAGE_URLS.view_order} element={<OrderStatusPage />} />
            <Route path={PAGE_URLS.all_orders} element={<GetAllOrder />} />
            <Route path="/seller-portal" element={<SellerPortal />}>
              <Route
                path="products"
                element={
                  <Suspense fallback={loader}>
                    <SellerProducts />
                  </Suspense>
                }
              />
              <Route
                path="products/:id"
                element={<ProductsDeatils viewer="seller" />}
              />
              <Route
                path="add-product"
                element={
                  <Suspense fallback={loader}>
                    <ProductForm />
                  </Suspense>
                }
              />
              <Route
                path="orders/:order_id"
                element={
                  <Suspense fallback={loader}>
                    <SellerOrder />
                  </Suspense>
                }
              />
              <Route
                path="orders"
                element={
                  <Suspense fallback={loader}>
                    <SellerOrders />
                  </Suspense>
                }
              />
              <Route
                path="products/:id"
                element={
                  <Suspense fallback={loader}>
                    <ProductForm />
                  </Suspense>
                }
              />
            </Route>

            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <Suspense fallback={loader}>
                    <DashBoard />
                  </Suspense>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <Suspense fallback={loader}>
                    <Users />
                  </Suspense>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <AdminRoute>
                  <Suspense fallback={loader}>
                    <Settings />
                  </Suspense>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <Suspense fallback={loader}>
                    <AdminProducts />
                  </Suspense>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <Suspense fallback={loader}>
                    <AdminOrders />
                  </Suspense>
                </AdminRoute>
              }
            />
            <Route
              path="admin/statistics"
              element={
                <AdminRoute>
                  <Suspense fallback={loader}>
                    <AdminChartsMenu />
                  </Suspense>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/statistics/ProductNameChart"
              element={
                <AdminRoute>
                  <Suspense fallback={loader}>
                    <ProductNameChart />
                  </Suspense>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/statistics/TopUploadsThisWeek"
              element={
                <AdminRoute>
                  <Suspense fallback={loader}>
                    <ThisWeekUploads />
                  </Suspense>
                </AdminRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthenticationProvider>
  );
}

export default App;

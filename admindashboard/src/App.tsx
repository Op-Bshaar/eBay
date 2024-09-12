import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import AdminOrders from "./Pages/AdminOrders";
import AdminProducts from "./Pages/AdminProducts";
import { useAuthenticationContext } from "./context/AuthenticationContext";
import Login from "./Pages/login/login";
import DashBoard from "./Pages/dashboard";
import Users from "./Pages/Users";
import { useIsAuthenticated } from "./api";

function App() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        {isAuthenticated ? (
          <>
            <Route path="/admin/dashboard" element={<DashBoard />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

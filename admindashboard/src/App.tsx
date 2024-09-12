import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthenticationProvider from "./context/AuthenticationProvider";
import Login from "./Pages/login/login";
import DashBoard from "./Pages/dashboard";

function Dashboard() {
  return (
    // <AuthenticationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="admin/dashobaard" element={<DashBoard />} />
        </Routes>
      </BrowserRouter>
    // </AuthenticationProvider>
  );
}

export default Dashboard;

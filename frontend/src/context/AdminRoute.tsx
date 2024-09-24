import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthenticationContext } from "./AuthenticationContext"; 
interface AdminRouteProps
{
    children: ReactNode;
}
const AdminRoute = ({children}: AdminRouteProps) => {
  const { user } = useAuthenticationContext(); 


  if (!user || !(user.isAdmin)) {
    return <Navigate to="/" replace />; 
  }

  return children; 
};

export default AdminRoute;

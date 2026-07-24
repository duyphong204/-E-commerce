import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../redux/store";
import { UserRole } from "../../types";

interface ProtectedRouteProps {
  children: React.ReactElement;
  role?: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user || (role && user.role !== role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const id_usuario = localStorage.getItem("id_usuario");

    if (!id_usuario) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;

import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            toast.error("Access Denied: Please login first");
        }
    }, [token]);

    if (!token) {
        return <Navigate to="/" replace />;
    }


    return children;
};

export default ProtectedRoute;

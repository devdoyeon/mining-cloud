import { Navigate } from "react-router-dom";

const PublicRoute = ({ restricted, children }) => {
    if (restricted && localStorage.getItem("token")) return <Navigate to="/home" />;
    return children;
};

export default PublicRoute;

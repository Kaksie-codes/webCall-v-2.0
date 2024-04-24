import { UserContext } from "@/context/usercontext/UserContext";
import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom"

const PrivateRoute = () => {
    const { state } = useContext(UserContext);
    const { isAuthenticated } = state;

    // console.log("private route auth --->> ", isAuthenticated);

    return isAuthenticated ? <Outlet/> : <Navigate to={'/auth'} replace/>
}

export default PrivateRoute
import { Navigate, Outlet } from "react-router-dom";

export function PrivateRoute() {
    const token = localStorage.getItem("x-access-token");

    // Se não houver token salvo, redireciona direto para o login
    return token ? <Outlet /> : <Navigate to="/login" replace />;
}
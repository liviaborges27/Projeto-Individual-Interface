import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Navegacao from "./components/Navegacao/Navegacao";
import Rodape from "./components/Rodape/Rodape";
import PLogin from "./pages/PLogin/PLogin";
import Home from "./pages/Home/Home";
import PHome from "./pages/PHome/PHome";
import PCategorias from "./pages/PCategorias/PCategorias";
import PMovimentacoes from "./pages/PMovimentacao/PMovimentacao";
import "./App.css";

// Componente Guardião: verifica se o usuário possui token ativo
function PrivateRoute() {
  const token = localStorage.getItem("x-access-token");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

// Shell com Navegação e Rodapé
function AppShell() {
  return (
    <div className="app-layout">
      <Navegacao />
      <div className="app-content"><Outlet /></div>
      <Rodape />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública de Login (fora do AppShell) */}
        <Route path="/login" element={<PLogin />} />

        {/* Rotas Protegidas (exigem Token e carregam o AppShell) */}
        <Route element={<PrivateRoute />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<Home />} />
            <Route path="/produtos" element={<PHome />} />
            <Route path="/categorias" element={<PCategorias />} />
            <Route path="/movimentacoes" element={<PMovimentacoes />} />
          </Route>
        </Route>

        {/* Redirecionamento padrão para URLs inexistentes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
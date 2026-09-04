import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PHome from "./pages/PHome/PHome";
import PCategorias from "./pages/PCategorias/PCategorias";
import PMovimentacoes from "./pages/PMovimentacao/PMovimentacao";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Principal: Gestão de Produtos */}
        <Route path="/" element={<PHome />} />

        {/* Gestão de Categorias */}
        <Route path="/categorias" element={<PCategorias />} />

        {/* Histórico e Registro de Movimentações */}
        <Route path="/movimentacoes" element={<PMovimentacoes />} />

        {/* Redirecionamento para rotas inexistentes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
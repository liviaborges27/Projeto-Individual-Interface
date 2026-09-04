import { type JSX } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Boxes, Home, LogOut, RefreshCw, Tags } from "lucide-react";
import "./Navegacao.css";

function Navegacao(): JSX.Element {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("x-access-token");
        localStorage.removeItem("user_info");
        navigate("/login", { replace: true });
    };

    const items = [
        {
            label: 'Home',
            icon: Home,
            url: "/"
        },
        {
            label: 'Produtos',
            icon: Boxes,
            url: "/produtos"
        },
        {
            label: 'Categorias',
            icon: Tags,
            url: "/categorias"
        },
        {
            label: 'Movimentações',
            icon: RefreshCw,
            url: "/movimentacoes"   
        }
    ];

    return (
        <header className="site-header">
            <nav className="site-nav" aria-label="Navegação principal">
                <NavLink to="/" className="site-brand" aria-label="InfoTech Admin - início">
                    <span>InfoTech <strong>Admin</strong></span>
                </NavLink>
                <div className="nav-links">
                    {items.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink key={item.label} to={item.url} end={item.url === "/"} className="nav-link">
                                <Icon size={17} strokeWidth={2.2} aria-hidden="true" />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </div>
                <div className="user-profile">
                    <div className="user-copy">
                        <span className="user-name">InfoTech Admin</span>
                        <span className="user-role"><span className="user-status-dot" /> Administrador</span>
                    </div>
                    <img src="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" alt="Avatar de InfoTech Admin" className="user-avatar" />
                    <button className="logout-button" type="button" onClick={handleLogout} title="Sair do sistema">
                        <LogOut size={17} aria-hidden="true" />
                        <span>Sair</span>
                    </button>
                </div>
            </nav>
        </header>
    );
}

export default Navegacao;
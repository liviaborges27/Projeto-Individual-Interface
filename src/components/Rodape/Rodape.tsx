import { type JSX } from "react";
import { HeartHandshake } from "lucide-react";
import "./Rodape.css";

function Rodape(): JSX.Element {
    return (
        <footer className="site-footer">
            <div className="footer-inner">
                <span className="footer-brand"><HeartHandshake size={16} /> InfoTech Admin</span>
                <span>© 2026 InfoTech Admin. Todos os direitos reservados.</span>
                <span className="footer-version">v1.0.0</span>
            </div>
        </footer>
    );
}

export default Rodape;
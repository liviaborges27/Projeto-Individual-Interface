import { useState, type FormEvent } from "react";
import { Lock, Mail, LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthRequests } from "../../fetch/AuthRequests";
import "./PLogin.css";

type LoginForm = {
    email: string;
    senha: string;
};

type LoginResponse = {
    token?: string;
    usuario?: unknown;
};

export default function PLogin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<LoginForm>({ email: "", senha: "" });
    const [mensagemErro, setMensagemErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    const handleChange = (field: keyof LoginForm, value: string) => {
        setFormData((current) => ({ ...current, [field]: value }));
        if (mensagemErro) setMensagemErro("");
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMensagemErro("");
        setCarregando(true);

        try {
            const response = await AuthRequests.login(formData) as LoginResponse;

            if (!response.token) {
                throw new Error("A resposta do servidor não contém um token de acesso.");
            }

            localStorage.setItem("x-access-token", response.token);
            localStorage.setItem("user_info", JSON.stringify(response.usuario ?? {}));
            navigate("/", { replace: true });
        } catch (error) {
            setMensagemErro(error instanceof Error ? error.message : "Não foi possível realizar o login.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <main className="login-page">
            <section className="login-card" aria-labelledby="login-title">
                <div className="login-heading">
                    <span className="login-mark" aria-hidden="true">IT</span>
                    <h1 id="login-title">InfoTech Admin</h1>
                    <p>Painel de Controle e Gestão</p>
                </div>

                {mensagemErro && <div className="login-alert" role="alert">{mensagemErro}</div>}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-field">
                        <label htmlFor="login-email">E-mail</label>
                        <div className="login-input-wrap">
                            <Mail size={18} aria-hidden="true" />
                            <input id="login-email" type="email" value={formData.email} onChange={(event) => handleChange("email", event.target.value)} placeholder="seu.email@empresa.com" autoComplete="email" required />
                        </div>
                    </div>

                    <div className="login-field">
                        <label htmlFor="login-senha">Senha</label>
                        <div className="login-input-wrap">
                            <Lock size={18} aria-hidden="true" />
                            <input id="login-senha" type="password" value={formData.senha} onChange={(event) => handleChange("senha", event.target.value)} placeholder="Digite sua senha" autoComplete="current-password" required />
                        </div>
                    </div>

                    <button className="login-submit" type="submit" disabled={carregando}>
                        {carregando ? <><LoaderCircle className="login-spinner" size={18} aria-hidden="true" /> Autenticando...</> : "Entrar no Sistema"}
                    </button>
                </form>
            </section>
        </main>
    );
}
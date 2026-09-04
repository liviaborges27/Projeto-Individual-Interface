import { useEffect, useState } from "react";
import { Filter, FolderOpen, Pencil, Search, Tags, Trash2 } from "lucide-react";
import type CategoriaDTO from "../../dto/CategoriaDTO";
import { CategoriaRequests } from "../../fetch/CategoriaRequests";
import { FormularioCategoria } from "../../components/FormularioCategoria/FormularioCategoria";
import "./PCategorias.css";

export default function PCategorias() {
    const [categorias, setCategorias] = useState<Array<CategoriaDTO>>([]);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<CategoriaDTO | null>(null);
    const [mensagemStatus, setMensagemStatus] = useState<string | null>(null);
    const [tipoStatus, setTipoStatus] = useState<"sucesso" | "erro">("sucesso");
    const [carregando, setCarregando] = useState<boolean>(true);
    const [termoBusca, setTermoBusca] = useState("");
    const editingId = categoriaSelecionada?.id_categoria ?? null;

    const categoriasFiltradas = categorias.filter((cat) => {
        const termo = termoBusca.trim().toLowerCase();
        return !termo || cat.nome.toLowerCase().includes(termo);
    });

    const carregarCategorias = async () => {
        setCarregando(true);
        try {
            const lista = await CategoriaRequests.listarCategorias();
            if (lista && Array.isArray(lista)) {
                setCategorias(lista);
            }
        } catch (error) {
            console.error("Erro ao carregar lista de categorias:", error);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarCategorias();
    }, []);

    const mostrarToast = (msg: string, tipo: "sucesso" | "erro") => {
        setMensagemStatus(msg);
        setTipoStatus(tipo);
        setTimeout(() => setMensagemStatus(null), 4000);
    };

    const handleSalvarCategoria = async (categoriaAtualizada: CategoriaDTO) => {
        if (editingId !== null) {
            const categoriaEditada = { ...categoriaAtualizada, id_categoria: editingId };
            const sucesso = await CategoriaRequests.atualizarCategoria(categoriaEditada);

            if (!sucesso) {
                mostrarToast("Não foi possível atualizar a categoria. Tente novamente.", "erro");
                return;
            }

            setCategorias((prev) =>
                prev.map((cat) => cat.id_categoria === editingId ? categoriaEditada : cat)
            );
            setCategoriaSelecionada(null);
            mostrarToast("Categoria atualizada com sucesso.", "sucesso");
            return;
        }

        const sucesso = await CategoriaRequests.cadastrarCategoria(categoriaAtualizada);
        const categoriaComId = {
            ...categoriaAtualizada,
            id_categoria: categoriaAtualizada.id_categoria || Date.now()
        };

        setCategorias((prev) => [categoriaComId, ...prev]);
        setCategoriaSelecionada(null);
        mostrarToast(
            sucesso ? "Categoria cadastrada com sucesso." : "Cadastrado em modo local (verifique a conexão com o servidor).",
            "sucesso"
        );
    };

    const handleEdit = (categoria: CategoriaDTO) => {
        setCategoriaSelecionada(categoria);
    };

    const handleCancelEdit = () => {
        setCategoriaSelecionada(null);
    };

    const handleRemoverCategoria = async (id_categoria?: number) => {
        if (!id_categoria) return;

        if (window.confirm("Confirmar a remoção desta categoria?")) {
            await CategoriaRequests.removerCategoria(id_categoria);
            setCategorias((prev) => prev.filter((c) => c.id_categoria !== id_categoria));
            mostrarToast("Categoria removida do sistema.", "sucesso");
        }
    };

    return (
        <div className="erp-shell">
            {/* Topbar Corporativa */}
            <header className="erp-topbar">
                <div className="brand-section">
                    <div className="brand-icon" aria-label="ERP">
                        <Tags size={20} strokeWidth={2.2} />
                    </div>
                    <div className="brand-title">
                        <h1><Tags size={18} /> Gestão de Categorias</h1>
                        <p>Controle das categorias de produtos e organização do inventário</p>
                    </div>
                </div>

                <div className="stat-pills">
                    <div className="pill-stat">
                        <span>Total de Categorias:</span>
                        <strong>{categorias.length}</strong>
                    </div>
                </div>
            </header>

            {/* Banner de Notificação */}
            {mensagemStatus && (
                <div className={`erp-toast ${tipoStatus}`}>
                    <span>{mensagemStatus}</span>
                    <button
                        className="toast-close"
                        onClick={() => setMensagemStatus(null)}
                        aria-label="Fechar aviso"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Área de Trabalho principal */}
            <main className="erp-workspace">
                <aside className="erp-col-form">
                    <FormularioCategoria
                        categoriaParaEditar={categoriaSelecionada}
                        onSubmit={handleSalvarCategoria}
                        onCancelar={handleCancelEdit}
                    />
                </aside>

                <section className="erp-card-table">
                    <div className="table-toolbar">
                        <div className="table-heading">
                            <h2>Categorias Cadastradas <span>{categorias.length}</span></h2>
                            <p>Consulte e gerencie as categorias do sistema</p>
                        </div>
                        <div className="table-controls">
                            <label className="search-box">
                                <Search size={16} aria-hidden="true" />
                                <input
                                    type="search"
                                    placeholder="Buscar por nome..."
                                    value={termoBusca}
                                    onChange={(event) => setTermoBusca(event.target.value)}
                                    aria-label="Buscar por nome"
                                />
                            </label>
                            <button className="btn-filter" type="button" aria-label="Filtrar categorias" title="Filtrar categorias">
                                <Filter size={16} />
                            </button>
                        </div>
                    </div>

                    {carregando && categorias.length === 0 ? (
                        <div className="state-empty">
                            <h4>Carregando categorias...</h4>
                        </div>
                    ) : categorias.length === 0 ? (
                        <div className="state-empty">
                            <div className="empty-icon"><FolderOpen size={28} /></div>
                            <h4>Nenhuma categoria cadastrada</h4>
                            <p>Utilize o formulário ao lado para incluir novas categorias.</p>
                        </div>
                    ) : categoriasFiltradas.length === 0 ? (
                        <div className="state-empty">
                            <div className="empty-icon"><Search size={28} /></div>
                            <h4>Nenhuma categoria encontrada</h4>
                            <p>Tente buscar por outro termo.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="erp-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nome da Categoria</th>
                                        <th>Descrição</th>
                                        <th style={{ textAlign: "right" }}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categoriasFiltradas.map((c) => (
                                        <tr key={c.id_categoria}>
                                            <td>
                                                <span className="code-badge">#{c.id_categoria}</span>
                                            </td>
                                            <td>
                                                <strong>{c.nome}</strong>
                                            </td>
                                            <td>
                                                {c.descricao ? c.descricao : <span className="text-muted">-</span>}
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="btn-action-edit"
                                                        onClick={() => handleEdit(c)}
                                                        aria-label={`Editar ${c.nome}`}
                                                        title="Editar categoria"
                                                    >
                                                        <Pencil size={15} />
                                                        Editar
                                                    </button>
                                                    <button
                                                        className="btn-action-delete"
                                                        onClick={() => handleRemoverCategoria(c.id_categoria)}
                                                        aria-label={`Excluir ${c.nome}`}
                                                        title="Excluir categoria"
                                                    >
                                                        <Trash2 size={15} />
                                                        Excluir
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
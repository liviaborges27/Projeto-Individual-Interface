import { useEffect, useState } from "react";
import { Filter, PackageOpen, Pencil, Search, Server, Trash2 } from "lucide-react";
import type ProdutoDTO from "../../dto/ProdutoDTO";
import { ProdutoRequests } from "../../fetch/ProdutoRequests";
import { FormularioProduto } from "../../components/FormularioProduto/FormularioProduto";
import "./PHome.css";

export default function PHome() {
    const [produtos, setProdutos] = useState<Array<ProdutoDTO>>([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoDTO | null>(null);
    const [mensagemStatus, setMensagemStatus] = useState<string | null>(null);
    const [tipoStatus, setTipoStatus] = useState<"sucesso" | "erro">("sucesso");
    const [carregando, setCarregando] = useState<boolean>(true);
    const [termoBusca, setTermoBusca] = useState("");
    const editingId = produtoSelecionado?.id_produto ?? null;

    const produtosFiltrados = produtos.filter((produto) => {
        const termo = termoBusca.trim().toLowerCase();
        return !termo || produto.nome.toLowerCase().includes(termo) || produto.codigo.toLowerCase().includes(termo);
    });

    const carregarProdutos = async () => {
        setCarregando(true);
        try {
            const lista = await ProdutoRequests.listarProdutos();
            if (lista && Array.isArray(lista)) {
                setProdutos(lista);
            }
        } catch (error) {
            console.error("Erro ao carregar lista de produtos:", error);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarProdutos();
    }, []);

    const mostrarToast = (msg: string, tipo: "sucesso" | "erro") => {
        setMensagemStatus(msg);
        setTipoStatus(tipo);
        setTimeout(() => setMensagemStatus(null), 4000);
    };

    const handleSalvarProduto = async (produtoAtualizado: ProdutoDTO) => {
        if (editingId !== null) {
            const produtoEditado = { ...produtoAtualizado, id_produto: editingId };
            const sucesso = await ProdutoRequests.atualizarProduto(produtoEditado);

            if (!sucesso) {
                mostrarToast("Não foi possível atualizar o produto. Tente novamente.", "erro");
                return;
            }

            setProdutos((prev) =>
                prev.map((produto) => produto.id_produto === editingId ? produtoEditado : produto)
            );
            setProdutoSelecionado(null);
            mostrarToast("Produto atualizado com sucesso.", "sucesso");
            return;
        }

        const sucesso = await ProdutoRequests.cadastrarProduto(produtoAtualizado);
        const produtoComId = {
            ...produtoAtualizado,
            id_produto: produtoAtualizado.id_produto || Date.now()
        };

        setProdutos((prev) => [produtoComId, ...prev]);
        setProdutoSelecionado(null);
        mostrarToast(
            sucesso ? "Produto cadastrado com sucesso." : "Cadastrado em modo local (verifique a conexão com o servidor).",
            "sucesso"
        );
    };

    const handleEdit = (produto: ProdutoDTO) => {
        setProdutoSelecionado(produto);
    };

    const handleCancelEdit = () => {
        setProdutoSelecionado(null);
    };

    const handleRemoverProduto = async (id_produto?: number, codigo?: string) => {
        if (!id_produto && !codigo) return;

        if (window.confirm("Confirmar a remoção deste produto do inventário?")) {
            if (id_produto) {
                await ProdutoRequests.removerProduto(id_produto);
            }
            setProdutos((prev) => prev.filter((p) => p.id_produto !== id_produto && p.codigo !== codigo));
            mostrarToast("Produto removido do sistema.", "sucesso");
        }
    };

    return (
        <div className="erp-shell">
            {/* Topbar Corporativa */}
            <header className="erp-topbar">
                <div className="brand-section">
                    <div className="brand-icon" aria-label="ERP">
                        <Server size={20} strokeWidth={2.2} />
                    </div>
                    <div className="brand-title">
                        <h1><Server size={18} /> Controle InfoTech</h1>
                        <p>Controle central de produtos, precificação e estoque</p>
                    </div>
                </div>

                <div className="stat-pills">
                    <div className="pill-stat">
                        <span>Total de Itens:</span>
                        <strong>{produtos.length}</strong>
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
                    <FormularioProduto
                        produtoParaEditar={produtoSelecionado}
                        onSubmit={handleSalvarProduto}
                        onCancelar={handleCancelEdit}
                    />
                </aside>

                <section className="erp-card-table">
                    <div className="table-toolbar">
                        <div className="table-heading">
                            <h2>Inventário Registrado <span>{produtos.length}</span></h2>
                            <p>Consulte e gerencie os produtos cadastrados</p>
                        </div>
                        <div className="table-controls">
                            <label className="search-box">
                                <Search size={16} aria-hidden="true" />
                                <input
                                    type="search"
                                    placeholder="Buscar por nome ou código..."
                                    value={termoBusca}
                                    onChange={(event) => setTermoBusca(event.target.value)}
                                    aria-label="Buscar por nome ou código"
                                />
                            </label>
                            <button className="btn-filter" type="button" aria-label="Filtrar inventário" title="Filtrar inventário">
                                <Filter size={16} />
                            </button>
                        </div>
                    </div>

                    {carregando && produtos.length === 0 ? (
                        <div className="state-empty">
                            <h4>Carregando produtos...</h4>
                        </div>
                    ) : produtos.length === 0 ? (
                        <div className="state-empty">
                            <div className="empty-icon"><PackageOpen size={28} /></div>
                            <h4>Nenhum produto cadastrado</h4>
                            <p>Utilize o formulário ao lado para incluir novos itens.</p>
                        </div>
                    ) : produtosFiltrados.length === 0 ? (
                        <div className="state-empty">
                            <div className="empty-icon"><Search size={28} /></div>
                            <h4>Nenhum produto encontrado</h4>
                            <p>Tente buscar por outro nome ou código.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="erp-table">
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Nome do Produto</th>
                                        <th>Cat.</th>
                                        <th>Preço Unitário</th>
                                        <th>Qtd. Mínima</th>
                                        <th style={{ textAlign: "right" }}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {produtosFiltrados.map((p) => (
                                        <tr key={p.id_produto || p.codigo}>
                                            <td>
                                                <span className="code-badge">{p.codigo}</span>
                                            </td>
                                            <td>
                                                <strong>{p.nome}</strong>
                                                {p.descricao && (
                                                    <div className="product-description">
                                                        {p.descricao}
                                                    </div>
                                                )}
                                            </td>
                                            <td>{p.id_categoria}</td>
                                            <td>
                                                <span className="price-text">
                                                    R$ {Number(p.preco_unitario).toFixed(2)}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="stock-pill">{p.quantidade_minima} un</span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="btn-action-edit"
                                                        onClick={() => handleEdit(p)}
                                                        aria-label={`Editar ${p.nome}`}
                                                        title="Editar produto"
                                                    >
                                                        <Pencil size={15} />
                                                        Editar
                                                    </button>
                                                    <button
                                                        className="btn-action-delete"
                                                        onClick={() => handleRemoverProduto(p.id_produto, p.codigo)}
                                                        aria-label={`Excluir ${p.nome}`}
                                                        title="Excluir produto"
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
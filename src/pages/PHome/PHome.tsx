import { useEffect, useState } from "react";
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

    const handleSalvarProduto = async (novoProduto: ProdutoDTO) => {
        let sucesso = false;

        if (novoProduto.id_produto) {
            // Edição
            sucesso = await ProdutoRequests.atualizarProduto(novoProduto);
            if (sucesso) {
                mostrarToast("Produto atualizado com sucesso.", "sucesso");
                setProdutos((prev) =>
                    prev.map((p) => (p.id_produto === novoProduto.id_produto ? novoProduto : p))
                );
            }
        } else {
            // Cadastro
            sucesso = await ProdutoRequests.cadastrarProduto(novoProduto);
            if (sucesso) {
                mostrarToast("Produto cadastrado com sucesso.", "sucesso");
                // Adiciona o produto à lista local para exibição imediata
                const produtoComId = {
                    ...novoProduto,
                    id_produto: novoProduto.id_produto || Date.now()
                };
                setProdutos((prev) => [produtoComId, ...prev]);
            }
        }

        if (sucesso) {
            setProdutoSelecionado(null);
            carregarProdutos();
        } else {
            // Fallback: se a API retornar erro/indisponível, registra localmente para visualização
            const produtoComId = {
                ...novoProduto,
                id_produto: novoProduto.id_produto || Date.now()
            };
            setProdutos((prev) => [produtoComId, ...prev]);
            setProdutoSelecionado(null);
            mostrarToast("Cadastrado em modo local (verifique a conexão com o servidor).", "sucesso");
        }
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
                    <div className="brand-icon">ERP</div>
                    <div className="brand-title">
                        <h1>Módulo de Gestão de Inventário</h1>
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
                        onClick={() => setMensagemStatus(null)}
                        style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}
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
                        onCancelar={() => setProdutoSelecionado(null)}
                    />
                </aside>

                <section className="erp-card-table">
                    <div className="table-toolbar">
                        <h2>Inventário Registrado</h2>
                    </div>

                    {carregando && produtos.length === 0 ? (
                        <div className="state-empty">
                            <h4>Carregando produtos...</h4>
                        </div>
                    ) : produtos.length === 0 ? (
                        <div className="state-empty">
                            <h4>Nenhum produto cadastrado no momento.</h4>
                            <p>Utilize o formulário ao lado para incluir novos itens.</p>
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
                                    {produtos.map((p) => (
                                        <tr key={p.id_produto || p.codigo}>
                                            <td>
                                                <span className="code-badge">{p.codigo}</span>
                                            </td>
                                            <td>
                                                <strong>{p.nome}</strong>
                                                {p.descricao && (
                                                    <div style={{ fontSize: "0.775rem", color: "#64748b" }}>
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
                                                        onClick={() => setProdutoSelecionado(p)}
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        className="btn-action-delete"
                                                        onClick={() => handleRemoverProduto(p.id_produto, p.codigo)}
                                                    >
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
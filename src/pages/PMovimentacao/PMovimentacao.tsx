import { useEffect, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Filter, ArrowLeftRight, Pencil, Search, Trash2, Package } from "lucide-react";
import type MovimentacaoDTO from "../../dto/MovimentacaoDTO";
import { MovimentacaoRequests } from "../../fetch/MovimentacaoRequests";
import { FormularioMovimentacao } from "../../components/FormularioMovimentacao/FormularioMovimentacao";
import Navegacao from "../../components/Navegacao/Navegacao";
import "./PMovimentacao.css";

export default function PMovimentacao() {
    const [movimentacoes, setMovimentacoes] = useState<Array<MovimentacaoDTO>>([]);
    const [movimentacaoSelecionada, setMovimentacaoSelecionada] = useState<MovimentacaoDTO | null>(null);
    const [mensagemStatus, setMensagemStatus] = useState<string | null>(null);
    const [tipoStatus, setTipoStatus] = useState<"sucesso" | "erro">("sucesso");
    const [carregando, setCarregando] = useState<boolean>(true);
    const [termoBusca, setTermoBusca] = useState("");
    const editingId = movimentacaoSelecionada?.id_movimentacao ?? null;

    const movimentacoesFiltradas = movimentacoes.filter((m) => {
        const termo = termoBusca.trim().toLowerCase();
        return (
            !termo ||
            m.id_produto.toString().includes(termo) ||
            m.tipo_movimentacao.toLowerCase().includes(termo) ||
            (m.observacao && m.observacao.toLowerCase().includes(termo))
        );
    });

    const carregarMovimentacoes = async () => {
        setCarregando(true);
        try {
            const lista = await MovimentacaoRequests.listarMovimentacoes();
            if (lista && Array.isArray(lista)) {
                setMovimentacoes(lista);
            }
        } catch (error) {
            console.error("Erro ao carregar movimentações de estoque:", error);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarMovimentacoes();
    }, []);

    const mostrarToast = (msg: string, tipo: "sucesso" | "erro") => {
        setMensagemStatus(msg);
        setTipoStatus(tipo);
        setTimeout(() => setMensagemStatus(null), 4000);
    };

    const handleSalvarMovimentacao = async (movimentacaoAtualizada: MovimentacaoDTO) => {
        if (editingId !== null) {
            const movimentacaoEditada = { ...movimentacaoAtualizada, id_movimentacao: editingId };
            const sucesso = await MovimentacaoRequests.atualizarMovimentacao(movimentacaoEditada);

            if (!sucesso) {
                mostrarToast("Não foi possível atualizar a movimentação. Tente novamente.", "erro");
                return;
            }

            setMovimentacoes((prev) =>
                prev.map((m) => m.id_movimentacao === editingId ? movimentacaoEditada : m)
            );
            setMovimentacaoSelecionada(null);
            mostrarToast("Movimentação atualizada com sucesso.", "sucesso");
            return;
        }

        const sucesso = await MovimentacaoRequests.cadastrarMovimentacao(movimentacaoAtualizada);
        const movimentacaoComId = {
            ...movimentacaoAtualizada,
            id_movimentacao: movimentacaoAtualizada.id_movimentacao || Date.now()
        };

        setMovimentacoes((prev) => [movimentacaoComId, ...prev]);
        setMovimentacaoSelecionada(null);
        mostrarToast(
            sucesso ? "Movimentação registrada com sucesso." : "Registrado em modo local (verifique a conexão com o servidor).",
            "sucesso"
        );
    };

    const handleEdit = (movimentacao: MovimentacaoDTO) => {
        setMovimentacaoSelecionada(movimentacao);
    };

    const handleCancelEdit = () => {
        setMovimentacaoSelecionada(null);
    };

    const handleRemoverMovimentacao = async (id_movimentacao?: number) => {
        if (!id_movimentacao) return;

        if (window.confirm("Confirmar a exclusão desta movimentação de estoque?")) {
            await MovimentacaoRequests.removerMovimentacao(id_movimentacao);
            setMovimentacoes((prev) => prev.filter((m) => m.id_movimentacao !== id_movimentacao));
            mostrarToast("Movimentação removida do sistema.", "sucesso");
        }
    };

    return (
        <div>
            <Navegacao />

            <div className="erp-shell">
                {/* Topbar Corporativa */}
                <header className="erp-topbar">
                    <div className="brand-section">
                        <div className="brand-icon" aria-label="ERP">
                            <ArrowLeftRight size={20} strokeWidth={2.2} />
                        </div>
                        <div className="brand-title">
                            <h1><ArrowLeftRight size={18} /> Movimentação de Estoque</h1>
                            <p>Histórico e registro de entradas e saídas de mercadorias</p>
                        </div>
                    </div>

                    <div className="stat-pills">
                        <div className="pill-stat">
                            <span>Total de Movimentações:</span>
                            <strong>{movimentacoes.length}</strong>
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
                        <FormularioMovimentacao
                            movimentacaoParaEditar={movimentacaoSelecionada}
                            onSubmit={handleSalvarMovimentacao}
                            onCancelar={handleCancelEdit}
                        />
                    </aside>

                    <section className="erp-card-table">
                        <div className="table-toolbar">
                            <div className="table-heading">
                                <h2>Histórico de Registros <span>{movimentacoes.length}</span></h2>
                                <p>Entradas e saídas de itens no almoxarifado</p>
                            </div>
                            <div className="table-controls">
                                <label className="search-box">
                                    <Search size={16} aria-hidden="true" />
                                    <input
                                        type="search"
                                        placeholder="Buscar por produto ou tipo..."
                                        value={termoBusca}
                                        onChange={(event) => setTermoBusca(event.target.value)}
                                        aria-label="Buscar movimentações"
                                    />
                                </label>
                                <button className="btn-filter" type="button" aria-label="Filtrar histórico" title="Filtrar histórico">
                                    <Filter size={16} />
                                </button>
                            </div>
                        </div>

                        {carregando && movimentacoes.length === 0 ? (
                            <div className="state-empty">
                                <h4>Carregando histórico...</h4>
                            </div>
                        ) : movimentacoes.length === 0 ? (
                            <div className="state-empty">
                                <div className="empty-icon"><Package size={28} /></div>
                                <h4>Nenhuma movimentação registrada</h4>
                                <p>Utilize o formulário ao lado para dar entrada ou saída de itens.</p>
                            </div>
                        ) : movimentacoesFiltradas.length === 0 ? (
                            <div className="state-empty">
                                <div className="empty-icon"><Search size={28} /></div>
                                <h4>Nenhum registro encontrado</h4>
                                <p>Tente buscar por outro termo.</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="erp-table">
                                    <thead>
                                        <tr>
                                            <th>Tipo</th>
                                            <th>Cód. Produto</th>
                                            <th>Quantidade</th>
                                            <th>Observação</th>
                                            <th style={{ textAlign: "right" }}>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {movimentacoesFiltradas.map((m) => (
                                            <tr key={m.id_movimentacao}>
                                                <td>
                                                    <span className={`type-badge ${m.tipo_movimentacao.toLowerCase()}`}>
                                                        {m.tipo_movimentacao === "ENTRADA" ? (
                                                            <> <ArrowDownLeft size={14} /> Entrada </>
                                                        ) : (
                                                            <> <ArrowUpRight size={14} /> Saída </>
                                                        )}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="code-badge">Prod #{m.id_produto}</span>
                                                </td>
                                                <td>
                                                    <strong>{m.quantidade} un</strong>
                                                </td>
                                                <td>
                                                    {m.observacao ? m.observacao : <span className="text-muted">-</span>}
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button
                                                            className="btn-action-edit"
                                                            onClick={() => handleEdit(m)}
                                                            aria-label="Editar movimentação"
                                                            title="Editar movimentação"
                                                        >
                                                            <Pencil size={15} />
                                                            Editar
                                                        </button>
                                                        <button
                                                            className="btn-action-delete"
                                                            onClick={() => handleRemoverMovimentacao(m.id_movimentacao)}
                                                            aria-label="Excluir movimentação"
                                                            title="Excluir movimentação"
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
        </div>
    );
}
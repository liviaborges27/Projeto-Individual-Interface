import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, DollarSign, Layers, Package, PlusCircle, RefreshCw, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import type ProdutoDTO from "../../dto/ProdutoDTO";
import type CategoriaDTO from "../../dto/CategoriaDTO";
import type MovimentacaoDTO from "../../dto/MovimentacaoDTO";
import { ProdutoRequests } from "../../fetch/ProdutoRequests";
import { CategoriaRequests } from "../../fetch/CategoriaRequests";
import { MovimentacaoRequests } from "../../fetch/MovimentacaoRequests";
import "./Home.css";

type DashboardData = {
    produtos: ProdutoDTO[];
    categorias: CategoriaDTO[];
    movimentacoes: MovimentacaoDTO[];
};

const emptyData: DashboardData = { produtos: [], categorias: [], movimentacoes: [] };

function isCurrentMonth(dateValue?: Date | string) {
    if (!dateValue) return false;
    const date = new Date(dateValue);
    const today = new Date();
    return !Number.isNaN(date.getTime()) && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export default function Home() {
    const [data, setData] = useState<DashboardData>(emptyData);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        let ativo = true;

        const carregarDashboard = async () => {
            const [produtos, categorias, movimentacoes] = await Promise.all([
                ProdutoRequests.listarProdutos(),
                CategoriaRequests.listarCategorias(),
                MovimentacaoRequests.listarMovimentacoes(),
            ]);

            if (ativo) {
                setData({
                    produtos: produtos ?? [],
                    categorias: categorias ?? [],
                    movimentacoes: movimentacoes ?? [],
                });
                setCarregando(false);
            }
        };

        carregarDashboard();
        return () => { ativo = false; };
    }, []);

    const movimentacoesDoMes = data.movimentacoes.filter((movimentacao) => isCurrentMonth(movimentacao.data_movimentacao));
    const entradas = movimentacoesDoMes.filter((movimentacao) => movimentacao.tipo_movimentacao === "ENTRADA").length;
    const saidas = movimentacoesDoMes.filter((movimentacao) => movimentacao.tipo_movimentacao === "SAIDA").length;
    const produtosCriticos = data.produtos
        .filter((produto) => Number(produto.quantidade_disponivel ?? 0) <= Number(produto.quantidade_minima ?? 0))
        .sort((a, b) => Number(a.quantidade_disponivel ?? 0) - Number(b.quantidade_disponivel ?? 0))
        .slice(0, 5);
    const estoqueBaixo = data.produtos.filter((produto) => Number(produto.quantidade_disponivel ?? 0) <= Number(produto.quantidade_minima ?? 0)).length;
    const valorInventario = data.produtos.reduce((total, produto) => total + Number(produto.preco_unitario ?? 0) * Number(produto.quantidade_disponivel ?? 0), 0);
    const volumeMovimentacoes = entradas + saidas;

    const estatisticas = [
        { label: "Total em estoque", value: `${data.produtos.length.toLocaleString("pt-BR")} itens`, detail: "Produtos cadastrados", badge: "+5,4% este mês", progress: Math.min(data.produtos.length * 4, 100), icon: Package, tone: "teal" },
        { label: "Valor total do inventário", value: formatCurrency(valorInventario), detail: "Patrimônio em estoque", badge: "Patrimônio", progress: Math.min(valorInventario > 0 ? 72 : 0, 100), icon: DollarSign, tone: "indigo" },
        { label: "Alertas de estoque baixo", value: `${estoqueBaixo} produtos`, detail: estoqueBaixo ? "Itens abaixo do estoque mínimo" : "Sem alertas de reposição no momento", badge: estoqueBaixo ? "Ação necessária" : "Dentro do limite", progress: Math.min(estoqueBaixo * 20, 100), icon: AlertTriangle, tone: estoqueBaixo ? "coral" : "green" },
        { label: "Movimentações do mês", value: `${volumeMovimentacoes} registros`, detail: `${entradas} entradas · ${saidas} saídas`, badge: volumeMovimentacoes > 20 ? "Atividade alta" : "Atividade normal", progress: Math.min(volumeMovimentacoes * 3, 100), icon: TrendingUp, tone: "blue" },
    ];

    return (
        <div className="erp-shell dashboard-shell">
            <header className="dashboard-hero">
                <div>
                    <span className="dashboard-eyebrow">Painel executivo</span>
                    <h1>Visão Geral do Estoque</h1>
                    <p>{new Date().toLocaleDateString("pt-BR", { dateStyle: "full" })} <b>•</b> Status do Servidor: Normal <b>•</b> Atualizado agora</p>
                </div>
                <div className="dashboard-live-status"><span /> Sistema online</div>
            </header>

            <section className="dashboard-stat-grid" aria-label="Indicadores do sistema">
                {estatisticas.map(({ label, value, detail, badge, progress, icon: Icon, tone }) => (
                    <article className="dashboard-stat-card" key={label}>
                        <div className={`dashboard-stat-icon ${tone}`}><Icon size={21} strokeWidth={2.2} /></div>
                        <div className="dashboard-stat-copy">
                            <div className="dashboard-stat-label"><span>{label}</span><span className={`dashboard-stat-badge ${tone}`}>{badge}</span></div>
                            <strong>{carregando ? "--" : value}</strong>
                            <small>{detail}</small>
                            <div className="dashboard-progress"><span style={{ width: `${progress}%` }} /></div>
                        </div>
                    </article>
                ))}
            </section>

            <section className="dashboard-lower-grid">
                <article className="dashboard-panel dashboard-shortcuts">
                    <div className="dashboard-panel-heading">
                        <div><span className="dashboard-eyebrow">Ações rápidas</span><h2>Gestão rápida</h2></div>
                        <PlusCircle size={20} aria-hidden="true" />
                    </div>
                    <div className="shortcut-list">
                        <Link to="/produtos" className="shortcut-item"><span className="shortcut-icon teal"><Package size={18} /></span><span><strong>Novo produto</strong><small>Adicione um item ao inventário</small></span><ArrowRight className="shortcut-arrow" size={17} /></Link>
                        <Link to="/categorias" className="shortcut-item"><span className="shortcut-icon indigo"><Layers size={18} /></span><span><strong>Nova categoria</strong><small>Organize o catálogo</small></span><ArrowRight className="shortcut-arrow" size={17} /></Link>
                        <Link to="/movimentacoes" className="shortcut-item"><span className="shortcut-icon blue"><RefreshCw size={18} /></span><span><strong>Registrar entrada/saída</strong><small>Atualize seu estoque</small></span><ArrowRight className="shortcut-arrow" size={17} /></Link>
                        <Link to="/produtos" className="shortcut-item"><span className="shortcut-icon slate"><TrendingUp size={18} /></span><span><strong>Relatório de Inventário</strong><small>Consulte o inventário atual</small></span><ArrowRight className="shortcut-arrow" size={17} /></Link>
                    </div>
                </article>

                <article className="dashboard-panel dashboard-critical-stock">
                    <div className="dashboard-panel-heading"><div><span className="dashboard-eyebrow">Reposição prioritária</span><h2>Estoque crítico</h2></div><AlertTriangle size={20} /></div>
                    {produtosCriticos.length === 0 ? <p className="dashboard-empty">Sem alertas de reposição no momento.</p> : <div className="critical-list">{produtosCriticos.map((produto) => { const quantidade = Number(produto.quantidade_disponivel ?? 0); const minimo = Number(produto.quantidade_minima ?? 0); return <div className="critical-item" key={produto.id_produto ?? produto.codigo}><span className="critical-product-icon"><Package size={17} /></span><span className="critical-product-copy"><strong>{produto.nome}</strong><small>{produto.codigo} · mínimo de {minimo} un.</small></span><span className="critical-quantity"><b>{quantidade}</b><small>un.</small><span className="critical-bar"><i style={{ width: `${Math.min((quantidade / Math.max(minimo, 1)) * 100, 100)}%` }} /></span></span></div>; })}</div>}
                </article>
            </section>
        </div>
    );
}
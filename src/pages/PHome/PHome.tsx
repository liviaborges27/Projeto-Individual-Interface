import { useEffect, useState } from "react";
import { Filter, Package, PackageOpen, Pencil, Search, Server, Trash2 } from "lucide-react";
import type ProdutoDTO from "../../dto/ProdutoDTO";
import type CategoriaDTO from "../../dto/CategoriaDTO";
import { ProdutoRequests } from "../../fetch/ProdutoRequests";
import { CategoriaRequests } from "../../fetch/CategoriaRequests";
import { FormularioProduto } from "../../components/FormularioProduto/FormularioProduto";
import "./PHome.css";

const IMAGENS_MOCK = {
    teclado: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=500&q=80",
    mouse: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=500&q=80",
    hardware: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=80",
    tecnologia: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=500&q=80"
};

function getImagemProduto(produto: ProdutoDTO) {
    const imagemCadastrada = produto.imagem?.trim() || produto.imagem_url?.trim();
    if (imagemCadastrada) return imagemCadastrada;

    const nome = produto.nome.toLowerCase();
    if (nome.includes("teclado")) return IMAGENS_MOCK.teclado;
    if (nome.includes("mouse")) return IMAGENS_MOCK.mouse;
    if (nome.includes("ssd") || nome.includes("ram") || nome.includes("memória") || nome.includes("memoria")) return IMAGENS_MOCK.hardware;
    return IMAGENS_MOCK.tecnologia;
}

export default function PHome() {
    const [produtos, setProdutos] = useState<Array<ProdutoDTO>>([]);
    const [categorias, setCategorias] = useState<Array<CategoriaDTO>>([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoDTO | null>(null);
    const [mensagemStatus, setMensagemStatus] = useState<string | null>(null);
    const [tipoStatus, setTipoStatus] = useState<"sucesso" | "erro">("sucesso");
    const [carregando, setCarregando] = useState<boolean>(true);
    const [termoBusca, setTermoBusca] = useState("");
    const [imagensComErro, setImagensComErro] = useState<Record<string, boolean>>({});
    const editingId = produtoSelecionado?.id_produto ?? null;

    const produtosFiltrados = produtos.filter((produto) => {
        const termo = termoBusca.trim().toLowerCase();
        return !termo || produto.nome.toLowerCase().includes(termo) || produto.codigo.toLowerCase().includes(termo);
    });

    const carregarProdutos = async () => {
        setCarregando(true);
        try {
            const [listaProdutos, listaCategorias] = await Promise.all([
                ProdutoRequests.listarProdutos(),
                CategoriaRequests.listarCategorias()
            ]);
            if (listaProdutos && Array.isArray(listaProdutos)) {
                setProdutos(listaProdutos);
            }
            if (listaCategorias && Array.isArray(listaCategorias)) {
                setCategorias(listaCategorias);
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
        <div>
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
                            <div className="product-grid">
                                {produtosFiltrados.map((p) => {
                                    const quantidade = Number(p.quantidade_disponivel ?? 0);
                                    const estoqueBaixo = quantidade <= Number(p.quantidade_minima ?? 0);
                                    const produtoKey = String(p.id_produto ?? p.codigo);
                                    const imagemUrl = imagensComErro[produtoKey] ? undefined : getImagemProduto(p);
                                    const mostrarImagem = Boolean(imagemUrl) && !imagensComErro[produtoKey];
                                    const categoriaId = p.categoria_id ?? p.id_categoria;
                                    const nomeCategoria = categorias.find((categoria) => categoria.id_categoria === categoriaId)?.nome
                                        ?? p.categoria_nome
                                        ?? "Sem Categoria";

                                    return (
                                        <article className="product-card" key={produtoKey}>
                                            <div className={`product-card-media ${mostrarImagem ? "" : "fallback-active"}`}>
                                                {mostrarImagem ? (
                                                    <img
                                                        src={imagemUrl}
                                                        alt={p.nome}
                                                        onError={() => setImagensComErro((current) => ({ ...current, [produtoKey]: true }))}
                                                    />
                                                ) : (
                                                    <div className="product-image-fallback">
                                                        <Package size={32} strokeWidth={1.5} aria-hidden="true" />
                                                        <span>Sem imagem</span>
                                                    </div>
                                                )}
                                                <span className="product-category-badge">{nomeCategoria}</span>
                                            </div>
                                            <div className="product-card-body">
                                                <div className="product-card-heading">
                                                    <div>
                                                        <h3>{p.nome}</h3>
                                                        <span className="product-sku">SKU {p.codigo}</span>
                                                    </div>
                                                    <Package size={18} aria-hidden="true" />
                                                </div>
                                                {p.descricao && <p className="product-card-description">{p.descricao}</p>}
                                                <div className="product-card-meta">
                                                    <strong className="product-card-price">R$ {Number(p.preco_unitario).toFixed(2)}</strong>
                                                    <span className={`product-stock-status ${estoqueBaixo ? "low" : "available"}`}>
                                                        {estoqueBaixo ? "Baixo estoque" : "Em estoque"}
                                                    </span>
                                                </div>
                                                <div className="product-card-stock">{quantidade} un. disponíveis <span>mín. {p.quantidade_minima}</span></div>
                                                <div className="product-card-actions">
                                                    <button className="btn-action-edit" onClick={() => handleEdit(p)} aria-label={`Editar ${p.nome}`} title="Editar produto">
                                                        <Pencil size={15} /> Editar
                                                    </button>
                                                    <button className="btn-action-delete" onClick={() => handleRemoverProduto(p.id_produto, p.codigo)} aria-label={`Excluir ${p.nome}`} title="Excluir produto">
                                                        <Trash2 size={15} /> Excluir
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
}
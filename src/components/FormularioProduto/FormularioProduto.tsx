import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import type ProdutoDTO from "../../dto/ProdutoDTO";
import "./FormularioProduto.css";

interface Props {
    produtoParaEditar: ProdutoDTO | null;
    onSubmit: (produto: ProdutoDTO) => void;
    onCancelar: () => void;
}

export const FormularioProduto: React.FC<Props> = ({ produtoParaEditar, onSubmit, onCancelar }) => {
    const estadoInicial = {
        codigo: "",
        nome: "",
        id_categoria: 1,
        descricao: "",
        imagem: "",
        preco_unitario: "",
        quantidade_minima: ""
    };

    const [formData, setFormData] = useState({
        codigo: "",
        nome: "",
        id_categoria: 1,
        descricao: "",
        imagem: "",
        preco_unitario: "",
        quantidade_minima: ""
    });

    const [mensagemErro, setMensagemErro] = useState<string>("");

    useEffect(() => {
        if (produtoParaEditar) {
            setFormData({
                codigo: produtoParaEditar.codigo || "",
                nome: produtoParaEditar.nome || "",
                id_categoria: produtoParaEditar.id_categoria || 1,
                descricao: produtoParaEditar.descricao || "",
                imagem: produtoParaEditar.imagem || produtoParaEditar.imagem_url || "",
                preco_unitario: String(produtoParaEditar.preco_unitario ?? ""),
                quantidade_minima: String(produtoParaEditar.quantidade_minima ?? "")
            });
        } else {
            setFormData(estadoInicial);
        }
    }, [produtoParaEditar]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.codigo.trim()) {
            setMensagemErro("Informe o código do produto.");
            return;
        }

        if (!formData.nome.trim()) {
            setMensagemErro("Informe o nome do produto.");
            return;
        }

        const preco = parseFloat(formData.preco_unitario);
        if (isNaN(preco) || preco <= 0) {
            setMensagemErro("Informe um preço unitário maior que zero.");
            return;
        }

        const qtdMin = parseInt(formData.quantidade_minima, 10);
        if (isNaN(qtdMin) || qtdMin < 0) {
            setMensagemErro("Informe uma quantidade mínima válida.");
            return;
        }

        setMensagemErro("");

        const produtoPronto: ProdutoDTO = {
            ...(produtoParaEditar?.id_produto ? { id_produto: produtoParaEditar.id_produto } : {}),
            codigo: formData.codigo.trim(),
            nome: formData.nome.trim(),
            id_categoria: Number(formData.id_categoria) || 1,
            descricao: formData.descricao.trim(),
            imagem: formData.imagem.trim() || undefined,
            preco_unitario: preco,
            quantidade_minima: qtdMin
        };

        onSubmit(produtoPronto);

        if (!produtoParaEditar) {
            setFormData(estadoInicial);
        }
    };

    return (
        <div className="erp-card-form">
            <div className="form-header-title">
                <h3>{produtoParaEditar ? "EDITAR PRODUTO" : "NOVO CADASTRO"}</h3>
            </div>

            {mensagemErro && (
                <div className="form-alert-error">
                    {mensagemErro}
                </div>
            )}

            <form onSubmit={handleSubmit} autoComplete="off">
                <div className="form-fields-grid">
                    <div className="field-box">
                        <label htmlFor="codigo">Código *</label>
                        <input
                            id="codigo"
                            name="codigo"
                            type="text"
                            value={formData.codigo}
                            onChange={handleChange}
                            placeholder="Ex: PRD-001"
                            disabled={!!produtoParaEditar}
                            autoComplete="off"
                        />
                    </div>

                    <div className="field-box">
                        <label htmlFor="id_categoria">Categoria *</label>
                        <select
                            id="id_categoria"
                            name="id_categoria"
                            value={formData.id_categoria}
                            onChange={handleChange}
                        >
                            <option value="1">Categoria 1</option>
                            <option value="2">Categoria 2</option>
                            <option value="3">Categoria 3</option>
                            <option value="4">Categoria 4</option>
                            <option value="5">Categoria 5</option>
                        </select>
                    </div>

                    <div className="field-box col-span-2">
                        <label htmlFor="nome">Nome do Produto *</label>
                        <input
                            id="nome"
                            name="nome"
                            type="text"
                            value={formData.nome}
                            onChange={handleChange}
                            placeholder="Ex: Teclado Mecânico RGB"
                            autoComplete="off"
                        />
                    </div>

                    <div className="field-box">
                        <label htmlFor="preco_unitario">Preço (R$) *</label>
                        <input
                            id="preco_unitario"
                            name="preco_unitario"
                            type="number"
                            step="0.01"
                            value={formData.preco_unitario}
                            onChange={handleChange}
                            placeholder="0.00"
                        />
                    </div>

                    <div className="field-box">
                        <label htmlFor="quantidade_minima">Qtd. Mínima *</label>
                        <input
                            id="quantidade_minima"
                            name="quantidade_minima"
                            type="number"
                            value={formData.quantidade_minima}
                            onChange={handleChange}
                            placeholder="0"
                        />
                    </div>

                    <div className="field-box col-span-2">
                        <label htmlFor="descricao">Descrição / Detalhes</label>
                        <textarea
                            id="descricao"
                            name="descricao"
                            value={formData.descricao}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Observações do item..."
                        />
                    </div>

                    <div className="field-box col-span-2">
                        <label htmlFor="imagem">URL da Imagem</label>
                        <input
                            id="imagem"
                            name="imagem"
                            type="url"
                            value={formData.imagem}
                            onChange={handleChange}
                            placeholder="https://exemplo.com/foto.jpg"
                            autoComplete="url"
                        />
                    </div>
                </div>

                <div className="form-btn-group">
                    <button
                        type="submit"
                        className={`btn-erp-primary ${produtoParaEditar ? "btn-erp-edit" : ""}`}
                    >
                        <Plus size={18} aria-hidden="true" />
                        {produtoParaEditar ? "Salvar Alterações" : "Cadastrar Produto"}
                    </button>
                    {produtoParaEditar && (
                        <button type="button" onClick={onCancelar} className="btn-erp-secondary">
                            Cancelar Edição
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};
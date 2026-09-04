import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import type MovimentacaoDTO from "../../dto/MovimentacaoDTO";
import "./FormularioMovimentacao.css";

interface Props {
    movimentacaoParaEditar: MovimentacaoDTO | null;
    onSubmit: (movimentacao: MovimentacaoDTO) => void;
    onCancelar: () => void;
}

export const FormularioMovimentacao: React.FC<Props> = ({ movimentacaoParaEditar, onSubmit, onCancelar }) => {
    const estadoInicial = {
        id_produto: "",
        tipo_movimentacao: "ENTRADA",
        quantidade: "",
        observacao: ""
    };

    const [formData, setFormData] = useState(estadoInicial);
    const [mensagemErro, setMensagemErro] = useState<string>("");

    useEffect(() => {
        if (movimentacaoParaEditar) {
            setFormData({
                id_produto: String(movimentacaoParaEditar.id_produto ?? ""),
                tipo_movimentacao: movimentacaoParaEditar.tipo_movimentacao || "ENTRADA",
                quantidade: String(movimentacaoParaEditar.quantidade ?? ""),
                observacao: movimentacaoParaEditar.observacao || ""
            });
        } else {
            setFormData(estadoInicial);
        }
    }, [movimentacaoParaEditar]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const idProd = parseInt(formData.id_produto, 10);
        if (isNaN(idProd) || idProd <= 0) {
            setMensagemErro("Informe um ID de produto válido.");
            return;
        }

        const qtd = parseInt(formData.quantidade, 10);
        if (isNaN(qtd) || qtd <= 0) {
            setMensagemErro("Informe uma quantidade maior que zero.");
            return;
        }

        setMensagemErro("");

        const movimentacaoPronta: MovimentacaoDTO = {
            ...(movimentacaoParaEditar?.id_movimentacao ? { id_movimentacao: movimentacaoParaEditar.id_movimentacao } : {}),
            id_produto: idProd,
            tipo_movimentacao: formData.tipo_movimentacao as "ENTRADA" | "SAIDA",
            quantidade: qtd,
            observacao: formData.observacao.trim()
        };

        onSubmit(movimentacaoPronta);

        if (!movimentacaoParaEditar) {
            setFormData(estadoInicial);
        }
    };

    return (
        <div className="erp-card-form">
            <div className="form-header-title">
                <h3>{movimentacaoParaEditar ? "EDITAR MOVIMENTAÇÃO" : "NOVA MOVIMENTAÇÃO"}</h3>
            </div>

            {mensagemErro && (
                <div className="form-alert-error">
                    {mensagemErro}
                </div>
            )}

            <form onSubmit={handleSubmit} autoComplete="off">
                <div className="form-fields-grid">
                    <div className="field-box">
                        <label htmlFor="id_produto">Cód. Produto *</label>
                        <input
                            id="id_produto"
                            name="id_produto"
                            type="number"
                            value={formData.id_produto}
                            onChange={handleChange}
                            placeholder="Ex: 1"
                        />
                    </div>

                    <div className="field-box">
                        <label htmlFor="tipo_movimentacao">Tipo *</label>
                        <select
                            id="tipo_movimentacao"
                            name="tipo_movimentacao"
                            value={formData.tipo_movimentacao}
                            onChange={handleChange}
                        >
                            <option value="ENTRADA">Entrada</option>
                            <option value="SAIDA">Saída</option>
                        </select>
                    </div>

                    <div className="field-box col-span-2">
                        <label htmlFor="quantidade">Quantidade *</label>
                        <input
                            id="quantidade"
                            name="quantidade"
                            type="number"
                            value={formData.quantidade}
                            onChange={handleChange}
                            placeholder="0"
                        />
                    </div>

                    <div className="field-box col-span-2">
                        <label htmlFor="observacao">Observação / Detalhes</label>
                        <textarea
                            id="observacao"
                            name="observacao"
                            value={formData.observacao}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Motivo ou nota da movimentação..."
                        />
                    </div>
                </div>

                <div className="form-btn-group">
                    <button
                        type="submit"
                        className={`btn-erp-primary ${movimentacaoParaEditar ? "btn-erp-edit" : ""}`}
                    >
                        <Plus size={18} aria-hidden="true" />
                        {movimentacaoParaEditar ? "Salvar Alterações" : "Registrar Movimentação"}
                    </button>
                    {movimentacaoParaEditar && (
                        <button type="button" onClick={onCancelar} className="btn-erp-secondary">
                            Cancelar Edição
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};
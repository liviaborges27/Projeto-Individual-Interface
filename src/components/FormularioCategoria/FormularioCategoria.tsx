import { useEffect, useState } from "react";
import type CategoriaDTO from "../../dto/CategoriaDTO";
import { Validacoes, type ErrosValidacao } from "../../utils/validacoes";

interface FormularioCategoriaProps {
    categoriaParaEditar: CategoriaDTO | null;
    onSubmit: (categoria: CategoriaDTO) => void;
    onCancelar: () => void;
}

export function FormularioCategoria({ categoriaParaEditar, onSubmit, onCancelar }: FormularioCategoriaProps) {
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [erros, setErros] = useState<ErrosValidacao>({});

    useEffect(() => {
        if (categoriaParaEditar) {
            setNome(categoriaParaEditar.nome || "");
            setDescricao(categoriaParaEditar.descricao || "");
            setErros({});
        } else {
            limparCampos();
        }
    }, [categoriaParaEditar]);

    const limparCampos = () => {
        setNome("");
        setDescricao("");
        setErros({});
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const dados: CategoriaDTO = {
            nome,
            descricao,
        };

        const errosEncontrados = Validacoes.validarCategoria(dados);
        if (Object.keys(errosEncontrados).length > 0) {
            setErros(errosEncontrados);
            return;
        }

        onSubmit(dados);
        limparCampos();
    };

    return (
        <form onSubmit={handleSubmit} className="erp-form">
            <h3>{categoriaParaEditar ? "Editar Categoria" : "Nova Categoria"}</h3>

            <div className="form-field">
                <label>Nome da Categoria *</label>
                <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Hardware"
                    className={erros.nome ? "input-erro" : ""}
                />
                {erros.nome && <span className="error-text">{erros.nome}</span>}
            </div>

            <div className="form-field">
                <label>Descrição</label>
                <textarea
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Detalhamento opcional da categoria..."
                    rows={3}
                />
            </div>

            <div className="form-actions">
                <button type="submit" className="btn-primary">
                    {categoriaParaEditar ? "Atualizar" : "Salvar"}
                </button>
                {categoriaParaEditar && (
                    <button type="button" onClick={onCancelar} className="btn-secondary">
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
}
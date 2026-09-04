import type CategoriaDTO from "../dto/CategoriaDTO";

const BASE_URL = "/api";

export class CategoriaRequests {

    /**
     * Busca todas as categorias do backend
     */
    static async listarCategorias(): Promise<Array<CategoriaDTO> | null> {
        try {
            const resposta = await fetch(`${BASE_URL}/categorias`);
            if (!resposta.ok) {
                return null;
            }
            return await resposta.json();
        } catch (error) {
            console.error(`Erro ao buscar categorias: ${error}`);
            return null;
        }
    }

    /**
     * Cadastra uma nova categoria no backend
     */
    static async cadastrarCategoria(categoria: CategoriaDTO): Promise<boolean> {
        try {
            const resposta = await fetch(`${BASE_URL}/categorias`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(categoria)
            });

            return resposta.ok;
        } catch (error) {
            console.error(`Erro ao cadastrar categoria: ${error}`);
            return false;
        }
    }

    /**
     * Atualiza as informações de uma categoria existente
     */
    static async atualizarCategoria(categoria: CategoriaDTO): Promise<boolean> {
        if (!categoria.id_categoria) {
            console.error("Erro ao atualizar categoria: ID da categoria não informado.");
            return false;
        }

        try {
            const resposta = await fetch(`${BASE_URL}/categorias/${categoria.id_categoria}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(categoria)
            });

            return resposta.ok;
        } catch (error) {
            console.error(`Erro ao atualizar categoria: ${error}`);
            return false;
        }
    }

    /**
     * Remove/Desativa uma categoria pelo ID
     */
    static async removerCategoria(id_categoria: number): Promise<boolean> {
        try {
            const resposta = await fetch(`${BASE_URL}/categorias/${id_categoria}`, {
                method: "DELETE"
            });

            return resposta.ok;
        } catch (error) {
            console.error(`Erro ao remover categoria: ${error}`);
            return false;
        }
    }
}
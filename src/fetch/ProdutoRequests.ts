import type ProdutoDTO from "../dto/ProdutoDTO";

// O Vite encaminha /api para o backend local durante o desenvolvimento.
const BASE_URL = "/api";

export class ProdutoRequests {

    /**
     * Busca todos os produtos ativos do backend
     */
    static async listarProdutos(): Promise<Array<ProdutoDTO> | null> {
        try {
            const resposta = await fetch(`${BASE_URL}/produtos`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": localStorage.getItem("x-access-token") || ""
                }
            });
            if (!resposta.ok) {
                return null;
            }
            return await resposta.json();
        } catch (error) {
            console.error(`Erro ao buscar produtos: ${error}`);
            return null;
        }
    }

    /**
     * Cadastra um novo produto no backend
     */
    static async cadastrarProduto(produto: ProdutoDTO): Promise<boolean> {
        try {
            const resposta = await fetch(`${BASE_URL}/produtos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(produto)
            });

            return resposta.ok;
        } catch (error) {
            console.error(`Erro ao cadastrar produto: ${error}`);
            return false;
        }
    }

    /**
     * Atualiza as informações de um produto existente
     */
    static async atualizarProduto(produto: ProdutoDTO): Promise<boolean> {
        if (!produto.id_produto) {
            console.error("Erro ao atualizar produto: ID do produto não informado.");
            return false;
        }

        try {
            const resposta = await fetch(`${BASE_URL}/produtos/${produto.id_produto}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(produto)
            });

            return resposta.ok;
        } catch (error) {
            console.error(`Erro ao atualizar produto: ${error}`);
            return false;
        }
    }

    /**
     * Desativa um produto pelo ID
     */
    static async removerProduto(id_produto: number): Promise<boolean> {
        try {
            const resposta = await fetch(`${BASE_URL}/produtos/${id_produto}`, {
                method: "DELETE"
            });

            return resposta.ok;
        } catch (error) {
            console.error(`Erro ao remover produto: ${error}`);
            return false;
        }
    }
}
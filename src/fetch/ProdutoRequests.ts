import type ProdutoDTO from "../dto/ProdutoDTO";

// URL base da sua API Backend (ajuste a porta se necessário)
const BASE_URL = "http://localhost:3000/api";

export class ProdutoRequests {

    /**
     * Busca todos os produtos ativos do backend
     */
    static async listarProdutos(): Promise<Array<ProdutoDTO> | null> {
        try {
            const resposta = await fetch(`${BASE_URL}/produtos`);
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
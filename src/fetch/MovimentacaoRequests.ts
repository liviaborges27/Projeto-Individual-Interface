import type MovimentacaoDTO from "../dto/MovimentacaoDTO";

const BASE_URL = "/api";

export class MovimentacaoRequests {

    /**
     * Busca todas as movimentações do backend
     */
    static async listarMovimentacoes(): Promise<Array<MovimentacaoDTO> | null> {
        try {
            const resposta = await fetch(`${BASE_URL}/movimentacoes`);
            if (!resposta.ok) {
                return null;
            }
            return await resposta.json();
        } catch (error) {
            console.error(`Erro ao buscar movimentações: ${error}`);
            return null;
        }
    }

    /**
     * Cadastra uma nova movimentação de estoque
     */
    static async cadastrarMovimentacao(movimentacao: MovimentacaoDTO): Promise<boolean> {
        try {
            const resposta = await fetch(`${BASE_URL}/movimentacoes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(movimentacao)
            });

            return resposta.ok;
        } catch (error) {
            console.error(`Erro ao cadastrar movimentação: ${error}`);
            return false;
        }
    }

    /**
     * Atualiza as informações de uma movimentação existente
     */
    static async atualizarMovimentacao(movimentacao: MovimentacaoDTO): Promise<boolean> {
        if (!movimentacao.id_movimentacao) {
            console.error("Erro ao atualizar movimentação: ID da movimentação não informado.");
            return false;
        }

        try {
            const resposta = await fetch(`${BASE_URL}/movimentacoes/${movimentacao.id_movimentacao}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(movimentacao)
            });

            return resposta.ok;
        } catch (error) {
            console.error(`Erro ao atualizar movimentação: ${error}`);
            return false;
        }
    }

    /**
     * Remove uma movimentação pelo ID
     */
    static async removerMovimentacao(id_movimentacao: number): Promise<boolean> {
        try {
            const resposta = await fetch(`${BASE_URL}/movimentacoes/${id_movimentacao}`, {
                method: "DELETE"
            });

            return resposta.ok;
        } catch (error) {
            console.error(`Erro ao remover movimentação: ${error}`);
            return false;
        }
    }
}
import type ProdutoDTO from "../dto/ProdutoDTO";
import type CategoriaDTO from "../dto/CategoriaDTO";
import type MovimentacaoDTO from "../dto/MovimentacaoDTO";

export interface ErrosValidacao {
  [campo: string]: string;
}

export class Validacoes {
  
  /**
   * Valida os campos do formulário de Produto
   */
  static validarProduto(produto: Partial<ProdutoDTO>): ErrosValidacao {
    const erros: ErrosValidacao = {};

    if (!produto.nome || produto.nome.trim() === "") {
      erros.nome = "O nome do produto é obrigatório.";
    }

    if (!produto.codigo || produto.codigo.trim() === "") {
      erros.codigo = "O código do produto é obrigatório.";
    }

    if (!produto.id_categoria || produto.id_categoria <= 0) {
      erros.id_categoria = "Selecione uma categoria válida.";
    }

    if (produto.preco_unitario === undefined || produto.preco_unitario <= 0) {
      erros.preco_unitario = "O preço unitário deve ser maior que zero.";
    }

    if (produto.quantidade_minima === undefined || produto.quantidade_minima < 0) {
      erros.quantidade_minima = "A quantidade mínima não pode ser negativa.";
    }

    return erros;
  }

  /**
   * Valida os campos do formulário de Categoria
   */
  static validarCategoria(categoria: Partial<CategoriaDTO>): ErrosValidacao {
    const erros: ErrosValidacao = {};

    if (!categoria.nome || categoria.nome.trim() === "") {
      erros.nome = "O nome da categoria é obrigatório.";
    } else if (categoria.nome.trim().length < 3) {
      erros.nome = "O nome deve ter no mínimo 3 caracteres.";
    }

    return erros;
  }

  /**
   * Valida os campos do formulário de Movimentação de Estoque
   */
  static validarMovimentacao(movimentacao: Partial<MovimentacaoDTO>): ErrosValidacao {
    const erros: ErrosValidacao = {};

    if (!movimentacao.id_produto || movimentacao.id_produto <= 0) {
      erros.id_produto = "Selecione um produto válido.";
    }

    if (!movimentacao.tipo_movimentacao || !["ENTRADA", "SAIDA"].includes(movimentacao.tipo_movimentacao)) {
      erros.tipo_movimentacao = "O tipo deve ser ENTRADA ou SAIDA.";
    }

    if (!movimentacao.quantidade || movimentacao.quantidade <= 0) {
      erros.quantidade = "A quantidade movimentada deve ser maior que zero.";
    }

    return erros;
  }
}
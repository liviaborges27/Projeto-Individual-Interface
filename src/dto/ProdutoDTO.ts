export default interface ProdutoDTO {
    id_produto?: number,
    id_categoria: number,
    codigo: string,
    nome: string,
    descricao?: string,
    preco_unitario: number,
    quantidade_disponivel?: number,
    quantidade_minima: number,
    imagem?: string,
    imagem_url?: string,
    categoria_nome?: string,
    categoria_id?: number,
    ativo?: boolean,
    data_cadastro?: Date | string
}
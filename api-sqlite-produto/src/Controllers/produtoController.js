// Importar as funções do Model
const ProdutoModel = require('../Models/produtoModel');

// ============================================================
// FUNÇÃO: listarTodos (ASSÍNCRONA)
// ROTA: GET /produtos
// DESCRIÇÃO: Lista todos os produtos do banco de dados
// ============================================================
// A palavra 'async' antes da função permite usar 'await' dentro dela
async function listarTodos(req, res) {
  try {
    // 'await' pausa a execução até a Promise do Model resolver
    // É como "esperar" o banco de dados responder
    const produtos = await ProdutoModel.listarTodos();
    
    // Depois que os dados chegam, enviar a resposta
    res.status(200).json(produtos);
  } catch (erro) {
    // Se der qualquer erro, cai aqui
    res.status(500).json({ 
      mensagem: 'Erro ao listar produtos', 
      erro: erro.message 
    });
  }
}

// ============================================================
// FUNÇÃO: buscarPorId (ASSÍNCRONA)
// ROTA: GET /produtos/:id
// ============================================================
async function buscarPorId(req, res) {
  try {
    const id = parseInt(req.params.id);
    
    // Validar o ID antes de consultar o banco
    if (isNaN(id)) {
      return res.status(400).json({ 
        mensagem: 'ID inválido' 
      });
    }
    
    // Aguardar a busca no banco
    const produto = await ProdutoModel.buscarPorId(id);
    
    if (produto) {
      res.status(200).json(produto);
    } else {
      res.status(404).json({ 
        mensagem: `Produto ${id} não encontrado` 
      });
    }
  } catch (erro) {
    res.status(500).json({ 
      mensagem: 'Erro ao buscar produto',
      erro: erro.message 
    });
  }
}

// ============================================================
// FUNÇÃO: criar (ASSÍNCRONA)
// ROTA: POST /produtos
// ============================================================
async function criar(req, res) {
  try {
    const { nome, preco, estoque, categoria } = req.body;
    
    // Validações ANTES de tentar inserir no banco
    if (!nome || !preco || !estoque || !categoria) {
      return res.status(400).json({ 
        mensagem: 'Todos os campos são obrigatórios' 
      });
    }
    
    if (parseFloat(preco) <= 0) {
      return res.status(400).json({ 
        mensagem: 'O preço deve ser maior que zero' 
      });
    }
    
    if (parseInt(estoque) < 0) {
      return res.status(400).json({ 
        mensagem: 'O estoque não pode ser negativo' 
      });
    }
    
    // Aguardar a inserção no banco
    const novoProduto = await ProdutoModel.criar({ 
      nome, 
      preco, 
      estoque, 
      categoria 
    });
    
    // Retornar o produto criado com status 201
    res.status(201).json(novoProduto);
  } catch (erro) {
    res.status(500).json({ 
      mensagem: 'Erro ao criar produto',
      erro: erro.message 
    });
  }
}

// ============================================================
// FUNÇÃO: atualizar (ASSÍNCRONA)
// ROTA: PUT /produtos/:id
// ============================================================
async function atualizar(req, res) {
  try {
    const id = parseInt(req.params.id);
    const { nome, preco, estoque, categoria } = req.body;
    
    // Validações
    if (isNaN(id)) {
      return res.status(400).json({ 
        mensagem: 'ID inválido' 
      });
    }
    
    if (!nome || !preco || !estoque || !categoria) {
      return res.status(400).json({ 
        mensagem: 'Todos os campos são obrigatórios' 
      });
    }
    
    // Aguardar a atualização no banco
    const produtoAtualizado = await ProdutoModel.atualizar(id, { 
      nome, 
      preco, 
      estoque, 
      categoria 
    });
    
    if (produtoAtualizado) {
      res.status(200).json(produtoAtualizado);
    } else {
      res.status(404).json({ 
        mensagem: `Produto ${id} não encontrado` 
      });
    }
  } catch (erro) {
    res.status(500).json({ 
      mensagem: 'Erro ao atualizar produto',
      erro: erro.message 
    });
  }
}

// ============================================================
// FUNÇÃO: deletar (ASSÍNCRONA)
// ROTA: DELETE /produtos/:id
// ============================================================
async function deletar(req, res) {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ 
        mensagem: 'ID inválido' 
      });
    }
    
    // Aguardar a deleção no banco
    const deletado = await ProdutoModel.deletar(id);
    
    if (deletado) {
      res.status(200).json({ 
        mensagem: `Produto ${id} removido com sucesso` 
      });
    } else {
      res.status(404).json({ 
        mensagem: `Produto ${id} não encontrado` 
      });
    }
  } catch (erro) {
    res.status(500).json({ 
      mensagem: 'Erro ao deletar produto',
      erro: erro.message 
    });
  }
}

// ============================================================
// FUNÇÃO: buscarPorCategoria (ASSÍNCRONA)
// ROTA: GET /produtos/categoria/:categoria
// ============================================================
async function buscarPorCategoria(req, res) {
  try {
    const { categoria } = req.params;
    
    // Aguardar a busca no banco
    const produtos = await ProdutoModel.buscarPorCategoria(categoria);
    
    res.status(200).json(produtos);
  } catch (erro) {
    res.status(500).json({ 
      mensagem: 'Erro ao buscar produtos por categoria',
      erro: erro.message 
    });
  }
}

// ============================================================
// EXPORTAR TODAS AS FUNÇÕES
// ============================================================
module.exports = {
  listarTodos,
  buscarPorId,
  criar,
  atualizar,
  deletar,
  buscarPorCategoria
};


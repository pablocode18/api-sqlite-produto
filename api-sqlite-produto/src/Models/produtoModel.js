// Importar a conexão com o banco de dados
const db = require('../config/Database');

// ============================================================
// FUNÇÃO: listarTodos
// DESCRIÇÃO: Retorna todos os produtos do banco
// RETORNO: Promise que resolve com array de produtos
// ============================================================
function listarTodos() {
  // Retornamos uma Promise porque a operação é assíncrona
  return new Promise((resolve, reject) => {
    // SQL: SELECT busca todos os registros
    const sql = 'SELECT * FROM produtos';
    
    // db.all() busca múltiplas linhas
    // [] são os parâmetros (vazio neste caso)
    db.all(sql, [], (erro, linhas) => {
      if (erro) {
        reject(erro);    // Se der erro, rejeita a Promise
      } else {
        resolve(linhas); // Se sucesso, resolve com os dados
      }
    });
  });
}

// ============================================================
// FUNÇÃO: buscarPorId
// DESCRIÇÃO: Busca um produto específico pelo ID
// PARÂMETRO: id (número) - identificador do produto
// RETORNO: Promise que resolve com o produto ou undefined
// ============================================================
function buscarPorId(id) {
  return new Promise((resolve, reject) => {
    // O '?' é um placeholder seguro
    // Isso previne SQL Injection!
    const sql = 'SELECT * FROM produtos WHERE id = ?';
    
    // db.get() busca uma única linha
    db.get(sql, [id], (erro, linha) => {
      if (erro) {
        reject(erro);
      } else {
        resolve(linha);  // undefined se não encontrar
      }
    });
  });
}

// ============================================================
// FUNÇÃO: criar
// DESCRIÇÃO: Insere um novo produto no banco
// PARÂMETRO: dados (objeto) - contém nome, preco, estoque, categoria
// RETORNO: Promise que resolve com o produto criado (com ID)
// ============================================================
function criar(dados) {
  return new Promise((resolve, reject) => {
    // Desestruturar os dados
    const { nome, preco, estoque, categoria } = dados;
    
    // SQL: INSERT adiciona novo registro
    // IMPORTANTE: NÃO incluímos o ID aqui porque ele é AUTOINCREMENT
    // O SQLite gera o ID automaticamente!
    const sql = `
      INSERT INTO produtos (nome, preco, estoque, categoria)
      VALUES (?, ?, ?, ?)
    `;
    
    // db.run() executa comandos INSERT/UPDATE/DELETE
    // IMPORTANTE: usar 'function' tradicional (não arrow function)
    // para ter acesso ao 'this.lastID'
    db.run(sql, [nome, preco, estoque, categoria], function(erro) {
      if (erro) {
        reject(erro);
      } else {
        // this.lastID contém o ID que o banco gerou automaticamente
        // para o registro que acabamos de inserir
        resolve({
          id: this.lastID,
          nome,
          preco,
          estoque,
          categoria
        });
      }
    });
  });
}

// ⚠️ NOTA IMPORTANTE SOBRE AUTOINCREMENT:
// Quando criamos a tabela, definimos o campo ID como AUTOINCREMENT.
// Isso significa que o BANCO DE DADOS é responsável por gerar o próximo ID.
// 
// Por isso:
// ❌ NÃO fazemos: INSERT INTO produtos (id, nome, ...) VALUES (?, ?, ...)
// ✅ Fazemos: INSERT INTO produtos (nome, preco, ...) VALUES (?, ?, ...)
//
// O SQLite adiciona o ID automaticamente e podemos recuperá-lo usando this.lastID

// ============================================================
// FUNÇÃO: atualizar
// DESCRIÇÃO: Atualiza todos os dados de um produto
// PARÂMETROS:
//   - id (número): identificador do produto
//   - dados (objeto): novos dados
// RETORNO: Promise com produto atualizado ou null
// ============================================================
function atualizar(id, dados) {
  return new Promise((resolve, reject) => {
    const { nome, preco, estoque, categoria } = dados;
    
    // SQL: UPDATE modifica um registro existente
    const sql = `
      UPDATE produtos 
      SET nome = ?, preco = ?, estoque = ?, categoria = ?
      WHERE id = ?
    `;
    
    // Passar os parâmetros na ordem dos placeholders
    db.run(sql, [nome, preco, estoque, categoria, id], function(erro) {
      if (erro) {
        reject(erro);
      } else if (this.changes === 0) {
        // this.changes = quantidade de linhas afetadas
        // Se for 0, o produto não foi encontrado
        resolve(null);
      } else {
        // Produto atualizado com sucesso
        resolve({ id, nome, preco, estoque, categoria });
      }
    });
  });
}

// ============================================================
// FUNÇÃO: deletar
// DESCRIÇÃO: Remove um produto do banco
// PARÂMETRO: id (número) - identificador do produto
// RETORNO: Promise com true (sucesso) ou false (não encontrado)
// ============================================================
function deletar(id) {
  return new Promise((resolve, reject) => {
    // SQL: DELETE remove um registro
    const sql = 'DELETE FROM produtos WHERE id = ?';
    
    db.run(sql, [id], function(erro) {
      if (erro) {
        reject(erro);
      } else {
        // Retorna true se deletou alguma linha
        resolve(this.changes > 0);
      }
    });
  });
}

// ============================================================
// FUNÇÃO: buscarPorCategoria
// DESCRIÇÃO: Filtra produtos por categoria
// PARÂMETRO: categoria (string)
// RETORNO: Promise com array de produtos
// ============================================================
function buscarPorCategoria(categoria) {
  return new Promise((resolve, reject) => {
    // LIKE permite busca com padrão
    // O % significa "qualquer texto antes/depois"
    const sql = 'SELECT * FROM produtos WHERE categoria LIKE ?';
    
    db.all(sql, [`%${categoria}%`], (erro, linhas) => {
      if (erro) {
        reject(erro);
      } else {
        resolve(linhas);
      }
    });
  });
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


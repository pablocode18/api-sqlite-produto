const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho do arquivo do banco de dados
// __dirname = diretório atual do arquivo
const dbPath = path.resolve(__dirname, '../config/database.db');

// Criar/abrir a conexão com o banco
const db = new sqlite3.Database(dbPath, (erro) => {
  if (erro) {
    console.error('❌ Erro ao conectar:', erro);
  } else {
    console.log('✅ Conectado ao SQLite!');
  }
});

// Criar a tabela se não existir (executado ao iniciar o servidor)
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS produtos (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      nome      varchar(80)    NOT NULL,
      preco     decimal(10,2)    NOT NULL,
      estoque   INTEGER NOT NULL,
      categoria varchar(50)    NOT NULL
    )
  `, (erro) => {
    if (erro) {
      console.error('❌ Erro ao criar tabela:', erro);
    } else {
      console.log('✅ Tabela produtos verificada/criada');
    }
  });
});

// IMPORTANTE: Exportar o objeto 'db' diretamente
// NÃO exportar dentro de um objeto { db }
module.exports = db;

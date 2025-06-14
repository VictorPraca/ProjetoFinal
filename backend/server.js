// backend/server.js
const app = require('./app');
const { sequelize } = require('./config/db');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco de dados MySQL com sucesso.');

    await sequelize.sync({ alter: true }); // Altere para { force: true } se quiser resetar tabelas
    console.log('📦 Models sincronizados com o banco de dados.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Falha na conexão com o banco de dados:', error);
  }
}

startServer();
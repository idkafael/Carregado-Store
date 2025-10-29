const { Sequelize } = require('sequelize');

// Configurar SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false, // Set to console.log to see SQL queries
    define: {
        timestamps: true,
        underscored: true
    }
});

// Testar conexão
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexão com banco de dados estabelecida com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao conectar com banco de dados:', error);
    }
}

// Sincronizar banco de dados
async function syncDatabase() {
    try {
        await sequelize.sync({ alter: true });
        console.log('✅ Banco de dados sincronizado!');
    } catch (error) {
        console.error('❌ Erro ao sincronizar banco:', error);
    }
}

module.exports = { sequelize, testConnection, syncDatabase };



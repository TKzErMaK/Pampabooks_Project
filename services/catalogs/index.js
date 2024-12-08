const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const catalogRoutes = require('../../routes/catalogRoutes'); // Importa as rotas de catálogo

dotenv.config();

const app = express();
const PORT = process.env.PORT_CATALOGS || 3003;

const cors = require('cors');

// Middleware para habilitar CORS
app.use(cors({
  origin: 'http://localhost:8080', // Permite apenas este domínio
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Cabeçalhos permitidos
}));

// Verificação das variáveis de ambiente
if (!process.env.PORT_CATALOGS || !process.env.MONGO_URI_CATALOGS) {
  console.error('Erro: Variáveis de ambiente necessárias não definidas.');
  process.exit(1);
}

// Conecta ao banco de dados diretamente
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_CATALOGS, {});
    console.log('Conectado ao banco de catálogo (pampabooks-catalogs)');
  } catch (error) {
    console.error('Erro ao conectar ao banco de catálogo:', error.message);
    process.exit(1);
  }
};

// Middleware para parsing de JSON
app.use(express.json());

// Configuração de rotas para catálogo
app.use('/catalogs', catalogRoutes);

// Inicia o servidor após a conexão com o banco de dados
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor de Catálogo rodando em: http://localhost:${PORT}`);
  });
});
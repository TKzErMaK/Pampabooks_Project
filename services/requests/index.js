const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const requestRoutes = require('../../routes/requestRoutes'); // Importa as rotas de pedidos

const app = express();

// Verificação de variáveis de ambiente
if (!process.env.MONGO_URI_REQUESTS || !process.env.PORT_REQUESTS) {
  console.error('Erro: Variáveis de ambiente necessárias não definidas.');
  process.exit(1);
}

// Middleware para CORS e parsing de JSON
app.use(cors({
  origin: 'http://localhost:8080', // Permite apenas este domínio
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Cabeçalhos permitidos
}));
app.use(express.json());

// Conecta ao banco de dados do serviço de pedidos
mongoose
  .connect(process.env.MONGO_URI_REQUESTS, {
    retryWrites: true,
    connectTimeoutMS: 10000,
  })
  .then(() => console.log('Conectado ao banco de pedidos (pampabooks-requests)'))
  .catch((error) => console.error('Erro ao conectar ao banco de pedidos:', error));

// Configuração das rotas de pedidos
app.use('/requests', requestRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro interno:', err.message);
  res.status(500).json({ error: 'Erro interno no servidor' });
});

// Inicia o servidor
const PORT = process.env.PORT_REQUESTS || 3002;
app.listen(PORT, () => {
  console.log(`Servidor de Pedidos rodando em http://localhost:${PORT}`);
});
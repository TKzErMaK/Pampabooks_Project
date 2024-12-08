const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const assessmentRoutes = require('../../routes/reviewRoutes'); // Importa as rotas de avaliações

const app = express();

// Verificação de variáveis de ambiente
if (!process.env.MONGO_URI_REVIEWS || !process.env.PORT_REVIEWS) {
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

// Conecta ao banco de dados do serviço de avaliações
mongoose
  .connect(process.env.MONGO_URI_REVIEWS, {
    retryWrites: true,
    connectTimeoutMS: 10000,
  })
  .then(() => console.log('Conectado ao banco de avaliações (pampabooks-reviews)'))
  .catch((error) => {
    console.error('Erro ao conectar ao banco de avaliações:', error);
    process.exit(1);
  });

// Configuração das rotas de avaliações
app.use('/reviews', assessmentRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro interno:', err.message);
  res.status(500).json({ error: 'Erro interno no servidor' });
});

// Inicia o servidor
const PORT = process.env.PORT_REVIEWS || 3001;
app.listen(PORT, () => {
  console.log(`Servidor de Avaliações rodando em http://localhost:${PORT}`);
});
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('../../routes/userRoutes'); // Rotas de usuários

dotenv.config();

const app = express();
const PORT = process.env.PORT_USERS || 3000;

const cors = require('cors');

// Middleware para habilitar CORS
app.use(cors({
  origin: 'http://localhost:8080', // Permite apenas este domínio
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Cabeçalhos permitidos
}));

// Verificação das variáveis de ambiente
if (!process.env.PORT_USERS || !process.env.MONGO_URI_USERS) {
  console.error('Erro: Variáveis de ambiente necessárias não definidas.');
  process.exit(1);
}

// Conecta ao banco de dados diretamente
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_USERS, {});
    console.log('Conectado ao MongoDB com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);
    process.exit(1);
  }
};

// Middleware para parsing de JSON
app.use(express.json());

// Configuração de rotas para usuários
app.use('/users', userRoutes);

// Middleware para lidar com endpoints não encontrados
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

// Middleware para tratamento de erros gerais
app.use((err, req, res, next) => {
  console.error(`Erro na rota ${req.method} ${req.originalUrl}:`, err.message);
  res.status(500).json({ error: 'Erro interno no servidor' });
});

// Inicia o servidor após a conexão com o banco de dados
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor de Usuários rodando em: http://localhost:${PORT}`);
  });
});
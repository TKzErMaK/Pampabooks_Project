const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware para proteger rotas autenticadas
exports.protect = async (req, res, next) => {
  let token;

  // Verifica o cabeçalho de autorização ou cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: 'Não autorizado, sem token' });
  }

  try {
    // Decodifica e valida o token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Opcional: Verifique se o token expirou manualmente
    if (decoded.exp < Date.now() / 1000) {
      return res.status(401).json({ message: 'Token expirado' });
    }

    // Busca o usuário no banco de dados
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' });
    }
    return res.status(401).json({ message: 'Token inválido ou não autorizado' });
  }
};
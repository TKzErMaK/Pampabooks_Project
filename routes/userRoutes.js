const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/userModel'); // Importação do modelo User
const { registerUser, authUser, getUserProfile, generateToken } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Rota para registro de novos usuários com validação
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('O campo nome é obrigatório'),
    body('email').isEmail().withMessage('O campo email deve ser um email válido'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('O campo senha deve ter pelo menos 6 caracteres'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  registerUser
);

// Rota para autenticar usuários (login)
router.post('/login', authUser);

// Rota para obter o perfil do usuário autenticado
router.get('/profile', protect, getUserProfile);

// Rota para atualizar o perfil do usuário autenticado
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      token: generateToken(updatedUser._id), // Garantido que o token funcione corretamente
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar o perfil', error: error.message });
  }
});

module.exports = router;
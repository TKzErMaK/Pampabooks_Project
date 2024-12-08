const express = require('express');
const { body, validationResult } = require('express-validator');
const Review = require('../models/reviewModel');
const router = express.Router();

// Rota para criar uma nova avaliação
router.post(
  '/',
  [
    body('livroId').notEmpty().withMessage('O campo livroId é obrigatório'),
    body('userId').notEmpty().withMessage('O campo userId é obrigatório'),
    body('comentario').notEmpty().withMessage('O campo comentario é obrigatório'),
    body('nota')
      .isInt({ min: 1, max: 5 })
      .withMessage('A nota deve ser um número entre 1 e 5'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const newReview = new Review(req.body);
      const result = await newReview.save();
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Rota para listar todas as avaliações
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
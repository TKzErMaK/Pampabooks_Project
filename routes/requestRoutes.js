const express = require('express');
const { body, validationResult } = require('express-validator');
const Request = require('../models/requestModel');
const router = express.Router();

// Rota para criar um novo pedido
router.post(
  '/',
  [
    body('userId').isMongoId().withMessage('O campo userId deve ser um ID válido'),
    body('itens').isArray({ min: 1 }).withMessage('O campo itens deve ser uma lista com pelo menos um item'),
    body('itens.*.livroId').isMongoId().withMessage('O campo livroId deve ser um ID válido em cada item'),
    body('itens.*.quantidade')
      .isInt({ min: 1 })
      .withMessage('O campo quantidade deve ser um número maior ou igual a 1'),
    body('total').isFloat({ min: 0 }).withMessage('O campo total deve ser um número maior ou igual a 0'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const newRequest = new Request(req.body);
      const result = await newRequest.save();
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Rota para listar todos os pedidos com suporte a filtros e paginação
router.get('/', async (req, res) => {
  const { userId, page = 1, limit = 10 } = req.query;

  try {
    const query = userId ? { userId } : {};
    const requests = await Request.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para buscar detalhes de um pedido específico
router.get('/:id', async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
const express = require('express');
const { body, validationResult } = require('express-validator');
const Book = require('../models/bookModel');

const router = express.Router();

// Rota para listar todos os livros
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para obter detalhes de um livro por ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Livro não encontrado' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para adicionar um novo livro
router.post(
  '/',
  [
    body('titulo').notEmpty().withMessage('O título é obrigatório'),
    body('autor').notEmpty().withMessage('O autor é obrigatório'),
    body('categoria').notEmpty().withMessage('A categoria é obrigatória'),
    body('preco').isFloat({ min: 0 }).withMessage('O preço deve ser um número maior ou igual a 0'),
    body('estoque').isInt({ min: 0 }).withMessage('O estoque deve ser um número inteiro maior ou igual a 0'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const book = new Book(req.body);
      const savedBook = await book.save();
      res.status(201).json(savedBook);
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({ error: 'Já existe um livro com este título ou esta combinação de título e autor.' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
);

// Rota para atualizar um livro por ID
router.put('/:id', async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedBook) {
      return res.status(404).json({ message: 'Livro não encontrado' });
    }
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para remover um livro por ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ message: 'Livro não encontrado' });
    }
    res.json({ message: 'Livro removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
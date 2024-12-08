const mongoose = require('mongoose');

// Definição do schema para o Catálogo de Livros
const bookSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'O título do livro é obrigatório'],
    unique: true, // Garante que o título seja único
  },
  autor: {
    type: String,
    required: [true, 'O autor do livro é obrigatório'],
  },
  categoria: {
    type: String,
    required: [true, 'A categoria do livro é obrigatória'],
  },
  preco: {
    type: Number,
    required: [true, 'O preço do livro é obrigatório'],
    min: [0, 'O preço deve ser um número maior ou igual a 0'],
  },
  descricao: {
    type: String,
    required: true,
  },
  estoque: {
    type: Number,
    required: [true, 'O estoque do livro é obrigatório'],
    min: [0, 'O estoque não pode ser negativo'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
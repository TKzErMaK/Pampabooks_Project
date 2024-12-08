const mongoose = require('mongoose');

// Definição do schema para avaliações
const reviewSchema = new mongoose.Schema(
  {
    livroId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Livro', 
      required: [true, 'O campo livroId é obrigatório'],
      index: true,
    },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: [true, 'O campo userId é obrigatório'],
      index: true,
    },
    comentario: { 
      type: String, 
      required: [true, 'O campo comentario é obrigatório'],
      validate: {
        validator: function (value) {
          return value.trim().length > 0;
        },
        message: 'O comentário não pode estar vazio',
      },
    },
    nota: { 
      type: Number, 
      required: [true, 'O campo nota é obrigatório'], 
      min: [1, 'A nota mínima é 1'],
      max: [5, 'A nota máxima é 5'],
      validate: {
        validator: Number.isInteger,
        message: 'A nota deve ser um número inteiro entre 1 e 5',
      },
    },
    data: { 
      type: Date, 
      default: Date.now 
    },
  },
  { timestamps: true }
);

// Criação do modelo baseado no schema
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
const mongoose = require('mongoose');

// Definição do schema para pedidos
const requestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'O campo userId é obrigatório'],
      index: true,
    },
    itens: [
      {
        livroId: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Livro', 
          required: [true, 'O campo livroId é obrigatório'] 
        },
        quantidade: { 
          type: Number, 
          required: [true, 'O campo quantidade é obrigatório'], 
          min: [1, 'A quantidade deve ser pelo menos 1'],
          validate: {
            validator: Number.isInteger,
            message: 'A quantidade deve ser um número inteiro',
          },
        },
      },
    ],
    total: {
      type: Number,
      required: [true, 'O campo total é obrigatório'],
    },
    data: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

// Middleware para calcular o total do pedido antes de salvar
requestSchema.pre('save', function (next) {
  if (!this.total) {
    this.total = this.itens.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
  }
  next();
});

// Criação do modelo baseado no schema
const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
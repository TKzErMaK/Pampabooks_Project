const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Definição do schema do usuário
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'O campo nome é obrigatório'],
    },
    email: {
      type: String,
      required: [true, 'O campo email é obrigatório'],
      unique: true,
      validate: {
        validator: function (value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: 'Email inválido',
      },
    },
    password: {
      type: String,
      required: [true, 'O campo senha é obrigatório'],
      minlength: [6, 'A senha deve ter pelo menos 6 caracteres'],
      select: false, // Evita que a senha seja incluída em consultas padrão
    },
  },
  { timestamps: true }
);

// Middleware para hash da senha antes de salvar
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar senha inserida com a armazenada
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) {
    throw new Error("O hash da senha não está definido.");
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

// Método para redefinir a senha
userSchema.methods.resetPassword = async function (newPassword) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(newPassword, salt);
  await this.save();
};

// Criação e exportação do modelo
const User = mongoose.model('User', userSchema);
module.exports = User;
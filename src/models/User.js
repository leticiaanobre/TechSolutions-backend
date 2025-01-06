import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['client', 'developer', 'admin'],
    required: true,
    default: 'client'
  },
  // Campos específicos para clientes
  hourBank: {
    total: { type: Number, default: 0 }, // Total de horas contratadas
    used: { type: Number, default: 0 },  // Horas já utilizadas
    plan: { type: String, enum: ['basic', 'premium', 'enterprise'] }
  },
  // Campos específicos para desenvolvedores
  skills: [{
    type: String
  }],
  availability: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash da senha antes de salvar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar senhas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);

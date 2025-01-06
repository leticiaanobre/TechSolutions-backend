import User from '../models/User.js';

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem acessar esta rota.' });
    }

    next();
  } catch (error) {
    console.error('Erro ao verificar permissão de administrador:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export default isAdmin;


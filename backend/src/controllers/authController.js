// backend/src/controllers/authController.js
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Controlador para registrar um novo usuário
exports.register = async (req, res) => {
  try {
    const { username, email, password, dateOfBirth } = req.body;
    const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;

    if (!username || !email || !password || !dateOfBirth) {
        return res.status(400).json({ message: 'Por favor, preencha todos os campos obrigatórios.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'A senha deve ter no mínimo 6 caracteres.' });
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: 'Este e-mail já está registrado.' });
    }
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ message: 'Este nome de usuário já está em uso.' });
    }

    const newUser = await User.create({ username, email, password, dateOfBirth, profilePicture });

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ 
        message: 'Usuário registrado com sucesso!', 
        user: { id: newUser.id, username: newUser.username, email: newUser.email, profilePicture: newUser.profilePicture },
        token 
    });
  } catch (error) {
    console.error('Erro no registro do usuário:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: 'Nome de usuário ou e-mail já existe.' });
    }
    res.status(500).json({ error: 'Erro interno do servidor ao registrar usuário.', details: error.message });
  }
};

// Controlador para login de usuário
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Credenciais inválidas: e-mail ou senha incorretos.' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ 
        token, 
        user: { id: user.id, username: user.username, email: user.email, profilePicture: user.profilePicture } 
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao fazer login.' });
  }
};

// Controlador para validar um token JWT e retornar dados do usuário
// O middleware 'protect' já verificou o token e anexou o objeto 'user' à requisição
exports.validateToken = async (req, res) => { // <-- A FUNÇÃO DEVE ESTAR DEFINIDA E EXPORTADA AQUI
  try {
    // req.user é populado pelo middleware 'protect'.
    // Se protect falhou (e.g., token inválido/expirado), ele já retornou 401.
    // Se chegou aqui, significa que o token é válido e req.user deve existir.
    if (!req.user) {
        // Isso não deveria acontecer se 'protect' funcionar corretamente, mas é um fallback.
        return res.status(401).json({ message: 'Token válido, mas usuário não encontrado (erro interno).' });
    }
    // Retorna os dados do usuário logado (já filtrados de senha pelo protect)
    res.json({ message: 'Token válido.', user: req.user });
  } catch (error) {
    console.error('Erro ao validar token:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao validar token.' });
  }
};

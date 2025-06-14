// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { register, login } = require('../controllers/authController');

// Configuração do Multer para upload de imagem de perfil
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile_pics/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Rotas
router.post('/register', upload.single('profilePicture'), register);
router.post('/login', login);

module.exports = router;

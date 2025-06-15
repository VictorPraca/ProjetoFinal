const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const path = require('path');

// Importar modelos para sincronização
const User = require('./models/userModel');
const Post = require('./models/postModel');
const Interaction = require('./models/interactionModel');
const { Group, GroupMember } = require('./models/groupModel');
const GroupMessage = require('./models/groupMessageModel');
const PrivateMessage = require('./models/privateMessageModel');
const Tag = require('./models/tagModel');


// Importar rotas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes'); // <-- Importação do postRoutes
const groupRoutes = require('./routes/groupRoutes');
const messageRoutes = require('./routes/messageRoutes');
const tagRoutes = require('./routes/tagRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); // Servir arquivos estáticos

// Rotas
app.use('/api/auth', authRoutes); // Linha ~33
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes); // <-- Esta é a linha 36 se contar do app.use(cors()) como ~30
app.use('/api/groups', groupRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/tags', tagRoutes);

// Sincronizar modelos com o banco de dados e iniciar o servidor
sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to sync database:', err);
});
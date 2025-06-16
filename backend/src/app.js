const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const path = require('path');

// Importar modelos
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
const postRoutes = require('./routes/postRoutes');
const groupRoutes = require('./routes/groupRoutes'); // <-- VERIFIQUE SE ESTÁ IMPORTADO
const messageRoutes = require('./routes/messageRoutes');
const tagRoutes = require('./routes/tagRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); 

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/groups', groupRoutes); // <-- VERIFIQUE SE ESTÁ USADO EXATAMENTE ASSIM
app.use('/api/messages', messageRoutes);
app.use('/api/tags', tagRoutes);

// Sincronizar modelos e iniciar servidor
sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to sync database:', err);
});

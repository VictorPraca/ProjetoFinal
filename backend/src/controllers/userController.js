const User = require('../models/userModel');

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id; // Ou req.user se for o próprio perfil do usuário logado
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] } // Não retornar a senha
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendConnectionRequest = async (req, res) => {
    try {
        const { receiverId } = req.body;
        const senderId = req.user; // ID do usuário logado

        const sender = await User.findByPk(senderId);
        const receiver = await User.findByPk(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Verificar se já existe uma conexão ou solicitação pendente
        const existingConnection = await sender.getConnections({ where: { id: receiverId } });
        const existingRequest = await receiver.getConnections({ where: { id: senderId } }); // Se o outro já enviou uma solicitação

        if (existingConnection.length > 0) {
            return res.status(400).json({ message: 'Already connected or connection request sent.' });
        }
        if (existingRequest.length > 0) { // Pode significar que já há uma solicitação do outro lado
            return res.status(400).json({ message: 'Pending connection request from this user.' });
        }

        // Lógica para registrar uma solicitação de conexão pendente.
        // Isso geralmente exigiria uma tabela intermediária `ConnectionRequests`
        // ou um status na tabela `UserConnections`.
        // Para simplicidade, vamos considerar que adicionar a conexão aqui significa uma solicitação,
        // e a aceitação será outra operação que confirma a conexão de ambos os lados.
        await sender.addConnection(receiver);
        res.status(200).json({ message: 'Connection request sent.' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.acceptConnectionRequest = async (req, res) => {
    try {
        const { senderId } = req.body;
        const receiverId = req.user; // ID do usuário logado (que está aceitando)

        const sender = await User.findByPk(senderId);
        const receiver = await User.findByPk(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Verificar se há uma solicitação pendente do remetente
        const hasPendingRequest = await receiver.hasConnection(sender);

        if (!hasPendingRequest) {
            return res.status(400).json({ message: 'No pending connection request from this user.' });
        }

        // Para aceitar, criamos a conexão recíproca.
        await receiver.addConnection(sender);
        res.status(200).json({ message: 'Connection accepted.' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
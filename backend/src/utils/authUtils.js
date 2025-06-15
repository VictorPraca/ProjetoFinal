    const jwt = require('jsonwebtoken');
    const User = require('../models/userModel');

    exports.protect = async (req, res, next) => {
      let token;
      console.log('\n--- Middleware PROTECT Iniciado ---');
      console.log('Cabeçalhos da Requisição:', req.headers.authorization); // Log do cabeçalho completo

      // Verifica se o token está presente no cabeçalho Authorization (Bearer token)
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; // Extrai o token
        console.log('Token encontrado (parte):', token ? token.substring(0, 10) + '...' : 'Vazio');
      } else {
        console.log('Nenhum cabeçalho Authorization ou formato inválido (não é Bearer).');
      }

      // Se nenhum token for encontrado, retorna erro de não autorizado
      if (!token) {
        console.error('PROTECT ERRO: Nenhum token fornecido.');
        return res.status(401).json({ message: 'Não autorizado, nenhum token fornecido.' });
      }

      try {
        // Verifica e decodifica o token usando o segredo JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token DECODIFICADO. ID do usuário:', decoded.id);

        // Encontra o usuário no banco de dados pelo ID do token (exclui a senha)
        req.user = await User.findByPk(decoded.id, { attributes: { exclude: ['password'] } });
        console.log('Usuário encontrado pelo token:', req.user ? req.user.username : 'Nenhum (ID do token não encontrado no DB).');

        // Se o usuário não for encontrado, o token pode ser válido mas o usuário não existe mais
        if (!req.user) {
            console.error('PROTECT ERRO: Usuário do token não encontrado no DB.');
            return res.status(401).json({ message: 'Não autorizado, usuário do token não encontrado.' });
        }

        console.log('PROTECT SUCESSO: Usuário autenticado:', req.user.username);
        next(); // Passa para o próximo middleware/controlador (toggleLikeDislike)
      } catch (error) {
        // Se o token for inválido ou expirado
        console.error('PROTECT ERRO FATAL: Falha na verificação JWT:', error.message);
        res.status(401).json({ message: 'Não autorizado, token inválido ou expirado.' });
      } finally {
          console.log('--- Middleware PROTECT Finalizado ---\n');
      }
    };
    
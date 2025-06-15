// src/mockData.js
// Se você não está mais usando dados mockados, este arquivo pode ser limpo ou removido.
// Caso precise de mock para algo específico, garanta que as URLs de imagens/vídeos sejam válidas ou montadas.

export const MOCK_USER = { /* ... */ }; // Remova se não usar
export const MOCK_TOKEN = 'mock_token'; // Remova se não usar

export const MOCK_POSTS = [
  // Exemplo de como um post mockado deveria ser para funcionar com as URLs montadas
  {
    id: 'post1',
    User: { // Corresponde ao nome 'User' no Sequelize include
        id: 1,
        username: 'usuarioSimulado',
        profilePicture: '/uploads/default_user.png' // Use um caminho relativo que seu backend sirva
    },
    content: 'Esta é a primeira postagem simulada (após remover mocks)!',
    contentType: 'text',
    createdAt: new Date().toISOString(),
    mediaUrl: null, // Se não tiver mídia
    likes: 0, dislikes: 0, comments: []
  },
  {
    id: 'post2',
    User: {
        id: 2,
        username: 'outroUsuario',
        profilePicture: '/uploads/outro_usuario.png' // Use um caminho relativo
    },
    content: 'Outra postagem com uma imagem.',
    contentType: 'image',
    mediaUrl: '/uploads/sample_image.jpg', // Use um caminho relativo
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    likes: 0, dislikes: 0, comments: []
  },
  {
    id: 'post3',
    User: {
        id: 1,
        username: 'usuarioSimulado',
        profilePicture: '/uploads/default_user.png'
    },
    content: 'E aqui um vídeo!',
    contentType: 'video',
    mediaUrl: '/uploads/sample_video.mp4', // Use um caminho relativo
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    likes: 0, dislikes: 0, comments: []
  }
];

export const COMMENT_USERS = [ /* ... */ ]; // Remova se não usar
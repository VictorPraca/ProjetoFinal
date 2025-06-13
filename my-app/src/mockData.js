// src/mockData.js

// Dados do usuário "mock" (simulado para o contexto de autenticação)
export const MOCK_USER = {
  id: 'user-simulado-123',
  username: 'usuarioSimulado',
  email: 'simulado@example.com',
  profilePicUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  bio: 'Este é um usuário simulado para testes no frontend.',
};

// Token "mock" (simulado para o contexto de autenticação)
export const MOCK_TOKEN = 'mock_jwt_token_simulado_1234567890abcdef';

// Usuários para comentários e interações (reutilizáveis em posts e comentários)
export const COMMENT_USERS = {
  'user-simulado-123': { id: 'user-simulado-123', username: 'usuarioSimulado', profilePicUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' },
  'outro-user-id': { id: 'outro-user-id', username: 'outroUsuario', profilePicUrl: 'https://cdn-icons-png.flaticon.com/512/147/147133.png' },
  'terceiro-user-id': { id: 'terceiro-user-id', username: 'terceiroUser', profilePicUrl: 'https://cdn-icons-png.flaticon.com/512/6596/6596121.png' },
  'quarto-user-id': { id: 'quarto-user-id', username: 'quartoUser', profilePicUrl: 'https://cdn-icons-png.flaticon.com/512/21/21104.png' },
};

// Dados Mockados de Comunidades
export const MOCK_COMMUNITIES = [
  {
    id: 'comm1',
    name: 'Programação',
    slug: 'programacao',
    description: 'Comunidade para discutir sobre programação, linguagens, frameworks e desenvolvimento em geral.',
    createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
    membersCount: 1500,
    isMember: false,
    isAdmin: false,
  },
  {
    id: 'comm2',
    name: 'ReactJs Brasil',
    slug: 'reactjs-brasil',
    description: 'Tudo sobre React.js no Brasil. Dúvidas, dicas, projetos e eventos.',
    createdAt: new Date('2023-08-20T14:30:00Z').toISOString(),
    membersCount: 800,
    isMember: true,
    isAdmin: true,
  },
  {
    id: 'comm3',
    name: 'Jogos Online',
    slug: 'jogos-online',
    description: 'Para apaixonados por jogos online, notícias, reviews e encontrar times.',
    createdAt: new Date('2024-03-01T18:00:00Z').toISOString(),
    membersCount: 2300,
    isMember: false,
    isAdmin: false,
  },
];

// Dados Mockados de Postagens (já com comentários aninhados)
export const MOCK_POSTS = [
  {
    id: 'post1',
    user: COMMENT_USERS['user-simulado-123'], // Referencia um usuário de COMMENT_USERS
    createdAt: new Date('2025-06-11T10:00:00Z').toISOString(),
    contentType: 'text', content: 'Olá a todos! Que dia lindo para testar a nova rede social!',
    likes: 15, dislikes: 2, commentsCount: 2,
    communityId: 'comm1',
    comments: [
      { id: 'c1_1', user: COMMENT_USERS['outro-user-id'], content: 'Ótima postagem! Concordo plenamente.', createdAt: new Date('2025-06-11T10:10:00Z').toISOString(), parentId: null, likes: 5, dislikes: 0, replies: [] },
      { id: 'c1_2', user: COMMENT_USERS['user-simulado-123'], content: 'Obrigado! Em breve teremos mais funcionalidades.', createdAt: new Date('2025-06-11T10:15:00Z').toISOString(), parentId: null, likes: 1, dislikes: 0, replies: [{ id: 'c1_2_r1', user: COMMENT_USERS['terceiro-user-id'], content: 'Mal posso esperar!', createdAt: new Date('2025-06-11T10:12:00Z').toISOString(), parentId: 'c1_2', likes: 0, dislikes: 0, replies: [] }] },
    ],
  },
  {
    id: 'post2',
    user: COMMENT_USERS['outro-user-id'],
    createdAt: new Date('2025-06-10T15:30:00Z').toISOString(),
    contentType: 'image', content: 'Meu novo setup de trabalho, o que acharam?', imageUrl: 'https://images.unsplash.com/photo-1542831371-d41f71a48c66?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    likes: 45, dislikes: 1, commentsCount: 1,
    communityId: 'comm2',
    comments: [
      { id: 'c2_1', user: COMMENT_USERS['user-simulado-123'], content: 'Muito legal! Adorei a organização.', createdAt: new Date('2025-06-10T15:40:00Z').toISOString(), parentId: null, likes: 5, dislikes: 0, replies: [] },
    ],
  },
  {
    id: 'post3',
    user: COMMENT_USERS['user-simulado-123'],
    createdAt: new Date('2025-06-09T08:15:00Z').toISOString(),
    contentType: 'video', content: 'Olhem só essa dica de produtividade que aprendi!', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    likes: 22, dislikes: 0, commentsCount: 1,
    communityId: 'comm1',
    comments: [
        { id: 'c3_1', user: COMMENT_USERS['quarto-user-id'], content: 'Excelente dica! Vou aplicar no meu dia a dia.', createdAt: new Date('2025-06-09T08:30:00Z').toISOString(), parentId: null, likes: 1, dislikes: 0, replies: [] },
    ],
  },
  {
    id: 'post4',
    user: COMMENT_USERS['outro-user-id'],
    createdAt: new Date('2025-06-08T18:00:00Z').toISOString(),
    contentType: 'text', content: 'Hoje o dia foi produtivo! #devlife',
    likes: 30, dislikes: 0, commentsCount: 0,
    communityId: 'comm2',
    comments: [],
  },
];

// Dados Mockados de Mensagens Privadas (se você já os definiu)
// export const MOCK_MESSAGES_CONVERSATIONS = [ /* ... */ ];
// export const MOCK_MESSAGES_MESSAGES = { /* ... */ };
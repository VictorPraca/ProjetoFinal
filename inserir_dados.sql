-- Usuários
INSERT INTO usuario (nome_usuario, email, data_nascimento, foto_perfil) VALUES
('ana123', 'ana@gmail.com', '2000-01-15', 'ana.jpg'),
('lucas_dev', 'lucas@hotmail.com', '1998-03-20', 'lucas.png'),
('carolzinha', 'carol@yahoo.com', '1995-07-10', 'carol.jpg'),
('joao.tech', 'joao@gmail.com', '2001-12-02', 'joao.png'),
('duda.art', 'duda@art.com', '1999-08-30', 'duda.jpg');

-- Grupos
INSERT INTO grupo (nome, descricao) VALUES
('Tech Lovers', 'Grupo para apaixonados por tecnologia'),
('Arte e Cultura', 'Discussões sobre arte moderna'),
('Programação', 'Ajuda em linguagens de programação');

-- Membros de grupos
INSERT INTO membro_grupo (id_usuario, id_grupo, funcao) VALUES
(1, 1, 'administrador'),
(2, 1, 'membro'),
(3, 2, 'administrador'),
(4, 3, 'administrador'),
(5, 2, 'membro');

-- Postagens
INSERT INTO postagem (id_usuario, conteudo, tipo) VALUES
(1, 'Primeira postagem da Ana!', 'texto'),
(2, 'Olhem esse meme 😆', 'imagem'),
(3, 'Nova exposição de arte em SP', 'texto'),
(4, 'Como usar JOINs em SQL', 'texto'),
(5, 'Meu novo desenho!', 'imagem');

-- Comentários
INSERT INTO comentario (id_postagem, id_usuario, conteudo) VALUES
(1, 2, 'Muito legal, Ana!'),
(2, 1, 'Kkkk bom demais'),
(3, 5, 'Amei essa exposição'),
(4, 3, 'Salvou minha vida com esse post!');

-- Tags
INSERT INTO tag (nome) VALUES
('tecnologia'), ('arte'), ('memes'), ('sql'), ('pintura');

-- Associação usuário-tag
INSERT INTO usuario_tag (id_usuario, id_tag) VALUES
(1, 1), (1, 3),
(2, 1), (2, 4),
(3, 2), (3, 5),
(4, 1), (4, 4),
(5, 2), (5, 5);

-- Mensagens privadas
INSERT INTO mensagem_privada (id_remetente, id_destinatario, conteudo, status) VALUES
(1, 2, 'Oi, tudo bem?', 'enviada'),
(2, 1, 'Tudo sim e você?', 'recebida'),
(3, 5, 'Vai na exposição amanhã?', 'enviada'),
(5, 3, 'Sim! Com certeza.', 'lida');

-- Avaliações
INSERT INTO avaliacao (id_usuario, tipo_avaliacao, id_postagem) VALUES
(2, 'positivo', 1),
(3, 'positivo', 1),
(1, 'negativo', 2),
(4, 'positivo', 4),
(5, 'positivo', 3);

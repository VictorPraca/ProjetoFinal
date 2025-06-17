-- Postagens de um usuário
SELECT * FROM postagem WHERE id_usuario = 1;

-- Comentários de uma postagem
SELECT * FROM comentario WHERE id_postagem = 1;

-- Membros de um grupo
SELECT u.nome_usuario, g.nome AS grupo, m.funcao
FROM membro_grupo m
JOIN usuario u ON u.id_usuario = m.id_usuario
JOIN grupo g ON g.id_grupo = m.id_grupo
WHERE g.id_grupo = 1;

-- Quantidade de postagens por usuário
SELECT u.nome_usuario, COUNT(p.id_postagem) AS total_postagens
FROM usuario u
LEFT JOIN postagem p ON u.id_usuario = p.id_usuario
GROUP BY u.id_usuario;

-- Usuários com a tag 'arte'
SELECT u.nome_usuario, t.nome AS tag
FROM usuario_tag ut
JOIN usuario u ON ut.id_usuario = u.id_usuario
JOIN tag t ON ut.id_tag = t.id_tag
WHERE t.nome = 'arte';

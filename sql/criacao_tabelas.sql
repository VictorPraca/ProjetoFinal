CREATE DATABASE rede_social;
USE rede_social;

CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome_usuario VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    data_nascimento DATE NOT NULL,
    foto_perfil VARCHAR(255)
);

CREATE TABLE postagem (
    id_postagem INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    conteudo TEXT NOT NULL,
    tipo ENUM('texto', 'imagem', 'video') NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE comentario (
    id_comentario INT AUTO_INCREMENT PRIMARY KEY,
    id_postagem INT NOT NULL,
    id_usuario INT NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    conteudo TEXT NOT NULL,
    id_comentario_pai INT NULL,
    FOREIGN KEY (id_postagem) REFERENCES postagem(id_postagem),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_comentario_pai) REFERENCES comentario(id_comentario)
);

CREATE TABLE avaliacao (
    id_avaliacao INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    tipo_avaliacao ENUM('positivo', 'negativo') NOT NULL,
    id_postagem INT NULL,
    id_comentario INT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_postagem) REFERENCES postagem(id_postagem),
    FOREIGN KEY (id_comentario) REFERENCES comentario(id_comentario)
);

CREATE TABLE grupo (
    id_grupo INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL,
    descricao TEXT,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE membro_grupo (
    id_usuario INT NOT NULL,
    id_grupo INT NOT NULL,
    funcao ENUM('membro', 'administrador') NOT NULL,
    PRIMARY KEY (id_usuario, id_grupo),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_grupo) REFERENCES grupo(id_grupo)
);

CREATE TABLE mensagem_privada (
    id_mensagem INT AUTO_INCREMENT PRIMARY KEY,
    id_remetente INT NOT NULL,
    id_destinatario INT NOT NULL,
    conteudo TEXT NOT NULL,
    data_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('enviada', 'recebida', 'lida') NOT NULL,
    FOREIGN KEY (id_remetente) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_destinatario) REFERENCES usuario(id_usuario)
);

CREATE TABLE tag (
    id_tag INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE usuario_tag (
    id_usuario INT NOT NULL,
    id_tag INT NOT NULL,
    PRIMARY KEY (id_usuario, id_tag),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_tag) REFERENCES tag(id_tag)
);

// src/pages/LoginPage.jsx
import React from 'react';

const RegisterPage = () => {
  return (
    // O contêiner principal da sua página de login'
    <div className="center-container"> {/* Aplica os estilos de centralização */}
      <div className="card-login"> {/* Estilos para o card do formulário */}
        <h1>Cadastre-se</h1> {/* Título do formulário */}

        {/* Seu campo nome */}
        <label htmlFor="nome">Nome Completo:</label>
        <input type="text" id="nome" name="email-username" placeholder="Nome Completo" />
        <br/>
        {/* Seu campo Data de Nascimento */}
        <label htmlFor="dataNasc">Data de Nascimento:</label>
        <br/>
        <input type="date" id="dataNasc" name="dataNasc" />
        <br/>
        {/* Seus campos de E-mail / Nome de Usuário */}
        <label htmlFor="username">Nome de Usuário:</label>
        <input type="text" id="username" name="username" placeholder="usuario" />
        <br/>
        <label htmlFor="email">E-mail:</label>
        <input type="email" id="email" name="email" placeholder="email" />
        <br/>
        {/* Seu campo de Senha */}
        <label htmlFor="password">Senha:</label>
        <input type="password" id="password" name="password" placeholder="senha" />
        <br/>
        {/* Seu botão Entrar */}
        <button type="submit">Entrar</button>
      </div>
    </div>
  );
};

export default RegisterPage;
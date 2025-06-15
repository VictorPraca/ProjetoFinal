// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api'; // Importa a instância configurada do Axios para comunicação com o backend
import { useNavigate } from 'react-router-dom'; // Para redirecionar após login/logout

// 1. Criação do Contexto
// O valor inicial é null, será preenchido pelo AuthProvider
const AuthContext = createContext(null);

// 2. Componente Provedor de Autenticação
export const AuthProvider = ({ children }) => {
  // Estados para gerenciar o usuário logado, o status de carregamento e a navegação
  const [user, setUser] = useState(null); // Armazena os dados do usuário logado
  const [loading, setLoading] = useState(true); // Indica se a verificação inicial de autenticação está em andamento
  const navigate = useNavigate(); // Hook para navegação programática

  // Efeito para verificar o token no localStorage na inicialização da aplicação
  // Isso mantém o usuário logado se ele fechar e reabrir o navegador
  useEffect(() => {
    const loadUser = async () => {
      console.log('AuthContext: Iniciando verificação de autenticação...');
      const token = localStorage.getItem('authToken'); // Tenta obter o token do localStorage

      if (token) {
        console.log('AuthContext: Token encontrado no localStorage. Tentando validar no backend...');
        try {
          // Chama uma rota do backend para validar o token
          // O middleware 'protect' do backend irá verificar o token JWT.
          // Se for válido, o backend pode retornar os dados atualizados do usuário.
          const response = await api.get('/api/auth/validate-token');
          setUser(response.data.user); // Define os dados do usuário recebidos do backend
          console.log('AuthContext: Token validado e usuário carregado:', response.data.user.username);
        } catch (error) {
          console.error('AuthContext: Erro ao validar token ou carregar usuário:', error.response?.data?.message || error.message);
          // Se o token for inválido, expirado ou houver erro na validação, remove-o
          localStorage.removeItem('authToken');
          setUser(null); // Garante que o usuário não está logado
          // Opcional: redirecionar para login se o token for inválido/expirado ao carregar
          // navigate('/login');
        }
      } else {
        console.log('AuthContext: Nenhum token encontrado no localStorage. Usuário não logado.');
        setUser(null); // Garante que o usuário não está logado
      }
      setLoading(false); // Finaliza o estado de carregamento
      console.log('AuthContext: Verificação de autenticação finalizada. Loading:', false);
    };

    loadUser(); // Chama a função ao montar o componente
  }, []); // O array vazio garante que este efeito roda apenas uma vez (na montagem)

  // Função de Login: Envia as credenciais para o backend e armazena o token
  const login = async (email, password) => {
    console.log('AuthContext: Tentando fazer login com o backend...');
    try {
      // Faz a requisição POST para a rota de login do backend
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user: userData } = response.data; // Espera 'token' e 'user' na resposta do backend

      localStorage.setItem('authToken', token); // Armazena o token JWT no localStorage
      setUser(userData); // Define os dados do usuário no estado do contexto
      console.log('AuthContext: Login bem-sucedido. Redirecionando para / (Feed)');
      navigate('/'); // Redireciona para a página principal (Feed) após o login
      return true; // Retorna true para indicar sucesso
    } catch (error) {
      console.error('AuthContext: Erro no login:', error.response?.data || error.message);
      // Lança o erro para que o componente que chamou 'login' (ex: LoginPage) possa tratá-lo
      throw error;
    }
  };

  // Função de Logout: Remove o token e os dados do usuário
  const logout = () => {
    console.log('AuthContext: Fazendo logout...');
    localStorage.removeItem('authToken'); // Remove o token do localStorage
    setUser(null); // Limpa os dados do usuário do estado
    navigate('/login'); // Redireciona para a página de login
  };

  // Valor que será fornecido pelo contexto para os componentes filhos
  const contextValue = {
    user, // Dados do usuário logado (ou null)
    isAuthenticated: !!user, // Booleano que indica se o usuário está logado
    loading, // Estado de carregamento inicial
    login, // Função para realizar login
    logout, // Função para realizar logout
  };

  // O AuthProvider envolve os componentes filhos e disponibiliza o 'contextValue' para eles
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Hook Personalizado para Consumir o Contexto
// Facilita o acesso aos valores do contexto em qualquer componente funcional
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    // Isso acontece se useAuth for chamado fora do AuthProvider, o que é um erro
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
/*import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api'; // Importa a instância configurada do Axios
import { useNavigate } from 'react-router-dom'; // Para redirecionar após login/logout

// 1. Criação do Contexto
// O valor inicial é null, será preenchido pelo AuthProvider
const AuthContext = createContext(null);

// 2. Componente Provedor de Autenticação
export const AuthProvider = ({ children }) => {
  // Estados para gerenciar o usuário, o status de carregamento e o token
  const [user, setUser] = useState(null); // Armazena os dados do usuário logado
  const [loading, setLoading] = useState(true); // Indica se a verificação inicial de autenticação está em andamento
  const navigate = useNavigate(); // Hook para navegação programática

  // Efeito para verificar o token no localStorage na inicialização da aplicação
  useEffect(() => {
    const loadUser = async () => {
      console.log('AuthContext: Iniciando loadUser...');
      const token = localStorage.getItem('authToken'); // Tenta obter o token do localStorage

      if (token === MOCK_TOKEN) {
        console.log('AuthContext: Token encontrado no localStorage.');
        setUser(MOCK_USER)
        try {
          // Opcional: Chamar uma rota do backend para validar o token e obter dados do usuário
          // Isso é mais seguro do que apenas decodificar o token no front-end, pois o backend pode invalidar o token
          // const response = await api.get('/auth/validate-token'); // Exemplo de rota de validação no backend
          // setUser(response.data.user); // Assumindo que a resposta traz os dados do usuário

          // Para testes iniciais, se não tiver a rota de validação no backend:
          // Você pode decodificar o token aqui (cuidado, JWTs são apenas codificados, não criptografados!)
          // ou simplesmente assumir que o token é válido e definir um usuário mock.
          // Para uma implementação real, a validação no backend é recomendada.
          setUser({ username: 'Usuário Teste', email: 'teste@example.com' }); // Dados mockados para simulação
          console.log('AuthContext: Usuário definido (mockado ou validado).');

        } catch (error) {
          console.error('AuthContext: Erro ao validar token ou carregar usuário:', error);
          localStorage.removeItem('authToken'); // Remove token inválido/expirado
          setUser(null); // Garante que o usuário não está logado
        }
      } else {
        console.log('AuthContext: Nenhum token encontrado no localStorage.');
        setUser(null); // Garante que o usuário não está logado
      }
      setLoading(false); // Finaliza o estado de carregamento
      console.log('AuthContext: loadUser finalizado. Loading:', false);
    };

    loadUser(); // Chama a função ao montar o componente
  }, []); // O array vazio garante que este efeito roda apenas uma vez (na montagem)

  // Função de Login
  const login = async (email, password) => {
    // ...
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('authToken', token);
      setUser(userData);
      console.log('AuthContext: Login bem-sucedido. Redirecionando para /');
      navigate('/'); // <--- ESTA LINHA FAZ O REDIRECIONAMENTO PARA O FEED
      return true;
    } catch (error) {
      // ...
      throw error; // É importante propagar o erro para o LoginPage poder exibi-lo
    }
  };

  // Função de Logout
  const logout = () => {
    console.log('AuthContext: Fazendo logout...');
    localStorage.removeItem('authToken'); // Remove o token
    setUser(null); // Limpa os dados do usuário
    navigate('/'); // Redireciona para a página de login
  };

  // Valor que será fornecido pelo contexto
  // isAuthenticated: é true se user não for nulo (!!user converte para booleano)
  const contextValue = {
    user,
    isAuthenticated: !!user,
    loading, // Necessário para o ProtectedRoute
    login,
    logout,
  };

  // O AuthProvider envolve os componentes filhos com o contexto
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
    // Isso acontece se useAuth for chamado fora do AuthProvider
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; */

// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
// import api from '../services/api.js'; // <-- COMENTE OU REMOVA ESTA LINHA PARA SIMULAÇÃO TEMPORÁRIA
import { useNavigate } from 'react-router-dom';

// 1. Criação do Contexto
const AuthContext = createContext(null);

// Dados do usuário "mock" (simulado)
const MOCK_USER = {
  id: 'user-simulado-123',
  username: 'usuarioSimulado',
  email: 'simulado@example.com',
  profilePicUrl: 'data:image/jpeg;base64,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',
  bio: 'Este é um usuário simulado para testes no frontend.',
  // Adicione outras propriedades que seu objeto de usuário terá
};

// Token "mock" (simulado)
const MOCK_TOKEN = 'mock_jwt_token_simulado_1234567890abcdef'; // Qualquer string serve

// 2. Componente Provedor de Autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Efeito para verificar o token no localStorage na inicialização da aplicação
  useEffect(() => {
    const loadUser = async () => {
      console.log('AuthContext: Iniciando loadUser (Simulado)...');
      const token = localStorage.getItem('authToken'); // Tenta obter o token do localStorage

      if (token === MOCK_TOKEN) { // <--- Verifica se é o nosso token mock
        console.log('AuthContext: Token SIMULADO encontrado no localStorage. Definindo usuário mock.');
        // Se o token mock for encontrado, assume que o usuário está logado
        setUser(MOCK_USER); // Define o usuário mock
      } else {
        console.log('AuthContext: Nenhum token mock encontrado ou token inválido. Usuário não logado.');
        setUser(null);
        localStorage.removeItem('authToken'); // Garante que nenhum token inválido/antigo fique por aí
      }
      setLoading(false); // Finaliza o estado de carregamento
      console.log('AuthContext: loadUser finalizado. Loading:', false);
    };

    loadUser();
  }, []);

  // Função de Login (SIMULADA)
  const login = async (email, password) => {
    console.log('AuthContext: Tentando fazer login (Simulado)...');
    // Você pode adicionar uma validação SIMPLES para fins de teste
    if (email === MOCK_USER.email && password === '123456') { // Senha fixa para o mock
      console.log('AuthContext: Login SIMULADO bem-sucedido. Definindo token e usuário mock.');
      localStorage.setItem('authToken', MOCK_TOKEN); // Salva o token mock
      setUser(MOCK_USER); // Define o usuário mock
      navigate('/'); // Redireciona para a página principal (FeedPage)
      return true;
    } else {
      console.log('AuthContext: Login SIMULADO falhou. Credenciais inválidas.');
      const error = new Error('Credenciais de login simuladas inválidas.');
      error.response = { data: { message: 'E-mail ou senha inválidos (simulado).' } }; // Simula resposta de erro do backend
      throw error; // Lança um erro para ser capturado pelo LoginPage
    }
  };

  // Função de Logout (Continua igual)
  const logout = () => {
    console.log('AuthContext: Fazendo logout...');
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login');
  };

  const contextValue = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Hook Personalizado para Consumir o Contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
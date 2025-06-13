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
import { MOCK_USER, MOCK_TOKEN } from '../mockData';

// 1. Criação do Contexto
const AuthContext = createContext(null);
// Qualquer string serve

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
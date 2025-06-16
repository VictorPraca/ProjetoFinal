import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api'; 
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const loadUser = async () => {
      console.log('AuthContext: Iniciando verificação de autenticação...');
      const token = localStorage.getItem('authToken');

      if (token) {
        console.log('AuthContext: Token encontrado no localStorage. Tentando validar no backend...');
        try {

          const response = await api.get('/api/auth/validate-token');
          setUser(response.data.user); 
          console.log('AuthContext: Token validado e usuário carregado:', response.data.user.username);
        } catch (error) {
          console.error('AuthContext: Erro ao validar token ou carregar usuário:', error.response?.data?.message || error.message);

          localStorage.removeItem('authToken');
          setUser(null);

        }
      } else {
        console.log('AuthContext: Nenhum token encontrado no localStorage. Usuário não logado.');
        setUser(null);
      }
      setLoading(false); 
      console.log('AuthContext: Verificação de autenticação finalizada. Loading:', false);
    };

    loadUser(); 
  }, []); 

  const login = async (email, password) => {
    console.log('AuthContext: Tentando fazer login com o backend...');
    try {

      const response = await api.post('/api/auth/login', { email, password });
      const { token, user: userData } = response.data; 

      localStorage.setItem('authToken', token); 
      setUser(userData);
      console.log('AuthContext: Login bem-sucedido. Redirecionando para / (Feed)');
      navigate('/'); 
      return true; 
    } catch (error) {
      console.error('AuthContext: Erro no login:', error.response?.data || error.message);

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
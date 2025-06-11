import React, { createContext, useState, useEffect, useContext } from 'react';
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

      if (token) {
        console.log('AuthContext: Token encontrado no localStorage.');
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
    console.log('AuthContext: Tentando fazer login...');
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data; // Assumindo que o backend retorna token e user

      localStorage.setItem('authToken', token); // Armazena o token
      setUser(userData); // Define os dados do usuário
      console.log('AuthContext: Login bem-sucedido. Redirecionando para /');
      navigate('/'); // Redireciona para a página principal (FeedPage)
      return true; // Indica sucesso no login
    } catch (error) {
      console.error('AuthContext: Erro na função login:', error.response?.data || error.message);
      // Propaga o erro para que o componente de login possa exibi-lo ao usuário
      throw error;
    }
  };

  // Função de Logout
  const logout = () => {
    console.log('AuthContext: Fazendo logout...');
    localStorage.removeItem('authToken'); // Remove o token
    setUser(null); // Limpa os dados do usuário
    navigate('/login'); // Redireciona para a página de login
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
};
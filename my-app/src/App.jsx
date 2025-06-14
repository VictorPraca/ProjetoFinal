// src/App.jsx (VERSÃO CORRETA)
import React from 'react';
import AppRoutes from './routes'; // Importe AppRoutes
import '/src/styles/global.css'

// Se você tiver um arquivo CSS global, pode importá-lo aqui
// import './styles/global.css'; 

function App() {
  return (
    <div className="App">
      {/* O App.jsx DEVE RENDERIZAR APENAS SEU SISTEMA DE ROTAS */}
      <AppRoutes /> 
    </div>
  );
}

export default App; // E App deve ser exportado como default
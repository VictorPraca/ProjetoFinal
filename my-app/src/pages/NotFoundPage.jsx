// src/pages/NotFoundPage.jsx
import React from 'react';

const NotFoundPage = () => { // Pode ser function NotFoundPage() também
  return (
    <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>
      <h1>404 - Página Não Encontrada</h1>
      <p>A página que você está procurando não existe.</p>
      {/* Opcional: <Link to="/">Voltar para o início</Link> */}
    </div>
  );
};

// *** ESSA LINHA É A CHAVE! ***
export default NotFoundPage;
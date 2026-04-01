import { useState, useEffect } from "react";
import Login from "./pages/Login"; // Ajuste se o seu Login estiver em /pages
import Index from "./pages/Index";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Checa se a chave existe na memória do navegador
    const isLogged = localStorage.getItem("rota40_auth");
    if (isLogged === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // Tela preta de carregamento para não piscar o layout
  if (isLoading) {
    return <div className="min-h-screen bg-[#0a0a0f]"></div>;
  }

  // Se não estiver logado, mostra a tela de Login
  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  // Se estiver logado, mostra a plataforma e passa a função de Sair
  return (
    <Index 
      onLogout={() => {
        localStorage.removeItem("rota40_auth");
        setIsAuthenticated(false);
      }} 
    />
  );
}
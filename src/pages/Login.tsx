import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, ArrowRight, Loader2, Mail } from "lucide-react";
import { supabase } from "@/lib/supabaseClient"; // 👈 Importando nosso banco!

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [isLogin, setIsLogin] = useState(true); // Controla se é Login ou Cadastro
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // ✂️ A MÁGICA AQUI: Criamos uma variável que já guarda o email sem os espaços
    const emailLimpo = email.trim(); 

    try {
      if (isLogin) {
        // 🟢 1. LÓGICA DE LOGIN (SIGN IN)
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailLimpo, // 👈 Usamos o email limpo aqui
          password: password,
        });

        if (error) throw error;

        // Vai no banco buscar o "Nome de Usuário" vinculado a esse ID
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', data.user.id)
          .single();
        
        localStorage.setItem("rota40_auth", "true");
        localStorage.setItem("rota40_username", profile?.username || "Estrategista");
        
        onLogin(); // Libera o acesso ao Dashboard!

      } else {
        // 🔵 2. LÓGICA DE CADASTRO (SIGN UP)
        const { data, error } = await supabase.auth.signUp({
          email: emailLimpo, // 👈 E usamos o email limpo aqui também!
          password: password,
        });

        if (error) throw error;

        // Se criou a credencial, agora cria o Perfil do cara na nossa tabela!
        if (data.user) {
          const { error: profileError } = await supabase.from('profiles').insert([
            { id: data.user.id, username: username, xp: 0, level: 1 }
          ]);
          
          if (profileError) throw profileError;
        }
        localStorage.removeItem("rota40_excel_progress");
        localStorage.removeItem("rota40_excel_modules");

        alert("Estrategista registrado com sucesso! Agora é só fazer o login.");
        setIsLogin(true); // Volta pra tela de login pra ele entrar
        setPassword(""); // Limpa a senha por segurança
      }
    } catch (error: any) {
      alert("Erro na matriz: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center p-4 font-['Inter',sans-serif]">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        className="glass-card w-full max-w-md p-8 relative z-10 border-purple-500/30 neon-glow-purple bg-[#13131a]/80 backdrop-blur-xl rounded-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header do Login */}
        <div className="flex flex-col items-center mb-8 text-center">
          <img 
            src="/rota-icon.png" 
            alt="Logo Rota 4.0" 
            className="w-32 h-32 object-contain mb-4 drop-shadow-[0_0_25px_rgba(168,85,247,0.6)]" 
          />
          <h1 className="text-3xl font-bold mb-2">Rota 4.0</h1>
          <p className="text-gray-400 text-sm">
            {isLogin ? "O seu GPS para o futuro do trabalho." : "Inicie sua jornada como Estrategista."}
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            
            {/* Input Email (Usado tanto no Login quanto Cadastro) */}
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
              <input 
                type="email" 
                required
                placeholder="Seu E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0a0a0f]/50 border border-purple-500/20 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
              />
            </div>

            <AnimatePresence>
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: "auto" }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="relative group overflow-hidden"
                >
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                  <input 
                    type="text" 
                    required={!isLogin}
                    placeholder="Nome de Usuário (Ex: Ygor)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#0a0a0f]/50 border border-purple-500/20 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Senha */}
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
              <input 
                type="password" 
                required
                placeholder="Senha (Mínimo 6 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0a0a0f]/50 border border-purple-500/20 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
              />
            </div>
          </div>

          {/* Botão de Submit */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-xl py-3.5 font-medium flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {isLogin ? "Entrar na Plataforma" : "Forjar Aliança (Criar Conta)"}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Alternar entre Login e Cadastro */}
        <div className="mt-6 text-center text-sm text-gray-400">
          {isLogin ? "Ainda não é um estrategista? " : "Já possui acesso à Rota? "}
          <button 
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setUsername(""); // Limpa os campos ao trocar
              setPassword("");
            }}
            className="text-purple-400 font-bold hover:text-purple-300 hover:underline transition-all"
          >
            {isLogin ? "Criar conta" : "Faça Login"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
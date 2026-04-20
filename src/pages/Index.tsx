import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Target, Headphones, Trophy, User, LogOut, UserPlus, X, Send } from "lucide-react";
import Dashboard from "@/components/Dashboard"; 
import Quests from "@/components/Quests";
import PodcastView from "@/components/PodcastView";
import Rankings from "@/components/Rankings";
import Profile from "@/components/Profile";
import { supabase } from '@/lib/supabaseClient';
import Avatar, { genConfig } from 'react-nice-avatar'; 

const navItems = [
  { id: "home", icon: Home, label: "Home" },
  { id: "quests", icon: Target, label: "Quests" },
  { id: "podcast", icon: Headphones, label: "Podcast" },
  { id: "rankings", icon: Trophy, label: "Rankings" },
  { id: "profile", icon: User, label: "Perfil" }, 
];

export default function Index({ onLogout }: { onLogout?: () => void }) {
  const [active, setActive] = useState("home");
  const [userName, setUserName] = useState("Carregando...");
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1); 
  const [avatarConfig, setAvatarConfig] = useState<any>(null); 
  const xpMax = 500;

  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);

  const refreshStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Pedimos todas as colunas que criamos no Supabase
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('username, xp, level, avatar_config, streak, last_active')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("ERRO NO SUPABASE:", error.message);
          setUserName("Conta não encontrada"); 
          return;
        }

        if (profile) {
          setUserName(profile.username || "Estrategista");
          setXp(profile.xp || 0);
          setLevel(profile.level || 1);
          
          if (profile.avatar_config && Object.keys(profile.avatar_config).length > 0) {
            setAvatarConfig(genConfig(profile.avatar_config));
          }

          // 🔥 LÓGICA DE OFENSIVAS 🔥
          const today = new Date().toLocaleDateString('en-CA'); 
          let currentStreak = profile.streak || 0;
          let lastActive = profile.last_active;

          if (lastActive !== today) {
            if (lastActive) {
              const d1 = new Date(lastActive + 'T00:00:00');
              const d2 = new Date(today + 'T00:00:00');
              const diffDays = Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));

              if (diffDays === 1) {
                currentStreak += 1; 
              } else if (diffDays > 1) {
                currentStreak = 1; 
              }
            } else {
              currentStreak = 1; 
            }

            await supabase
              .from('profiles')
              .update({ streak: currentStreak, last_active: today })
              .eq('id', user.id);
          }
        }
      }
    } catch (error) {
      console.error("Erro crítico ao buscar dados:", error);
    }
  };

  useEffect(() => {
    refreshStats();
  }, []);

  const handleContinueCourse = () => {
    localStorage.setItem("rota40_auto_open_excel", "true");
    setActive("quests");
  };

  const handleSair = async () => {
    await supabase.auth.signOut();
    localStorage.clear(); 
    if (onLogout) onLogout(); 
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0f] text-white">
      {/* Sidebar */}
      <motion.aside
        className="fixed left-0 top-0 bottom-0 w-20 glass-card rounded-none border-r border-t-0 border-b-0 border-l-0 flex flex-col items-center py-6 z-40"
        initial={{ x: -80 }} animate={{ x: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <img src="/rota-icon.png" alt="Logo Rota 4.0" className="w-16 h-16 object-contain mb-10 drop-shadow-[0_0_12px_rgba(168,85,247,0.6)] transition-transform duration-300 hover:scale-105 cursor-pointer" />
        <nav className="flex flex-col items-center gap-4 flex-1 w-full px-4">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActive(item.id)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${active === item.id ? "bg-primary/20 text-primary neon-glow-purple border border-primary/30" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
              title={item.label}>
              <item.icon className="w-5 h-5" />
            </button>
          ))}
        </nav>
        {onLogout && (
          <button onClick={handleSair} className="w-12 h-12 mt-auto mb-4 rounded-xl flex items-center justify-center text-muted-foreground hover:text-red-400 hover:bg-red-500/10 hover:border hover:border-red-500/20 transition-all" title="Sair da Plataforma">
            <LogOut className="w-5 h-5 ml-1" />
          </button>
        )}
      </motion.aside>

      <div className="flex-1 ml-20">
        {/* Header Sticky */}
        <motion.header
          className="sticky top-0 z-30 glass-card bg-[#13131a]/80 backdrop-blur-xl rounded-none border-x-0 border-t-0 px-6 py-4 flex items-center justify-between gap-4"
          initial={{ y: -60 }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          
          <div className="flex items-center gap-3">
            <div 
              onClick={() => setActive("profile")}
              className="flex items-center gap-3 cursor-pointer group hover:bg-white/5 p-2 -ml-2 rounded-xl transition-colors"
              title="Acessar Perfil"
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.2)] overflow-hidden">
                {avatarConfig ? (
                  <Avatar className="w-full h-full scale-110" {...avatarConfig} />
                ) : (
                  <User className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold leading-tight group-hover:text-primary transition-colors">{userName}</p>
                <p className="text-xs text-primary font-medium tracking-wide">Nível {level} Iniciante</p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsAddFriendOpen(true)}
              className="ml-2 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-primary hover:border-primary/50 hover:bg-primary/10 transition-all group"
              title="Adicionar Amigo"
            >
              <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          <div className="flex items-center gap-3 flex-1 max-w-sm">
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-green-400 font-mono font-semibold tracking-wider drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">{xp} XP</span>
                <span className="text-muted-foreground font-mono">{xpMax} XP</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#0a0a0f] border border-white/5 overflow-hidden">
                <motion.div 
                  className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.5)] relative"
                  initial={{ width: 0 }} animate={{ width: `${(xp / xpMax) * 100}%` }} transition={{ duration: 1, ease: "easeOut" }}>
                  <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 blur-[2px]" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.header>

        <AnimatePresence>
          {isAddFriendOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsAddFriendOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-md glass-card p-8 border-primary/30 shadow-[0_0_50px_rgba(168,85,247,0.2)]"
              >
                <button 
                  onClick={() => setIsAddFriendOpen(false)}
                  className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                    <UserPlus className="w-8 h-8 text-primary" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold tracking-tight">Expandir sua Rede</h3>
                    <p className="text-sm text-zinc-400">Insira o ID ou e-mail do estrategista para formar uma aliança.</p>
                  </div>

                  <div className="w-full space-y-4 pt-2">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Ex: #ESTRATEGA40"
                        className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                    
                    <button 
                      onClick={() => setIsAddFriendOpen(false)}
                      className="w-full bg-primary py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                    >
                      Enviar Convite <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <main className="p-6 pb-24 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3, ease: "easeOut" }}>
              {active === "home" && <Dashboard onContinue={handleContinueCourse} />}
              {active === "quests" && <Quests onXpGain={refreshStats} />}
              {active === "podcast" && <PodcastView />}
              {active === "rankings" && <Rankings />}
              {active === "profile" && <Profile onLogout={handleSair} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
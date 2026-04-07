import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Target, Headphones, Trophy, User, LogOut } from "lucide-react";
import Dashboard from "@/components/Dashboard";
import Quests from "@/components/Quests";
import PodcastView from "@/components/PodcastView";
import Rankings from "@/components/Rankings";

const navItems = [
  { id: "home", icon: Home, label: "Home" },
  { id: "quests", icon: Target, label: "Quests" },
  { id: "podcast", icon: Headphones, label: "Podcast" },
  { id: "rankings", icon: Trophy, label: "Rankings" },
];

const views: Record<string, React.FC> = {
  home: Dashboard,
  quests: Quests,
  podcast: PodcastView,
  rankings: Rankings,
};

// Definição da interface para as propriedades do componente
interface IndexProps {
  onLogout: () => void;
}

export default function Index({ onLogout }: IndexProps) {
  const [active, setActive] = useState("home");
  const View = views[active];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <motion.aside
        className="fixed left-0 top-0 bottom-0 w-20 glass-card rounded-none border-r border-t-0 border-b-0 border-l-0 flex flex-col items-center py-6 z-40"
        initial={{ x: -80 }} animate={{ x: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        
        {/* Logo */}
        <img src="/rota-icon.png" alt=""className="w-16 h-16 object-contain mb-10 drop-shadow-[0_0_12px_rgba(168,85,247,0.6)] transition-transform duration-300 hover:scale-110 cursor-pointer" />
        

        <nav className="flex flex-col items-center gap-4 flex-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActive(item.id)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                active === item.id
                  ? "bg-primary/20 text-primary neon-glow-purple"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              title={item.label}>
              <item.icon className="w-5 h-5" />
            </button>
          ))}
        </nav>

        {/* Botão de Logout adicionado no final da Sidebar */}
        <button 
          onClick={onLogout}
          className="w-12 h-12 rounded-xl flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all mt-auto mb-2"
          title="Sair"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </motion.aside>

      {/* Main */}
      <div className="flex-1 ml-20">
        {/* Header */}
        <motion.header
          className="sticky top-0 z-30 glass-card rounded-none border-x-0 border-t-0 px-6 py-3 flex items-center justify-between gap-4"
          initial={{ y: -60 }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">Rafael Silva</p>
              <p className="text-xs text-muted-foreground">Level 4 Strategist</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-1 max-w-xs">
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="neon-text-green font-mono">3,450 XP</span>
                <span className="text-muted-foreground">5,000</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full xp-bar-fill" style={{ width: "69%" }} />
              </div>
            </div>
          </div>
        </motion.header>

        {/* Content */}
        <main className="p-6">
          <AnimatePresence mode="wait">
            <motion.div key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}>
              <View />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
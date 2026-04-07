import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Timer, Crown } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

// NPCs da Leaderboard (Removi o seu usuário daqui, pois ele vai pro pódio dinamicamente)
const leaderboard = [
  { rank: 4, name: "Pedro Alves", xp: 120 },
  { rank: 5, name: "Maria Santos", xp: 100 },
  { rank: 6, name: "Lucas Neto", xp: 80 },
  { rank: 7, name: "Fernanda Lopes", xp: 60 },
  { rank: 8, name: "Bruno Tavares", xp: 40 },
  { rank: 9, name: "Camila Duarte", xp: 20 },
  { rank: 10, name: "João Vitor", xp: 10 },
];

const podiumHeight = [100, 140, 80];

export default function Rankings() {
  const [userName, setUserName] = useState("Você");
  const [userXp, setUserXp] = useState(0);

  // Lê a gaveta para pegar seu nome e o XP que você ganhou nas Quests
  useEffect(() => {
    const savedName = localStorage.getItem("rota40_username");
    const savedXp = localStorage.getItem("rota40_xp");
    if (savedName) setUserName(savedName);
    if (savedXp) setUserXp(Number(savedXp));
  }, []);

  // Gera as iniciais do seu Avatar (Ex: "Ygor" vira "YG")
  const getAvatar = (name: string) => name.substring(0, 2).toUpperCase();

  // Pódio Dinâmico: Carlos e Ana são NPCs, o Rank 3 é VOCÊ!
  const podium = [
    { rank: 2, name: "Ana Costa", xp: 250, avatar: "AC", isYou: false },
    { rank: 1, name: "Carlos Lima", xp: 350, avatar: "CL", isYou: false },
    { rank: 3, name: userName, xp: userXp, avatar: getAvatar(userName), isYou: true },
  ];

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <motion.div className="glass-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4 neon-glow-purple"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8 text-neon-gold" />
          <div>
            <h1 className="text-2xl font-bold">Liga de Iniciantes</h1>
            <p className="text-sm text-muted-foreground">Os 10 melhores avançam de liga</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-neon-orange font-mono text-sm">
          <Timer className="w-4 h-4" /> Faltam 2 dias
        </div>
      </motion.div>

      {/* Podium Dinâmico */}
      <div className="flex items-end justify-center gap-4 pt-8">
        {podium.map((p, i) => (
          <motion.div key={p.rank}
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.2, duration: 0.7, type: "spring" }}>
            
            {/* Avatar com destaque se for você */}
            <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-sm mb-2 ${
              p.isYou ? "bg-primary/20 text-primary ring-2 ring-primary/50 shadow-[0_0_15px_rgba(168,85,247,0.5)]" :
              p.rank === 1 ? "bg-neon-gold/20 text-neon-gold ring-2 ring-neon-gold/50" :
              "bg-muted text-muted-foreground ring-2 ring-muted-foreground/30"
            }`}>
              {p.avatar}
            </div>
            
            {p.rank === 1 && <Crown className="w-5 h-5 text-neon-gold -mt-1 mb-1" />}
            
            {/* Nome com destaque se for você */}
            <span className={`text-xs font-medium mb-1 ${p.isYou ? "text-primary font-bold" : ""}`}>
              {p.name} {p.isYou && "(Você)"}
            </span>
            
            <span className="text-xs text-muted-foreground font-mono">{p.xp.toLocaleString()} XP</span>
            
            <div className={`mt-2 w-20 rounded-t-lg ${
              p.isYou ? "bg-primary/20 border-t border-primary/50" :
              p.rank === 1 ? "bg-neon-gold/20" : 
              "bg-muted/60"
            }`} style={{ height: podiumHeight[i] }}>
              <div className="w-full h-full flex items-center justify-center text-2xl font-extrabold text-white/20">
                #{p.rank}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Leaderboard dos NPCs */}
      <div className="space-y-2 pt-4">
        {leaderboard.map((r, i) => (
          <motion.div key={r.rank}
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-30px" }} custom={i}
            className="glass-card p-4 flex items-center gap-4">
            <span className="text-lg font-bold w-8 text-center text-muted-foreground">
              #{r.rank}
            </span>
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
              {r.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div className="flex-1">
              <span className="font-medium text-sm">{r.name}</span>
            </div>
            <span className="text-sm font-mono neon-text-green">{r.xp.toLocaleString()} XP</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
import { motion } from "framer-motion";
import { Trophy, Timer, Crown } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const podium = [
  { rank: 2, name: "Ana Costa", xp: 8200, avatar: "AC" },
  { rank: 1, name: "Carlos Lima", xp: 9500, avatar: "CL" },
  { rank: 3, name: "Julia Reis", xp: 7800, avatar: "JR" },
];

const leaderboard = [
  { rank: 4, name: "Pedro Alves", xp: 7200 },
  { rank: 5, name: "Maria Santos", xp: 6900 },
  { rank: 6, name: "Lucas Neto", xp: 6450 },
  { rank: 7, name: "Rafael Silva", xp: 6100, isYou: true },
  { rank: 8, name: "Fernanda Lopes", xp: 5800 },
  { rank: 9, name: "Bruno Tavares", xp: 5500 },
  { rank: 10, name: "Camila Duarte", xp: 5100 },
];

const podiumHeight = [100, 140, 80];

export default function Rankings() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div className="glass-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4 neon-glow-purple"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8 text-neon-gold" />
          <div>
            <h1 className="text-2xl font-bold">Diamond League</h1>
            <p className="text-sm text-muted-foreground">Top 10 advance to Masters</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-neon-orange font-mono text-sm">
          <Timer className="w-4 h-4" /> 2 days left
        </div>
      </motion.div>

      {/* Podium */}
      <div className="flex items-end justify-center gap-4 pt-8">
        {podium.map((p, i) => (
          <motion.div key={p.rank}
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.2, duration: 0.7, type: "spring" }}>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-sm mb-2 ${
              p.rank === 1 ? "bg-neon-gold/20 text-neon-gold ring-2 ring-neon-gold/50" :
              p.rank === 2 ? "bg-muted text-muted-foreground ring-2 ring-muted-foreground/30" :
              "bg-neon-orange/20 text-neon-orange ring-2 ring-neon-orange/30"
            }`}>
              {p.avatar}
            </div>
            {p.rank === 1 && <Crown className="w-5 h-5 text-neon-gold -mt-1 mb-1" />}
            <span className="text-xs font-medium mb-1">{p.name}</span>
            <span className="text-xs text-muted-foreground font-mono">{p.xp.toLocaleString()} XP</span>
            <div className={`mt-2 w-20 rounded-t-lg ${
              p.rank === 1 ? "bg-neon-gold/20" : p.rank === 2 ? "bg-muted/60" : "bg-neon-orange/15"
            }`} style={{ height: podiumHeight[i] }}>
              <div className="w-full h-full flex items-center justify-center text-2xl font-extrabold text-muted-foreground/50">
                #{p.rank}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="space-y-2 pt-4">
        {leaderboard.map((r, i) => (
          <motion.div key={r.rank}
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-30px" }} custom={i}
            className={`glass-card p-4 flex items-center gap-4 ${r.isYou ? "border-primary/50 neon-glow-purple" : ""}`}>
            <span className={`text-lg font-bold w-8 text-center ${r.isYou ? "neon-text-purple" : "text-muted-foreground"}`}>
              #{r.rank}
            </span>
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
              {r.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div className="flex-1">
              <span className="font-medium text-sm">{r.name} {r.isYou && <span className="text-xs text-primary ml-1">(You)</span>}</span>
            </div>
            <span className="text-sm font-mono neon-text-green">{r.xp.toLocaleString()} XP</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

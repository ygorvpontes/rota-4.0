import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, Lock, Unlock, Zap, Code, Play } from "lucide-react";
import { supabase } from '@/lib/supabaseClient'; 

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

function CircularProgress({ percent }: { percent: number }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width="140" height="140" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r={r} fill="none" strokeWidth="8" className="progress-ring-bg" />
      <circle cx="60" cy="60" r={r} fill="none" strokeWidth="8" className="progress-ring-fill transition-all duration-1000"
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
        transform="rotate(-90 60 60)"
      />
      <text x="60" y="60" textAnchor="middle" dy="0.35em" className="fill-foreground text-2xl font-bold">{percent}%</text>
    </svg>
  );
}

const achievements = [
  { name: "Speed Demon", icon: Zap, unlocked: true },
  { name: "Code Master", icon: Code, unlocked: true },
  { name: "Night Owl", icon: Flame, unlocked: false },
  { name: "Team Player", icon: Unlock, unlocked: false },
];

export default function Dashboard({ onContinue }: { onContinue?: () => void }) {
  const [userName, setUserName] = useState("Carregando...");
  const [courseProgress, setCourseProgress] = useState(0);
  const [streak, setStreak] = useState(0); 

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Buscamos o progresso do Excel e a Ofensiva (streak) direto do Perfil
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, excel_progress, streak')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserName(profile.username || "Estrategista");
          setCourseProgress(profile.excel_progress || 0); 
          setStreak(profile.streak || 0); 
        }
      }
    } catch (error) {
      console.error("Erro ao carregar Dashboard:", error);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <motion.h1 className="text-3xl font-bold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        Bem-vindo(a), <span className="text-primary">{userName}</span>
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div className="glass-card p-6 lg:col-span-2 flex flex-col sm:flex-row items-center gap-6 neon-glow-purple"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
          
          <CircularProgress percent={courseProgress} />
          
          <div className="flex-1 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Missão Ativa</span>
            <h2 className="text-xl font-bold">Excel Básico</h2>
            <p className="text-sm text-muted-foreground">Aprenda a organizar dados, criar cálculos automatizados do zero e dominar as funções de atalho.</p>
            <button 
              onClick={onContinue}
              className="mt-2 px-5 py-2.5 rounded-lg bg-primary font-semibold text-sm text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Play className="w-4 h-4" /> Continuar Trilha
            </button>
          </div>
        </motion.div>

        {/* 🚀 O Foguinho de Ofensiva! */}
        <motion.div className="glass-card p-6 flex flex-col items-center justify-center gap-3"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
          <Flame className={`w-12 h-12 ${streak > 0 ? "text-neon-orange drop-shadow-[0_0_15px_rgba(251,146,60,0.5)]" : "text-zinc-600"}`} />
          <span className={`text-5xl font-extrabold ${streak > 0 ? "neon-text-orange" : "text-zinc-500"}`}>
            {streak}
          </span>
          <span className="text-sm text-muted-foreground font-medium uppercase tracking-widest text-center">Dias de Ofensiva 🔥</span>
        </motion.div>
      </div>

      <motion.h2 className="text-xl font-bold pt-4" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}>
        Conquistas
      </motion.h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {achievements.map((a, i) => (
          <motion.div key={a.name}
            className={`glass-card p-5 flex flex-col items-center gap-2 text-center ${!a.unlocked ? "opacity-40" : ""}`}
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i + 3}>
            {a.unlocked ? <a.icon className="w-8 h-8 text-neon-green" /> : <Lock className="w-8 h-8 text-muted-foreground" />}
            <span className="text-sm font-medium">{a.name}</span>
            <span className="text-xs text-muted-foreground">{a.unlocked ? "Desbloqueado" : "Bloqueado"}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
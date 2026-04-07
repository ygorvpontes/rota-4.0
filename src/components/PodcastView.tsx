import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, Headphones, Clock } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

// 1. Episódios atualizados para o catálogo Rota 4.0
const episodes = [
  { id: 1, title: "Ep. 7: Lógica e Automação na Prática", duration: "42 min", date: "Mar 1, 2026" },
  { id: 2, title: "Ep. 6: Dominando o Excel Básico", duration: "38 min", date: "Feb 22, 2026" },
  { id: 3, title: "Ep. 5: O Futuro do Trabalho (Tech Trends)", duration: "51 min", date: "Feb 15, 2026" },
  { id: 4, title: "Ep. 4: Python para Iniciantes", duration: "29 min", date: "Feb 8, 2026" },
  { id: 5, title: "Ep. 3: Soft Skills na Programação", duration: "45 min", date: "Feb 1, 2026" },
  { id: 6, title: "Ep. 2: Startups e Construção de MVP", duration: "33 min", date: "Jan 25, 2026" },
  { id: 7, title: "Ep. 1: Criando Dashboards de Sucesso", duration: "40 min", date: "Jan 18, 2026" },
];

function WaveformBars() {
  return (
    <div className="flex items-end gap-[3px] h-10">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div key={i}
          className="w-1 rounded-full bg-primary"
          animate={{ height: [8, 20 + Math.random() * 20, 8] }}
          transition={{ duration: 0.8 + Math.random() * 0.6, repeat: Infinity, repeatType: "reverse", delay: i * 0.05 }}
        />
      ))}
    </div>
  );
}

export default function PodcastView() {
  const [playing, setPlaying] = useState(false);
  const [currentEp, setCurrentEp] = useState(episodes[0]);

  return (
    <div className="space-y-6 pb-28">
      {/* Hero */}
      <motion.div className="glass-card overflow-hidden neon-glow-purple"
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }}>
        <div className="relative p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-primary to-neon-green flex items-center justify-center shrink-0">
            <Headphones className="w-16 h-16 text-primary-foreground" />
          </div>
          <div className="space-y-3 text-center sm:text-left">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Em Destaque</span>
            <h2 className="text-2xl font-bold">{currentEp.title}</h2>
            <p className="text-sm text-muted-foreground">Insights, estratégias e visão de mercado com líderes da área Tech.</p>
            {playing && <WaveformBars />}
            <button onClick={() => setPlaying(!playing)}
              className="mt-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2">
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {playing ? "Pausar" : "Ouvir Agora"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Episode List */}
      <h2 className="text-xl font-bold">Todos os Episódios</h2>
      <div className="space-y-3">
        {episodes.map((ep, i) => (
          <motion.div key={ep.id}
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} custom={i}
            onClick={() => { setCurrentEp(ep); setPlaying(true); }}
            className={`glass-card p-4 flex items-center gap-4 cursor-pointer hover:border-primary/40 transition-colors ${
              currentEp.id === ep.id ? "border-primary/50 neon-glow-purple" : ""
            }`}>
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
              {currentEp.id === ep.id && playing ? (
                <Pause className="w-4 h-4 text-primary" />
              ) : (
                <Play className="w-4 h-4 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{ep.title}</h3>
              <span className="text-xs text-muted-foreground">{ep.date}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <Clock className="w-3 h-3" /> {ep.duration}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sticky Player */}
      <motion.div className="fixed bottom-0 left-0 sm:left-20 right-0 glass-card border-t border-primary/30 p-3 flex items-center gap-4 z-50"
        initial={{ y: 80 }} animate={{ y: 0 }} transition={{ delay: 0.5, type: "spring", stiffness: 200 }}>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{currentEp.title}</p>
          <p className="text-xs text-muted-foreground">{currentEp.duration}</p>
        </div>
        <div className="flex items-center gap-3">
          <SkipBack className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
          <button onClick={() => setPlaying(!playing)}
            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:opacity-90 transition-opacity">
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <SkipForward className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
        </div>
        <div className="hidden sm:block w-40">
          <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div className="h-full rounded-full xp-bar-fill"
              animate={playing ? { width: ["20%", "100%"] } : {}}
              transition={{ duration: 30, ease: "linear" }}
              style={{ width: "20%" }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
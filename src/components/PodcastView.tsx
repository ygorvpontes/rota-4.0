import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, Headphones, Clock } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } }),
};

const episodes = [
  { id: 1, title: "Ep. 7: Lógica e Automação na Prática", duration: "42 min", date: "Mar 1, 2026" },
  { id: 2, title: "Ep. 6: Dominando o Excel Básico", duration: "38 min", date: "Feb 22, 2026" },
  { id: 3, title: "Ep. 5: O Futuro do Trabalho", duration: "51 min", date: "Feb 15, 2026" },
  { id: 4, title: "Ep. 4: Python para Iniciantes", duration: "29 min", date: "Feb 8, 2026" },
];

function WaveformBars() {
  return (
    <div className="flex items-end gap-[3px] h-10">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div key={i} className="w-1 rounded-full bg-primary"
          animate={{ height: [8, 15 + Math.random() * 15, 8] }}
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
    <div className="space-y-6 pb-32">
      <motion.div className="glass-card overflow-hidden neon-glow-purple" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }}>
        <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-gradient-to-br from-primary to-neon-green flex items-center justify-center shrink-0">
            <Headphones className="w-12 h-12 md:w-16 md:h-16 text-primary-foreground" />
          </div>
          <div className="space-y-3 text-center md:text-left w-full">
            <span className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-muted-foreground">Em Destaque</span>
            <h2 className="text-xl md:text-2xl font-bold">{currentEp.title}</h2>
            <p className="text-xs md:text-sm text-muted-foreground">Insights, estratégias e visão de mercado com líderes da área Tech.</p>
            {playing && <div className="flex justify-center md:justify-start"><WaveformBars /></div>}
            <button onClick={() => setPlaying(!playing)}
              className="mt-2 w-full md:w-auto px-6 py-3 md:py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2">
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {playing ? "Pausar" : "Ouvir Agora"}
            </button>
          </div>
        </div>
      </motion.div>

      <h2 className="text-lg md:text-xl font-bold px-1">Todos os Episódios</h2>
      <div className="space-y-3">
        {episodes.map((ep, i) => (
          <motion.div key={ep.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
            onClick={() => { setCurrentEp(ep); setPlaying(true); }}
            className={`glass-card p-3 md:p-4 flex items-center gap-3 md:gap-4 cursor-pointer hover:border-primary/40 transition-colors ${currentEp.id === ep.id ? "border-primary/50 neon-glow-purple" : ""}`}>
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
              {currentEp.id === ep.id && playing ? <Pause className="w-4 h-4 text-primary" /> : <Play className="w-4 h-4 text-primary" />}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{ep.title}</h3>
              <span className="text-[10px] md:text-xs text-muted-foreground block truncate">{ep.date}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] md:text-xs text-muted-foreground shrink-0">
              <Clock className="w-3 h-3 hidden md:block" /> {ep.duration}
            </div>
          </motion.div>
        ))}
      </div>

      {/* O SEGREDO ESTÁ AQUI: bottom-16 no mobile e left-[5.5rem] no PC */}
      <motion.div className="fixed bottom-16 md:bottom-4 left-0 md:left-[5.5rem] right-0 md:right-4 glass-card border-t md:border border-primary/30 p-3 md:p-4 flex items-center gap-3 md:gap-4 z-[40] md:rounded-2xl bg-[#0a0a0f]/95 backdrop-blur-xl"
        initial={{ y: 100 }} animate={{ y: 0 }} transition={{ delay: 0.5, type: "spring", stiffness: 200 }}>
        <div className="flex-1 min-w-0">
          <p className="text-xs md:text-sm font-bold truncate text-white">{currentEp.title}</p>
          <p className="text-[10px] md:text-xs text-muted-foreground truncate">{currentEp.duration}</p>
        </div>
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          <SkipBack className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground cursor-pointer hover:text-white transition-colors" />
          <button onClick={() => setPlaying(!playing)}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:scale-105 transition-transform shadow-lg shadow-primary/30">
            {playing ? <Pause className="w-4 h-4 md:w-5 md:h-5" /> : <Play className="w-4 h-4 md:w-5 md:h-5 ml-1" />}
          </button>
          <SkipForward className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground cursor-pointer hover:text-white transition-colors" />
        </div>
      </motion.div>
    </div>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Star, ChevronRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const courses = [
  { id: 1, title: "Fullstack Python", progress: 65, xp: 500, status: "progress", tag: "Dev" },
  { id: 2, title: "Advanced AI", progress: 0, xp: 800, status: "locked", tag: "Dev" },
  { id: 3, title: "Excel Basics", progress: 100, xp: 300, status: "completed", tag: "Design" },
  { id: 4, title: "UI/UX Principles", progress: 30, xp: 450, status: "progress", tag: "Design" },
];

const filters = ["All", "Dev", "Design"];

const skillNodes = ["HTML", "CSS", "JS", "React", "Node", "DB"];

export default function Quests() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? courses : courses.filter(c => c.tag === filter);

  return (
    <div className="space-y-6">
      <motion.h1 className="text-3xl font-bold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        Active Quest Lines
      </motion.h1>

      <div className="flex gap-2">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === f ? "bg-primary text-primary-foreground neon-glow-purple" : "glass-card text-muted-foreground hover:text-foreground"
            }`}>
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((c, i) => (
          <motion.div key={c.id}
            className={`glass-card p-5 space-y-3 ${c.status === "completed" ? "gold-border border" : ""} ${c.status === "locked" ? "opacity-50" : ""}`}
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}>
            <div className="flex justify-between items-start">
              <h3 className="font-bold">{c.title}</h3>
              {c.status === "locked" && <Lock className="w-5 h-5 text-muted-foreground" />}
              {c.status === "completed" && (
                <div className="flex gap-0.5">{[1, 2, 3].map(s => <Star key={s} className="w-4 h-4 fill-neon-gold text-neon-gold" />)}</div>
              )}
            </div>

            {c.status !== "locked" && (
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full ${c.status === "completed" ? "bg-neon-gold" : "xp-bar-fill"}`}
                  style={{ width: `${c.progress}%` }} />
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-xs font-mono neon-text-green">+{c.xp} XP</span>
              {c.status === "progress" && (
                <button className="text-xs px-3 py-1 rounded-md bg-primary text-primary-foreground font-semibold">
                  Continue <ChevronRight className="inline w-3 h-3" />
                </button>
              )}
              {c.status === "completed" && (
                <span className="text-xs px-3 py-1 rounded-md bg-neon-gold/20 text-neon-gold font-semibold">Completed</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Skill Tree */}
      <motion.div className="glass-card p-6 mt-8" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={5}>
        <h2 className="text-lg font-bold mb-4">Skill Tree Progress</h2>
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {skillNodes.map((node, i) => (
            <div key={node} className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                i < 4 ? "bg-primary text-primary-foreground neon-glow-purple" : "bg-muted text-muted-foreground"
              }`}>
                {node}
              </div>
              {i < skillNodes.length - 1 && (
                <div className={`w-8 h-0.5 ${i < 3 ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

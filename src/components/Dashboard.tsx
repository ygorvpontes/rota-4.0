import { motion } from "framer-motion";
import { Flame, Lock, Unlock, Zap, Code, Play } from "lucide-react";

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
      <circle cx="60" cy="60" r={r} fill="none" strokeWidth="8" className="progress-ring-fill"
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

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <motion.h1 className="text-3xl font-bold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        Command Center
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Mission */}
        <motion.div className="glass-card p-6 lg:col-span-2 flex flex-col sm:flex-row items-center gap-6 neon-glow-purple"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
          <CircularProgress percent={75} />
          <div className="flex-1 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Active Mission</span>
            <h2 className="text-xl font-bold">JavaScript Fundamentals</h2>
            <p className="text-sm text-muted-foreground">Master closures, promises, and async patterns to unlock the next quest line.</p>
            <button className="mt-2 px-5 py-2.5 rounded-lg bg-primary font-semibold text-sm text-primary-foreground hover:opacity-90 transition-opacity">
              <Play className="inline w-4 h-4 mr-1 -mt-0.5" /> Resume Class
            </button>
          </div>
        </motion.div>

        {/* Streak */}
        <motion.div className="glass-card p-6 flex flex-col items-center justify-center gap-3"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
          <Flame className="w-12 h-12 text-neon-orange" />
          <span className="text-4xl font-extrabold neon-text-orange">14</span>
          <span className="text-sm text-muted-foreground">Day Streak 🔥</span>
        </motion.div>
      </div>

      {/* Achievements */}
      <motion.h2 className="text-xl font-bold pt-4" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}>
        Achievements
      </motion.h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {achievements.map((a, i) => (
          <motion.div key={a.name}
            className={`glass-card p-5 flex flex-col items-center gap-2 text-center ${!a.unlocked ? "opacity-40" : ""}`}
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i + 3}>
            {a.unlocked ? <a.icon className="w-8 h-8 text-neon-green" /> : <Lock className="w-8 h-8 text-muted-foreground" />}
            <span className="text-sm font-medium">{a.name}</span>
            <span className="text-xs text-muted-foreground">{a.unlocked ? "Unlocked" : "Locked"}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

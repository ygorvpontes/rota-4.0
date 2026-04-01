import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ChevronRight, ArrowLeft, Book, CheckCircle2, FileText } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

// Conteúdo apenas do Excel
const courseDatabase = {
  1: { // ID do Excel
    description: "Aprenda a organizar dados e criar cálculos automatizados do zero.",
    modules: [
      { title: "O que é uma Célula?", content: "A célula é a unidade básica do Excel. É o encontro de uma Coluna (Letra) com uma Linha (Número), como A1 ou B5." },
      { title: "Operações Matemáticas", content: "Sempre comece com '='. Para somar valores, use a lógica simples: =10+20 ou referencie células: =A1+B1." },
      { title: "Funções de Atalho", content: "A função =SOMA(A1:A10) permite somar um intervalo inteiro rapidamente sem fórmulas complexas." },
    ]
  }
};

const initialCourses = [
  { id: 1, title: "Excel Básico", progress: 100, xp: 300, status: "completed", tag: "Design" },
  { id: 2, title: "Microsoft Word", progress: 0, xp: 250, status: "locked", tag: "Design", comingSoon: true },
];

export default function Quests() {
  const [activeCourse, setActiveCourse] = useState<any>(null);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-6 font-sans">
      <AnimatePresence mode="wait">
        {!activeCourse ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto space-y-8">
            <header className="space-y-2">
              <h1 className="text-4xl font-black italic tracking-tighter uppercase">Quest Lines</h1>
              <p className="text-zinc-500 text-sm font-medium">Selecione um módulo para iniciar sua jornada de aprendizado.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {initialCourses.map((c, i) => (
                <motion.div key={c.id}
                  className={`glass-card p-6 space-y-4 relative overflow-hidden transition-all duration-300 ${c.status === "locked" ? "grayscale opacity-50" : "hover:border-primary/50"}`}
                  variants={fadeUp} initial="hidden" animate="visible" custom={i}>
                  
                  {c.comingSoon && (
                    <div className="absolute top-3 right-3 bg-zinc-800 text-[10px] px-2 py-0.5 rounded text-zinc-400 font-bold border border-zinc-700">
                      EM BREVE
                    </div>
                  )}

                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-primary mb-1 block">{c.tag}</span>
                      <h3 className="font-bold text-xl">{c.title}</h3>
                    </div>
                    {c.status === "locked" ? <Lock className="w-5 h-5 text-zinc-500" /> : <Book className="w-5 h-5 text-primary" />}
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${c.status === "completed" ? "bg-primary" : "xp-bar-fill"}`}
                      style={{ width: `${c.progress}%` }} />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs font-mono neon-text-green">+{c.xp} XP</span>
                    {c.status !== "locked" ? (
                      <button 
                        onClick={() => setActiveCourse(c)}
                        className="text-xs px-4 py-2 rounded bg-primary text-primary-foreground font-bold hover:scale-105 transition-transform flex items-center gap-1">
                        Acessar Conteúdo <ChevronRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 text-zinc-600 text-[10px] font-bold uppercase">
                        Bloqueado
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* ABA DE IDENTIFICAÇÃO DO CURSO */
          <motion.div key="content" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <button onClick={() => setActiveCourse(null)} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
                <span className="text-sm font-bold uppercase tracking-wider">Voltar</span>
              </button>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-white">{activeCourse.title}</h2>
                <p className="text-primary text-[10px] font-mono uppercase tracking-[0.2em]">Módulo Ativo: {activeCourse.id}</p>
              </div>
            </div>

            <div className="glass-card p-8 border-t-2 border-primary/30 min-h-[400px]">
              <div className="space-y-8">
                <div className="flex gap-4 items-start bg-primary/5 p-4 rounded-lg border border-primary/10">
                  <FileText className="text-primary shrink-0 w-6 h-6" />
                  <p className="text-zinc-300 leading-relaxed italic">
                    {courseDatabase[activeCourse.id as keyof typeof courseDatabase]?.description}
                  </p>
                </div>

                <div className="space-y-6">
                  {courseDatabase[activeCourse.id as keyof typeof courseDatabase]?.modules.map((mod, idx) => (
                    <div key={idx} className="p-6 rounded-xl border border-white/5 bg-white/5">
                      <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-3">
                        <span className="w-6 h-6 rounded bg-primary/20 text-primary text-xs flex items-center justify-center font-mono">0{idx + 1}</span>
                        {mod.title}
                      </h4>
                      <p className="text-zinc-400 pl-9 leading-relaxed">
                        {mod.content}
                      </p>
                    </div>
                  ))}
                </div>

                <button onClick={() => setActiveCourse(null)} className="w-full py-4 bg-primary text-white font-black rounded-xl neon-glow-purple mt-6 hover:brightness-110 transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                  Concluir Leitura <CheckCircle2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
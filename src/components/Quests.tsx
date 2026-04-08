import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ChevronRight, ArrowLeft, Book, CheckCircle2, FileText, PlayCircle, Copyright } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
};

const courseDatabase = {
  1: { 
    description: "Nesta primeira aula, vamos entender a estrutura principal da ferramenta e como organizar dados de forma inteligente para automações futuras. Você aprenderá a navegar pelas células, formatar planilhas e preparar o terreno para funções avançadas.",
    videos: [
      "/video_exel.mp4",      // Vídeo da Aula 1
      "/video_exel2.mp4",     // Vídeo da Aula 2 (adicione o arquivo na pasta public)
      "/video_aula3.mp4",     // Vídeo da Aula 3
    ],
    modules: [
      { title: "O que é uma Célula?", duration: "05:20" },
      { title: "Operações Matemáticas", duration: "12:15" },
      { title: "Funções de Atalho", duration: "08:45" },
    ]
  }
};

const initialCourses = [
  { id: 1, title: "Excel Básico", progress: 0, xp: 300, status: "completed", tag: "Planilhas" },
  { id: 2, title: "Microsoft Word", progress: 0, xp: 250, status: "locked", tag: "Documentos", comingSoon: true },
];

export default function Quests({ onXpGain }: { onXpGain?: () => void }) {
  const [activeCourse, setActiveCourse] = useState<any>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  
  const [excelProgress, setExcelProgress] = useState(0);
  const [completedModules, setCompletedModules] = useState(0);

  const loadProgress = () => {
    const savedProg = Number(localStorage.getItem("rota40_excel_progress") || 0);
    const savedMods = Number(localStorage.getItem("rota40_excel_modules") || 0);
    setExcelProgress(savedProg);
    setCompletedModules(savedMods);
  };

  useEffect(() => {
    loadProgress();
    
    const shouldOpenExcel = localStorage.getItem("rota40_auto_open_excel");
    if (shouldOpenExcel === "true") {
      setActiveCourse(initialCourses[0]);
      localStorage.removeItem("rota40_auto_open_excel");
    }
  }, []);

  const handleCompleteLesson = () => {
    const currentXp = Number(localStorage.getItem("rota40_xp") || 0);
    localStorage.setItem("rota40_xp", (currentXp + 50).toString());
    if (onXpGain) onXpGain();

    if (completedModules < 3) {
      const newMods = completedModules + 1;
      localStorage.setItem("rota40_excel_modules", newMods.toString());
      
      const newProg = Math.round((newMods / 3) * 100);
      localStorage.setItem("rota40_excel_progress", newProg.toString());
    }

    loadProgress();
    setActiveCourse(null);
    setCurrentVideoIndex(0); 
  };

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
                <motion.div key={c.id} className={`glass-card p-6 space-y-4 relative overflow-hidden transition-all duration-300 ${c.status === "locked" ? "grayscale opacity-50" : "hover:border-primary/50"}`} variants={fadeUp} initial="hidden" animate="visible" custom={i}>
                  {c.comingSoon && <div className="absolute top-3 right-3 bg-zinc-800 text-[10px] px-2 py-0.5 rounded text-zinc-400 font-bold border border-zinc-700">EM BREVE</div>}
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-primary mb-1 block">{c.tag}</span>
                      <h3 className="font-bold text-xl">{c.title}</h3>
                    </div>
                    {c.status === "locked" ? <Lock className="w-5 h-5 text-zinc-500" /> : <Book className="w-5 h-5 text-primary" />}
                  </div>
                  
                  <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${c.id === 1 && excelProgress === 100 ? "bg-primary" : "xp-bar-fill"}`} style={{ width: `${c.id === 1 ? excelProgress : c.progress}%` }} />
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs font-mono neon-text-green">+{c.xp} XP Máx</span>
                    {c.status !== "locked" ? (
                      <button onClick={() => setActiveCourse(c)} className="text-xs px-4 py-2 rounded bg-primary text-primary-foreground font-bold hover:scale-105 transition-transform flex items-center gap-1">
                        Acessar Conteúdo <ChevronRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 text-zinc-600 text-[10px] font-bold uppercase">Bloqueado</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <button onClick={() => { setActiveCourse(null); loadProgress(); setCurrentVideoIndex(0); }} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
                <span className="text-sm font-bold uppercase tracking-wider">Voltar às Quests</span>
              </button>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-white">{activeCourse.title}</h2>
                <p className="text-primary text-[10px] font-mono uppercase tracking-[0.2em]">Módulo Ativo: {activeCourse.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(168,85,247,0.15)] relative group">
                  <video 
                    key={currentVideoIndex}
                    controls 
                    autoPlay
                    className="w-full h-full object-cover" 
                    src={courseDatabase[activeCourse.id as keyof typeof courseDatabase]?.videos[currentVideoIndex]}
                  >
                    Seu navegador não suporta vídeos.
                  </video>
                </div>
                <div className="glass-card p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
                    <FileText className="text-primary w-6 h-6" />
                    <h3 className="text-xl font-bold">Material de Apoio</h3>
                  </div>
                  <p className="text-zinc-300 leading-relaxed text-sm md:text-base">{courseDatabase[activeCourse.id as keyof typeof courseDatabase]?.description}</p>
                  
                  {/* ADIÇÃO: CRÉDITOS E DIREITOS AUTORAIS */}
                  <div className="mt-8 pt-6 border-t border-white/5 flex items-start gap-2 opacity-50">
                    <Copyright className="w-3 h-3 text-zinc-500 mt-1 shrink-0" />
                    <p className="text-[10px] text-zinc-500 italic leading-relaxed">
                      Conteúdo educativo disponibilizado para fins de estudo acadêmico. Direitos de imagem e vídeo reservados aos autores originais (Ensina Frain e parceiros). Uso sem fins lucrativos.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="glass-card p-6 sticky top-28">
                  <h3 className="font-bold text-lg mb-4 flex items-center justify-between">
                    Conteúdo do Curso
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded font-mono">{completedModules}/3</span>
                  </h3>
                  <div className="space-y-3 mb-8">
                    {courseDatabase[activeCourse.id as keyof typeof courseDatabase]?.modules.map((mod, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setCurrentVideoIndex(idx)}
                        className={`p-4 rounded-xl border transition-colors cursor-pointer group flex items-start gap-3 ${
                          currentVideoIndex === idx 
                          ? "border-primary bg-primary/20" 
                          : idx < completedModules 
                            ? "border-primary/50 bg-primary/10" 
                            : "border-white/5 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        {idx < completedModules ? (
                           <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
                        ) : (
                           <PlayCircle className={`w-5 h-5 shrink-0 mt-0.5 ${idx === currentVideoIndex ? "text-primary" : "text-zinc-600 group-hover:text-zinc-400"}`} />
                        )}
                        <div>
                          <h4 className={`text-sm font-bold ${idx <= completedModules || idx === currentVideoIndex ? "text-white" : "text-zinc-400 group-hover:text-white"} transition-colors`}>{idx + 1}. {mod.title}</h4>
                          <p className="text-xs text-zinc-500 font-mono mt-1">{mod.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {completedModules < 3 ? (
                    <button onClick={handleCompleteLesson} className="w-full py-3.5 bg-primary text-white font-bold rounded-xl neon-glow-purple hover:brightness-110 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm">
                      <CheckCircle2 className="w-5 h-5" /> Concluir Etapa (+50 XP)
                    </button>
                  ) : (
                    <button onClick={() => { setActiveCourse(null); setCurrentVideoIndex(0); }} className="w-full py-3.5 bg-green-500/20 text-green-400 border border-green-500/50 font-bold rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm">
                      <CheckCircle2 className="w-5 h-5" /> Curso Concluído
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
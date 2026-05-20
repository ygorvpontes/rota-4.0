import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ChevronRight, ArrowLeft, Book, CheckCircle2, FileText, PlayCircle, Copyright, ExternalLink, ImageIcon, Trophy } from "lucide-react";
import { supabase } from '@/lib/supabaseClient';
import { CommentSection } from "./CommentSection"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
};

const courseDatabase = {
  1: { 
    description: "Nesta primeira aula, vamos entender a estrutura principal da ferramenta e como organizar dados de forma inteligente para automações futuras. Você aprenderá a navegar pelas células, formatar planilhas e preparar o terreno para funções avançadas.",
    videos: [
      "/video_exel.mp4",
      "/video_exel2.mp4",
      "/video_exel3.mp4",
    ],
    modules: [
      { title: "O que é uma Célula?", duration: "05:20" },
      { title: "Operações Matemáticas", duration: "12:15" },
      { title: "Funções de Atalho", duration: "08:45" },
    ],
    link: null
  },
  2: { 
    description: "Aprenda a administrar seu dinheiro com inteligência. A educação financeira está relacionada ao desenvolvimento de hábitos que auxiliam na administração do dinheiro. O objetivo é promover maior organization, planejamento e consciência nas decisões financeiras. Entenda para onde vai seu dinheiro, evitando compras por impulso, e utilize recursos que auxiliam no controle financeiro diário.",
    videos: [
      "/financeiro.mp4", // Módulo 1: Vídeo Local
      "/financeiroimg1.png", // Módulo 2: Imagem
      "https://www.youtube.com/embed/CB5zuxQl5ro", // Módulo 3: Vídeo do YouTube
      "/conclusao.png" // Módulo 4: Imagem de Finalização
    ],
    modules: [
      { title: "Introdução à Educação Financeira", duration: "09:28" },
      { title: "A Riqueza na Prática (Quadrinhos)", duration: "Leitura" },
      { title: "Estratégias Avançadas (Vídeo)", duration: "07:15" },
      { title: "Missão Cumprida!", duration: "Recompensa" },
    ],
    link: "https://www.canva.com/design/DAHJ-sJGZYw/ukKKOXcnbhB0Tpo0OkB5-A/view" 
  }
};

const initialCourses = [
  { id: 1, title: "Excel Básico", progress: 0, xp: 300, status: "completed", tag: "Planilhas" },
  { id: 2, title: "Educação Financeira", progress: 0, xp: 400, status: "available", tag: "Finanças" },
  { id: 3, title: "Microsoft Word", progress: 0, xp: 250, status: "locked", tag: "Documentos", comingSoon: true },
];

export default function Quests({ onXpGain }: { onXpGain?: () => void }) {
  const [activeCourse, setActiveCourse] = useState<any>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  
  // Estados de progresso
  const [excelProgress, setExcelProgress] = useState(0);
  const [excelModules, setExcelModules] = useState(0);
  const [financeProgress, setFinanceProgress] = useState(0);
  const [financeModules, setFinanceModules] = useState(0);

  const loadProgress = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('excel_progress, excel_modules, finance_progress, finance_modules')
        .eq('id', user.id)
        .single();

      if (data) {
        setExcelProgress(data.excel_progress || 0);
        setExcelModules(data.excel_modules || 0);
        setFinanceProgress(data.finance_progress || 0);
        setFinanceModules(data.finance_modules || 0);
      }
    }
  };

  useEffect(() => {
    loadProgress();
  }, []);

  const getActiveProgress = () => activeCourse?.id === 1 ? excelProgress : financeProgress;
  const getActiveModules = () => activeCourse?.id === 1 ? excelModules : financeModules;

  const handleCompleteLesson = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user && activeCourse) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          const novoXp = (profile.xp || 0) + 50;
          let novoLevel = profile.level || 1;
          
          if (novoXp >= novoLevel * 500) {
            novoLevel += 1;
          }

          let updateData: any = { xp: novoXp, level: novoLevel };
          
          const totalMods = courseDatabase[activeCourse.id as keyof typeof courseDatabase]?.modules.length || 1;

          if (activeCourse.id === 1) {
            let newMods = (profile.excel_modules || 0) + 1;
            if (newMods <= totalMods) {
              updateData.excel_modules = newMods;
              updateData.excel_progress = Math.round((newMods / totalMods) * 100);
              setExcelModules(updateData.excel_modules);
              setExcelProgress(updateData.excel_progress);
            }
          } else if (activeCourse.id === 2) {
            let newMods = (profile.finance_modules || 0) + 1;
            if (newMods <= totalMods) {
              updateData.finance_modules = newMods;
              updateData.finance_progress = Math.round((newMods / totalMods) * 100);
              setFinanceModules(updateData.finance_modules);
              setFinanceProgress(updateData.finance_progress);
            }
          }

          await supabase.from('profiles').update(updateData).eq('id', user.id);
        }
      }
    } catch (error) {
      console.error("Erro ao salvar progresso:", error);
    }

    if (onXpGain) onXpGain();

    setActiveCourse(null);
    setCurrentVideoIndex(0); 
  };

  const currentMedia = activeCourse ? courseDatabase[activeCourse.id as keyof typeof courseDatabase]?.videos[currentVideoIndex] : null;
  const isImage = currentMedia?.includes("img") || currentMedia?.includes("conclusao") || currentMedia?.match(/\.(jpeg|jpg|gif|png)$/i);
  const isCanva = currentMedia?.includes("canva.com");
  const isYouTube = currentMedia?.includes("youtube.com");
  
  const totalCourseModules = activeCourse ? courseDatabase[activeCourse.id as keyof typeof courseDatabase]?.modules.length : 0;

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
              {initialCourses.map((c, i) => {
                const prog = c.id === 1 ? excelProgress : (c.id === 2 ? financeProgress : c.progress);
                return (
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
                      <div className={`h-full rounded-full transition-all duration-1000 ${prog === 100 ? "bg-primary" : "xp-bar-fill"}`} style={{ width: `${prog}%` }} />
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
                );
              })}
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
                
                <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(168,85,247,0.15)] relative group flex items-center justify-center">
                  
                  {isYouTube ? (
                    <iframe
                      className="w-full h-full object-cover"
                      src={currentMedia}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : isCanva ? (
                    <iframe
                      loading="lazy"
                      className="w-full h-full absolute top-0 left-0 border-none"
                      src={currentMedia}
                      allowFullScreen
                      allow="fullscreen"
                    ></iframe>
                  ) : isImage ? (
                    <img 
                      src={currentMedia} 
                      alt="Material da Aula" 
                      className="w-full h-full object-contain bg-[#12121a]" 
                    />
                  ) : (
                    <video 
                      key={currentVideoIndex}
                      controls 
                      autoPlay
                      className="w-full h-full object-cover" 
                      src={currentMedia}
                    >
                      Seu navegador não suporta vídeos.
                    </video>
                  )}
                </div>
                
                <div className="glass-card p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
                    <FileText className="text-primary w-6 h-6" />
                    <h3 className="text-xl font-bold">Material de Apoio</h3>
                  </div>
                  <p className="text-zinc-300 leading-relaxed text-sm md:text-base">
                    {courseDatabase[activeCourse.id as keyof typeof courseDatabase]?.description}
                  </p>

                  {courseDatabase[activeCourse.id as keyof typeof courseDatabase]?.link && (
                    <a 
                      href={courseDatabase[activeCourse.id as keyof typeof courseDatabase]?.link || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-transform"
                    >
                      <ExternalLink className="w-5 h-5" />
                      Abrir Material Externo
                    </a>
                  )}
                  
                  <div className="mt-8 pt-6 border-t border-white/5 flex items-start gap-2 opacity-50">
                    <Copyright className="w-3 h-3 text-zinc-500 mt-1 shrink-0" />
                    <p className="text-[10px] text-zinc-500 italic leading-relaxed">
                      Conteúdo educativo disponibilizado para fins de estudo acadêmico. Direitos de imagem e vídeo reservados aos autores originais. Uso sem fins lucrativos.
                    </p>
                  </div>
                </div>

                <CommentSection questId={activeCourse.id === 1 ? "excel-basico" : "educacao-financeira"} />

              </div>

              <div className="lg:col-span-1">
                <div className="glass-card p-6 sticky top-28">
                  <h3 className="font-bold text-lg mb-4 flex items-center justify-between">
                    Conteúdo do Curso
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded font-mono">{getActiveModules()}/{totalCourseModules}</span>
                  </h3>
                  <div className="space-y-3 mb-8">
                    {courseDatabase[activeCourse.id as keyof typeof courseDatabase]?.modules.map((mod, idx) => {
                      const isModImage = courseDatabase[activeCourse.id as keyof typeof courseDatabase]?.videos[idx]?.includes("img") || courseDatabase[activeCourse.id as keyof typeof courseDatabase]?.videos[idx]?.includes("conclusao") || courseDatabase[activeCourse.id as keyof typeof courseDatabase]?.videos[idx]?.match(/\.(jpeg|jpg|gif|png)$/i);
                      const isModCanva = courseDatabase[activeCourse.id as keyof typeof courseDatabase]?.videos[idx]?.includes("canva.com");
                      
                      return (
                        <div 
                          key={idx} 
                          onClick={() => setCurrentVideoIndex(idx)}
                          className={`p-4 rounded-xl border transition-colors cursor-pointer group flex items-start gap-3 ${
                            currentVideoIndex === idx 
                            ? "border-primary bg-primary/20" 
                            : idx < getActiveModules() 
                              ? "border-primary/50 bg-primary/10" 
                              : "border-white/5 bg-white/5 hover:bg-white/10"
                          }`}
                        >
                          {idx < getActiveModules() ? (
                             <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
                          ) : (
                             isModImage ? (idx === totalCourseModules - 1 ? <Trophy className={`w-5 h-5 shrink-0 mt-0.5 ${idx === currentVideoIndex ? "text-yellow-400" : "text-zinc-600 group-hover:text-yellow-400"}`} /> : <ImageIcon className={`w-5 h-5 shrink-0 mt-0.5 ${idx === currentVideoIndex ? "text-primary" : "text-zinc-600 group-hover:text-zinc-400"}`} />)
                             : isModCanva ? <FileText className={`w-5 h-5 shrink-0 mt-0.5 ${idx === currentVideoIndex ? "text-primary" : "text-zinc-600 group-hover:text-zinc-400"}`} />
                             : <PlayCircle className={`w-5 h-5 shrink-0 mt-0.5 ${idx === currentVideoIndex ? "text-primary" : "text-zinc-600 group-hover:text-zinc-400"}`} />
                          )}
                          <div>
                            <h4 className={`text-sm font-bold ${idx <= getActiveModules() || idx === currentVideoIndex ? "text-white" : "text-zinc-400 group-hover:text-white"} transition-colors`}>{idx + 1}. {mod.title}</h4>
                            <p className="text-xs text-zinc-500 font-mono mt-1">{mod.duration}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  
                  {getActiveModules() < totalCourseModules ? (
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
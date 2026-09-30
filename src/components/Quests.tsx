import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ChevronRight, ArrowLeft, Book, CheckCircle2, FileText, PlayCircle, ExternalLink } from "lucide-react";
import { supabase } from '@/lib/supabaseClient';
import CommentSection from "./CommentSection";
import { courseDatabase, initialCourses } from "@/data/questsData"; 

export default function Quests({ onXpGain }: { onXpGain?: () => void }) {
  const [activeCourse, setActiveCourse] = useState<any>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  
  const [course1Progress, setCourse1Progress] = useState(0);
  const [course1Modules, setCourse1Modules] = useState(0);
  const [financeProgress, setFinanceProgress] = useState(0);
  const [financeModules, setFinanceModules] = useState(0);

  const loadProgress = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('estrategia_progress, estrategia_modules, finance_progress, finance_modules')
        .eq('id', user.id)
        .single();

      if (data) {
        setCourse1Progress(data.estrategia_progress || 0); 
        setCourse1Modules(data.estrategia_modules || 0);
        setFinanceProgress(data.finance_progress || 0);
        setFinanceModules(data.finance_modules || 0);
      }
    }
  };

  useEffect(() => {
    loadProgress();
  }, []);

  const getActiveProgress = () => activeCourse?.id === 1 ? course1Progress : financeProgress;
  const getActiveModules = () => activeCourse?.id === 1 ? course1Modules : financeModules;

  // 🔥 INTELIGÊNCIA: Conta apenas os módulos que NÃO são "em-breve"
  const totalAvailableMods = activeCourse 
    ? courseDatabase[activeCourse.id as keyof typeof courseDatabase]?.videos.filter(v => !v.includes("em-breve")).length 
    : 0;

  const totalCourseModules = activeCourse 
    ? courseDatabase[activeCourse.id as keyof typeof courseDatabase]?.modules.length 
    : 0;

  const handleCompleteLesson = async () => {
    if (currentVideoIndex !== getActiveModules()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !activeCourse) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        const xpGanho = 50;
        const novoXp = (profile.xp || 0) + xpGanho;
        let novoLevel = profile.level || 1;
        
        if (novoXp >= novoLevel * 500) novoLevel += 1;

        let updateData: any = { xp: novoXp, level: novoLevel };
        
        // Usa o total disponível para o cálculo de 100%
        const maxMods = totalAvailableMods || 1;

        if (activeCourse.id === 1) {
            let newMods = (profile.estrategia_modules || 0) + 1;
            if (newMods > maxMods) newMods = maxMods; // Trava de segurança
            
            updateData.estrategia_modules = newMods;
            updateData.estrategia_progress = Math.round((newMods / maxMods) * 100);
            
            setCourse1Modules(newMods);
            setCourse1Progress(updateData.estrategia_progress);
        } else if (activeCourse.id === 2) {
            let newMods = (profile.finance_modules || 0) + 1;
            if (newMods > maxMods) newMods = maxMods; 

            updateData.finance_modules = newMods;
            updateData.finance_progress = Math.round((newMods / maxMods) * 100);
            
            setFinanceModules(newMods);
            setFinanceProgress(updateData.finance_progress);
        }

        await supabase.from('profiles').update(updateData).eq('id', user.id);
        
        if (onXpGain) onXpGain();

        // Só avança o vídeo se o próximo também estiver disponível
        if (currentVideoIndex + 1 < maxMods) {
          setCurrentVideoIndex(currentVideoIndex + 1);
        }
      }
    } catch (error) { 
      console.error("Erro ao salvar progresso:", error); 
    }
  };

  const currentMedia = activeCourse ? courseDatabase[activeCourse.id as keyof typeof courseDatabase]?.videos[currentVideoIndex] : null;
  const isImage = currentMedia?.match(/\.(jpeg|jpg|gif|png)$/i) || currentMedia?.includes("em-breve");
  const isCanva = currentMedia?.includes("canva.com");
  const isYouTube = currentMedia?.includes("youtube.com");
  const isVimeo = currentMedia?.includes("vimeo.com");
  
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-4 md:p-6 font-sans">
      <AnimatePresence mode="wait">
        {!activeCourse ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto space-y-8">
            <header className="space-y-2">
              <h1 className="text-4xl font-black italic tracking-tighter uppercase">Quest Lines</h1>
              <p className="text-zinc-500 text-sm font-medium">Selecione um módulo para iniciar sua jornada de aprendizado.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {initialCourses.map((c) => {
                const prog = c.id === 1 ? course1Progress : financeProgress;
                return (
                  <motion.div key={c.id} className="glass-card p-5 md:p-6 space-y-4 hover:border-primary/50 transition-all duration-300">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-primary mb-1 block">{c.tag}</span>
                        <h3 className="font-bold text-xl">{c.title}</h3>
                      </div>
                      <Book className="w-5 h-5 text-primary" />
                    </div>
                    
                    <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-1000 ${prog === 100 ? "bg-primary" : "xp-bar-fill"}`} style={{ width: `${prog}%` }} />
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs font-mono neon-text-green">+{c.xp} XP Máx</span>
                      <button onClick={() => setActiveCourse(c)} className="text-xs px-4 py-2 rounded bg-primary text-primary-foreground font-bold hover:scale-105 transition-transform flex items-center gap-1">
                        Acessar <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-6xl mx-auto">
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 md:mb-8">
              <button onClick={() => { setActiveCourse(null); loadProgress(); setCurrentVideoIndex(0); }} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group w-fit">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
                <span className="text-sm font-bold uppercase tracking-wider">Voltar às Quests</span>
              </button>
              <div className="text-left md:text-right">
                <h2 className="text-xl md:text-2xl font-bold text-white">{activeCourse.title}</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              <div className="lg:col-span-2 w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 relative flex items-center justify-center">
                {isVimeo ? (
                  <iframe src={currentMedia} className="w-full h-full absolute top-0 left-0 border-none" allow="autoplay; fullscreen" allowFullScreen></iframe>
                ) : isYouTube ? (
                  <iframe src={currentMedia} className="w-full h-full absolute top-0 left-0 border-none" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>
                ) : isCanva ? (
                  <iframe className="w-full h-full absolute top-0 left-0 border-none" src={currentMedia} allowFullScreen></iframe>
                ) : isImage ? (
                  <img src={currentMedia} className="w-full h-full object-contain bg-[#12121a]" />
                ) : (
                  <video key={currentVideoIndex} controls autoPlay className="w-full h-full object-cover" src={currentMedia}></video>
                )}
              </div>
              
              <div className="lg:col-span-1 glass-card p-5 md:p-6 sticky top-4 md:top-28">
                <h3 className="font-bold text-lg mb-4 flex items-center justify-between">
                  Módulos <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded font-mono">{getActiveModules()}/{totalAvailableMods}</span>
                </h3>
                
                <div className="space-y-3 mb-8">
                  {courseDatabase[activeCourse.id as keyof typeof courseDatabase]?.modules.map((mod, idx) => {
                    // Checa se o vídeo atrelado a esse módulo é o em-breve
                    const videoUrl = courseDatabase[activeCourse.id as keyof typeof courseDatabase]?.videos[idx] || "";
                    const isPlaceholder = videoUrl.includes("em-breve");
                    
                    const isCompleted = idx < getActiveModules();
                    const isCurrent = idx === currentVideoIndex;
                    const isLocked = idx > getActiveModules() || isPlaceholder;

                    return (
                      <div 
                        key={idx} 
                        onClick={() => !isLocked && !isPlaceholder && setCurrentVideoIndex(idx)} 
                        className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                          isPlaceholder 
                            ? "border-white/5 bg-[#0a0a0f] opacity-40 cursor-not-allowed grayscale" // Visual para módulo futuro
                            : isCurrent 
                              ? "border-primary bg-primary/20 cursor-pointer" 
                              : isCompleted 
                                ? "border-primary/50 bg-primary/10 cursor-pointer" 
                                : "border-white/5 bg-white/5 opacity-50 cursor-not-allowed" 
                        }`}
                      >
                        {isPlaceholder ? (
                          <Lock className="w-5 h-5 text-zinc-700" />
                        ) : isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        ) : isLocked ? (
                          <Lock className="w-5 h-5 text-zinc-600" />
                        ) : (
                          <PlayCircle className="w-5 h-5 text-white animate-pulse" />
                        )}
                        
                        <div className="flex-1">
                          <h4 className={`text-sm font-bold ${isCurrent ? "text-white" : isCompleted ? "text-zinc-300" : isPlaceholder ? "text-zinc-500" : "text-zinc-500"} line-clamp-1`}>
                            {mod.title}
                          </h4>
                          <p className="text-xs text-zinc-500 font-mono mt-0.5">
                            {isPlaceholder ? "Em Desenvolvimento" : mod.duration}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {getActiveModules() < totalAvailableMods ? (
                  <button 
                    onClick={handleCompleteLesson} 
                    disabled={currentVideoIndex !== getActiveModules()}
                    className={`w-full py-3.5 font-bold rounded-xl flex items-center justify-center gap-2 text-sm uppercase transition-all ${
                      currentVideoIndex === getActiveModules() 
                        ? "bg-primary text-white hover:brightness-110" 
                        : "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" /> 
                    {currentVideoIndex === getActiveModules() ? "Concluir Etapa (+50 XP)" : "Etapa Indisponível"}
                  </button>
                ) : (
                  <button onClick={() => { setActiveCourse(null); setCurrentVideoIndex(0); }} className="w-full py-3.5 bg-green-500/20 text-green-400 border border-green-500/50 font-bold rounded-xl flex items-center justify-center gap-2 text-sm uppercase">
                    <CheckCircle2 className="w-5 h-5" /> Curso Concluído
                  </button>
                )}
              </div>

              <div className="lg:col-span-2 glass-card p-5 md:p-8">
                <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
                  <FileText className="text-primary w-6 h-6" />
                  <h3 className="text-lg font-bold">Material de Apoio</h3>
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed mb-6">{courseDatabase[activeCourse.id as keyof typeof courseDatabase]?.description}</p>
                {courseDatabase[activeCourse.id as keyof typeof courseDatabase]?.link && (
                  <a href={courseDatabase[activeCourse.id as keyof typeof courseDatabase]?.link || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-transform text-sm">
                    <ExternalLink className="w-4 h-4" /> Material Externo
                  </a>
                )}
              </div>

              <div className="lg:col-span-2 w-full">
                <CommentSection questId={activeCourse.id === 1 ? "curso-estrategia" : "educacao-financeira"} />
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
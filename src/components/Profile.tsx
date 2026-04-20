import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Save, AlertTriangle, Trash2, Loader2, X, Shield, ChevronLeft, ChevronRight, Dices, Key, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Avatar, { genConfig } from 'react-nice-avatar'; 

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const hairStyles = ["normal", "thick", "mohawk", "womanLong", "womanShort"];
const eyeStyles = ["circle", "oval", "smile"]; 
const glassesStyles = ["none", "round", "square"];
const mouthStyles = ["laugh", "smile", "peace"];
const shirtStyles = ["hoody", "short", "polo"];
const hatStyles = ["none", "beanie", "turban"]; 

export default function Profile({ onLogout }: { onLogout?: () => void }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false); // 👈 Novo estado pro botão de salvar!
  const [savingPassword, setSavingPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  
  const [avatarConfig, setAvatarConfig] = useState<any>(genConfig());

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
        
        const { data: profile } = await supabase
          .from("profiles")
          .select("username, level, xp, avatar_config")
          .eq("id", user.id)
          .single();

        if (profile) {
          setUsername(profile.username);
          setLevel(profile.level || 1);
          setXp(profile.xp || 0);
          
          if (profile.avatar_config && Object.keys(profile.avatar_config).length > 0) {
            setAvatarConfig(genConfig(profile.avatar_config));
          }
        }
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  const changeFeature = (feature: string, optionsArray: string[], direction: "next" | "prev") => {
    setAvatarConfig((prev: any) => {
      const currentVal = prev[feature] || optionsArray[0];
      const currentIndex = optionsArray.indexOf(currentVal);
      let newIndex = currentIndex === -1 ? 0 : currentIndex;

      if (direction === "next") {
        newIndex = (newIndex + 1) % optionsArray.length;
      } else {
        newIndex = (newIndex - 1 + optionsArray.length) % optionsArray.length;
      }

      return { ...prev, [feature]: optionsArray[newIndex] };
    });
  };

  const randomAvatar = () => {
    setAvatarConfig(genConfig());
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from("profiles")
          .update({ 
            username: username.trim(),
            avatar_config: avatarConfig 
          })
          .eq("id", user.id);

        if (error) throw error;
        
        localStorage.setItem("rota40_username", username.trim());
        
        // 👈 A mágica do botão aqui: ativa o sucesso e tira o Alert!
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000); // Volta ao normal em 3 segundos
      }
    } catch (error: any) {
      alert("Erro ao salvar: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) return alert("A senha deve ter pelo menos 6 caracteres!");
    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      alert("Senha alterada com sucesso!");
      setNewPassword("");
    } catch (error: any) {
      alert("Erro ao alterar senha: " + error.message);
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").delete().eq("id", user.id);
        await supabase.auth.signOut();
        localStorage.clear();
        if (onLogout) onLogout();
      }
    } catch (error: any) {
      alert("Erro ao excluir: " + error.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="flex-1 flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-sans">
      <header className="space-y-2">
        <h1 className="text-4xl font-black italic tracking-tighter uppercase">Quartel General</h1>
        <p className="text-zinc-500 text-sm font-medium">Forje a sua identidade na Rota 4.0.</p>
      </header>

      {/* CAMARIM E IDENTIDADE */}
      <motion.div className="glass-card p-6 md:p-8 space-y-8" variants={fadeUp} initial="hidden" animate="visible">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/5">
          {/* Avatar Preview */}
          <div className="col-span-1 flex flex-col items-center justify-center space-y-4">
            <div className="w-40 h-40 rounded-[2rem] bg-[#13131a] border-2 border-primary/30 flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.2)] overflow-hidden">
              <Avatar className="w-full h-full" {...avatarConfig} />
            </div>
            <button 
              type="button"
              onClick={randomAvatar}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-zinc-300 flex items-center gap-2 transition-all border border-white/10"
            >
              <Dices className="w-4 h-4 text-primary" /> Rolar Dados
            </button>
          </div>

          {/* Avatar Controls */}
          <div className="col-span-2 space-y-5 flex flex-col justify-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-1">Montador de Avatar</h2>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Ajuste seu visual cibernético</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Controle Cabelo */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Cabelo</label>
                <div className="flex items-center justify-between bg-[#0a0a0f]/50 border border-white/5 rounded-xl p-2">
                  <button type="button" onClick={() => changeFeature("hairStyle", hairStyles, "prev")} className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="text-xs font-bold capitalize">{avatarConfig.hairStyle || "Normal"}</span>
                  <button type="button" onClick={() => changeFeature("hairStyle", hairStyles, "next")} className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Controle Olhos */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Olhos</label>
                <div className="flex items-center justify-between bg-[#0a0a0f]/50 border border-white/5 rounded-xl p-2">
                  <button type="button" onClick={() => changeFeature("eyeStyle", eyeStyles, "prev")} className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="text-xs font-bold capitalize">{avatarConfig.eyeStyle || "Circle"}</span>
                  <button type="button" onClick={() => changeFeature("eyeStyle", eyeStyles, "next")} className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Controle Boca */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Expressão</label>
                <div className="flex items-center justify-between bg-[#0a0a0f]/50 border border-white/5 rounded-xl p-2">
                  <button type="button" onClick={() => changeFeature("mouthStyle", mouthStyles, "prev")} className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="text-xs font-bold capitalize">{avatarConfig.mouthStyle || "Smile"}</span>
                  <button type="button" onClick={() => changeFeature("mouthStyle", mouthStyles, "next")} className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Controle Óculos */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Óculos</label>
                <div className="flex items-center justify-between bg-[#0a0a0f]/50 border border-white/5 rounded-xl p-2">
                  <button type="button" onClick={() => changeFeature("glassesStyle", glassesStyles, "prev")} className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="text-xs font-bold capitalize">{avatarConfig.glassesStyle || "Nenhum"}</span>
                  <button type="button" onClick={() => changeFeature("glassesStyle", glassesStyles, "next")} className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Controle Chapéu */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Acessório</label>
                <div className="flex items-center justify-between bg-[#0a0a0f]/50 border border-white/5 rounded-xl p-2">
                  <button type="button" onClick={() => changeFeature("hatStyle", hatStyles, "prev")} className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="text-xs font-bold capitalize">{avatarConfig.hatStyle || "Nenhum"}</span>
                  <button type="button" onClick={() => changeFeature("hatStyle", hatStyles, "next")} className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Controle Roupa */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Roupa</label>
                <div className="flex items-center justify-between bg-[#0a0a0f]/50 border border-white/5 rounded-xl p-2">
                  <button type="button" onClick={() => changeFeature("shirtStyle", shirtStyles, "prev")} className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="text-xs font-bold capitalize">{avatarConfig.shirtStyle || "Casual"}</span>
                  <button type="button" onClick={() => changeFeature("shirtStyle", shirtStyles, "next")} className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">E-mail Principal</label>
              <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700" /><input type="email" disabled value={email} className="w-full bg-[#0a0a0f]/50 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-zinc-600 cursor-not-allowed text-sm" /></div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Nome de Estrategista</label>
              <div className="relative group"><User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-primary transition-colors" /><input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-[#0a0a0f]/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-all text-sm" /></div>
            </div>
          </div>
          <div className="flex justify-end">
            {/* 👈 Botão de salvar refeito com o feedback visual! */}
            <button 
              type="submit" 
              disabled={saving || saveSuccess} 
              className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-90 disabled:cursor-default
                ${saveSuccess 
                  ? "bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]" 
                  : "bg-primary text-white hover:brightness-110 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                }`}
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : saveSuccess ? (
                <><CheckCircle className="w-5 h-5" /> Salvo!</>
              ) : (
                <><Save className="w-5 h-5" /> Salvar Identidade</>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* CARD 2: SEGURANÇA (ALTERAR SENHA) */}
      <motion.div className="glass-card p-6 md:p-8 space-y-6 border-blue-500/20" variants={fadeUp} initial="hidden" animate="visible">
        <h3 className="text-lg font-bold flex items-center gap-2 text-blue-400">
          <Key className="w-5 h-5" /> Protocolo de Segurança
        </h3>
        <form onSubmit={handleChangePassword} className="flex flex-col md:flex-row items-end gap-4">
          <div className="flex-1 space-y-2 w-full">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Nova Senha</label>
            <div className="relative group">
              <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within:text-blue-400 transition-colors" />
              <input type="password" placeholder="No mínimo 6 caracteres" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-[#0a0a0f]/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-all text-sm" />
            </div>
          </div>
          <button type="submit" disabled={savingPassword || !newPassword} className="px-8 py-3.5 bg-blue-600/20 text-blue-400 border border-blue-500/50 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600/30 transition-all text-xs disabled:opacity-30 disabled:grayscale">
            {savingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4" /> Alterar Senha</>}
          </button>
        </form>
      </motion.div>

      {/* ZONA DE PERIGO */}
      <motion.div className="glass-card p-6 border-red-500/20 bg-red-500/5" variants={fadeUp} initial="hidden" animate="visible">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-red-500 flex items-center justify-center md:justify-start gap-2"><AlertTriangle className="w-5 h-5" /> Zona Crítica</h3>
            <p className="text-xs text-zinc-500">A exclusão da conta é permanente e irreversível.</p>
          </div>
          <button onClick={() => setShowDeleteConfirm(true)} className="px-6 py-3 border border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-xl font-bold text-xs transition-all flex items-center gap-2"><Trash2 className="w-4 h-4" /> Excluir Conta</button>
        </div>
      </motion.div>

      {/* MODAL DE CONFIRMAÇÃO */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteConfirm(false)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-sm glass-card p-8 border-red-500/40 text-center space-y-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto border border-red-500/40"><AlertTriangle className="w-8 h-8 text-red-500" /></div>
              <div className="space-y-2"><h3 className="text-xl font-bold">Confirmar Exclusão?</h3><p className="text-sm text-zinc-500">Sua jornada na Rota 4.0 será encerrada permanentemente.</p></div>
              <div className="flex gap-3"><button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 bg-zinc-800 rounded-xl font-bold text-sm text-white">Voltar</button><button onClick={handleDeleteAccount} disabled={deleting} className="flex-1 py-3 bg-red-500 rounded-xl font-bold text-sm text-white">{deleting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Deletar"}</button></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
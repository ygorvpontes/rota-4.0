import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Save, AlertTriangle, Trash2, Loader2, Key, CheckCircle, Dices, ChevronLeft, ChevronRight, Shield } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Avatar, { genConfig } from 'react-nice-avatar'; 

// Correção do TypeScript: adicionado o "as const" no array do ease
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } } };

const hairStyles = ["normal", "thick", "mohawk", "womanLong", "womanShort"];
const eyeStyles = ["circle", "oval", "smile"]; 
const glassesStyles = ["none", "round", "square"];
const mouthStyles = ["laugh", "smile", "peace"];
const shirtStyles = ["hoody", "short", "polo"];
const hatStyles = ["none", "beanie", "turban"]; 

export default function Profile({ onLogout }: { onLogout?: () => void }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [avatarConfig, setAvatarConfig] = useState<any>(genConfig());

  useEffect(() => { loadUserProfile(); }, []);

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
        const { data: profile } = await supabase.from("profiles").select("username, avatar_config").eq("id", user.id).single();
        if (profile) {
          setUsername(profile.username);
          if (profile.avatar_config && Object.keys(profile.avatar_config).length > 0) setAvatarConfig(genConfig(profile.avatar_config));
        }
      }
    } catch (error) { console.error("Erro:", error); } 
    finally { setLoading(false); }
  };

  const changeFeature = (feature: string, optionsArray: string[], direction: "next" | "prev") => {
    setAvatarConfig((prev: any) => {
      const currentVal = prev[feature] || optionsArray[0];
      let newIndex = optionsArray.indexOf(currentVal);
      if (newIndex === -1) newIndex = 0;
      if (direction === "next") newIndex = (newIndex + 1) % optionsArray.length;
      else newIndex = (newIndex - 1 + optionsArray.length) % optionsArray.length;
      return { ...prev, [feature]: optionsArray[newIndex] };
    });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").update({ username: username.trim(), avatar_config: avatarConfig }).eq("id", user.id);
        localStorage.setItem("rota40_username", username.trim());
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error: any) { alert("Erro ao salvar: " + error.message); } 
    finally { setSaving(false); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) return alert("Mínimo 6 caracteres.");
    setSavingPassword(true);
    try {
      await supabase.auth.updateUser({ password: newPassword });
      alert("Senha alterada!"); setNewPassword("");
    } catch (error: any) { alert("Erro: " + error.message); } 
    finally { setSavingPassword(false); }
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
    } catch (error: any) { alert("Erro: " + error.message); } 
    finally { setDeleting(false); }
  };

  if (loading) return <div className="flex-1 flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-sans px-2 sm:px-0">
      <header className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black italic tracking-tighter uppercase">Quartel General</h1>
        <p className="text-zinc-500 text-xs sm:text-sm font-medium">Forje a sua identidade na Rota 4.0.</p>
      </header>

      <motion.div className="glass-card p-5 sm:p-8 space-y-8" variants={fadeUp} initial="hidden" animate="visible">
        <div className="flex flex-col lg:flex-row gap-8 pb-8 border-b border-white/5">
          <div className="flex flex-col items-center justify-center space-y-4 lg:w-1/3">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2rem] bg-[#13131a] border-2 border-primary/30 flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.2)] overflow-hidden">
              <Avatar className="w-full h-full" {...avatarConfig} />
            </div>
            <button type="button" onClick={() => setAvatarConfig(genConfig())} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-zinc-300 flex items-center gap-2 border border-white/10">
              <Dices className="w-4 h-4 text-primary" /> Rolar Dados
            </button>
          </div>

          <div className="flex-1 space-y-5">
            <div className="text-center lg:text-left">
              <h2 className="text-xl sm:text-2xl font-bold mb-1">Montador de Avatar</h2>
              <p className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest font-bold">Ajuste seu visual</p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { label: "Cabelo", key: "hairStyle", opts: hairStyles },
                { label: "Olhos", key: "eyeStyle", opts: eyeStyles },
                { label: "Boca", key: "mouthStyle", opts: mouthStyles },
                { label: "Óculos", key: "glassesStyle", opts: glassesStyles },
                { label: "Chapéu", key: "hatStyle", opts: hatStyles },
                { label: "Roupa", key: "shirtStyle", opts: shirtStyles }
              ].map((item) => (
                <div key={item.key} className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{item.label}</label>
                  <div className="flex items-center justify-between bg-[#0a0a0f]/50 border border-white/5 rounded-xl p-1.5 sm:p-2">
                    <button type="button" onClick={() => changeFeature(item.key, item.opts, "prev")} className="p-1 hover:bg-white/10 rounded-lg text-zinc-400"><ChevronLeft className="w-4 h-4" /></button>
                    <span className="text-[10px] sm:text-xs font-bold capitalize truncate px-1">{avatarConfig[item.key] || item.opts[0]}</span>
                    <button type="button" onClick={() => changeFeature(item.key, item.opts, "next")} className="p-1 hover:bg-white/10 rounded-lg text-zinc-400"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase">E-mail Principal</label>
              <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700" /><input type="email" disabled value={email} className="w-full bg-[#0a0a0f]/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-zinc-600 cursor-not-allowed text-sm" /></div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase">Nome de Estrategista</label>
              <div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" /><input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-[#0a0a0f]/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary/50 text-sm" /></div>
            </div>
          </div>
          
          <button type="submit" disabled={saving || saveSuccess} className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${saveSuccess ? "bg-green-500 text-white" : "bg-primary text-white"}`}>
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : saveSuccess ? <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Salvo!</span> : <span className="flex items-center gap-2"><Save className="w-5 h-5" /> Salvar Identidade</span>}
          </button>
        </form>
      </motion.div>

      <motion.div className="glass-card p-5 sm:p-8 border-blue-500/20" variants={fadeUp} initial="hidden" animate="visible">
        <h3 className="text-lg font-bold flex items-center gap-2 text-blue-400 mb-4"><Key className="w-5 h-5" /> Protocolo de Segurança</h3>
        <form onSubmit={handleChangePassword} className="flex flex-col sm:flex-row items-end gap-3 sm:gap-4">
          <div className="flex-1 w-full space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase">Nova Senha</label>
            <div className="relative"><Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700" /><input type="password" placeholder="No mínimo 6 caracteres" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-[#0a0a0f]/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm" /></div>
          </div>
          <button type="submit" disabled={savingPassword || !newPassword} className="w-full sm:w-auto px-8 py-3 bg-blue-600/20 text-blue-400 border border-blue-500/50 rounded-xl font-bold text-xs disabled:opacity-30">
            {savingPassword ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Alterar Senha"}
          </button>
        </form>
      </motion.div>

      <motion.div className="glass-card p-5 sm:p-6 border-red-500/20 bg-red-500/5" variants={fadeUp} initial="hidden" animate="visible">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left"><h3 className="text-base sm:text-lg font-bold text-red-500 flex items-center justify-center sm:justify-start gap-2"><AlertTriangle className="w-5 h-5" /> Zona Crítica</h3></div>
          <button onClick={() => setShowDeleteConfirm(true)} className="w-full sm:w-auto px-6 py-3 border border-red-500/30 text-red-500 rounded-xl font-bold text-xs"><Trash2 className="w-4 h-4 inline mr-2" /> Excluir Conta</button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-xs sm:max-w-sm glass-card p-6 sm:p-8 border-red-500/40 text-center space-y-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto"><AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" /></div>
              <div className="space-y-2"><h3 className="text-lg sm:text-xl font-bold">Confirmar Exclusão?</h3><p className="text-xs sm:text-sm text-zinc-500">Sua jornada será encerrada.</p></div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => setShowDeleteConfirm(false)} className="w-full py-3 bg-zinc-800 rounded-xl font-bold text-sm text-white">Voltar</button>
                <button onClick={handleDeleteAccount} disabled={deleting} className="w-full py-3 bg-red-500 rounded-xl font-bold text-sm text-white">{deleting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Deletar"}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Save, AlertTriangle, Trash2, Loader2, X, Shield, Camera, Key, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function Profile({ onLogout }: { onLogout?: () => void }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState(""); // 👈 Estado para a nova senha
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

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
          .select("username, level, xp, avatar_url")
          .eq("id", user.id)
          .single();

        if (profile) {
          setUsername(profile.username);
          setLevel(profile.level || 1);
          setXp(profile.xp || 0);
          setAvatarUrl(profile.avatar_url);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingAvatar(true);
      if (!event.target.files || event.target.files.length === 0) throw new Error("Selecione uma imagem.");
      const file = event.target.files[0];
      const fileName = `${Math.random()}.${file.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
        setAvatarUrl(publicUrl);
      }
    } catch (error: any) {
      alert("Erro no upload: " + error.message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").update({ username: username.trim() }).eq("id", user.id);
        alert("Nome de Estrategista atualizado!");
        localStorage.setItem("rota40_username", username.trim());
      }
    } catch (error: any) {
      alert("Erro: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  // 🔐 FUNÇÃO PARA ALTERAR SENHA
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres, mano!");
      return;
    }
    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      alert("Senha alterada com sucesso! Na próxima vez que entrar, use a nova chave.");
      setNewPassword(""); // Limpa o campo
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
    <div className="max-w-3xl mx-auto space-y-6 pb-12 font-sans">
      <header className="space-y-2">
        <h1 className="text-4xl font-black italic tracking-tighter uppercase">Quartel General</h1>
        <p className="text-zinc-500 text-sm font-medium">Controle total sobre sua identidade na Rota 4.0.</p>
      </header>

      {/* CARD 1: IDENTIDADE */}
      <motion.div className="glass-card p-6 md:p-8 space-y-8" variants={fadeUp} initial="hidden" animate="visible">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-white/5">
          <div className="relative group">
            <div className="w-24 h-24 rounded-3xl bg-[#13131a] border border-primary/30 flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.2)] overflow-hidden">
              {uploadingAvatar ? <Loader2 className="w-8 h-8 text-primary animate-spin" /> : avatarUrl ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <User className="w-10 h-10 text-zinc-700" />}
            </div>
            <label className="absolute inset-0 bg-black/60 rounded-3xl opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer backdrop-blur-sm">
              <Camera className="w-6 h-6 text-white" /><input type="file" accept="image/*" onChange={uploadAvatar} className="hidden" disabled={uploadingAvatar} />
            </label>
          </div>
          <div className="text-center sm:text-left pt-2">
            <h2 className="text-2xl font-bold tracking-tight">{username}</h2>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
              <Shield className="w-4 h-4 text-primary" /><span className="text-xs font-mono text-primary uppercase tracking-[0.2em]">Estrategista Nível {level}</span>
            </div>
            <p className="text-[10px] text-zinc-500 mt-2 uppercase font-bold tracking-widest">{xp} XP Acumulados</p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">E-mail Principal</label>
              <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700" /><input type="email" disabled value={email} className="w-full bg-[#0a0a0f]/50 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-zinc-600 cursor-not-allowed text-sm" /></div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Nome de Usuário</label>
              <div className="relative group"><User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-primary transition-colors" /><input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-[#0a0a0f]/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-all text-sm" /></div>
            </div>
          </div>
          <div className="flex justify-end"><button type="submit" disabled={saving} className="px-8 py-3 bg-primary/20 text-primary border border-primary/50 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/30 transition-all text-xs">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar Nome"}</button></div>
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
              <input 
                type="password" 
                placeholder="No mínimo 6 caracteres"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#0a0a0f]/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-all text-sm" 
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={savingPassword || !newPassword}
            className="px-8 py-3.5 bg-blue-600/20 text-blue-400 border border-blue-500/50 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600/30 transition-all text-xs disabled:opacity-30 disabled:grayscale"
          >
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

      {/* MODAL DE CONFIRMAÇÃO ... mantido */}
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
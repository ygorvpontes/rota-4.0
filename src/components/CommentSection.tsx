import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient'; 
import { Send, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from 'react-nice-avatar';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: { username: string; avatar_config: any; };
}

interface CommentSectionProps { questId?: string; }

// Adicionado o "default" aqui para resolver o erro do Vite
export default function CommentSection({ questId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => { fetchSessionAndComments(); }, [questId]);

  const fetchSessionAndComments = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) setUserId(session.user.id);

    let query = supabase.from('comments').select(`id, content, created_at, profiles (username, avatar_config)`).order('created_at', { ascending: false });
    if (questId) query = query.eq('quest_id', questId);

    const { data, error } = await query;
    if (!error && data) setComments(data as any);
    else console.error("Erro ao buscar comentários:", error);
    
    setLoading(false);
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !userId) return;

    setSubmitting(true);
    const { error } = await supabase.from('comments').insert({ user_id: userId, quest_id: questId || null, content: newComment.trim() });

    if (!error) {
      setNewComment(''); 
      fetchSessionAndComments(); 
    } else console.error("Erro ao postar:", error);

    setSubmitting(false);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(dateString));
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 bg-[#0a0a0f] p-4 sm:p-6 rounded-2xl border border-white/10 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="text-purple-500" size={24} />
        <h2 className="text-lg sm:text-xl font-bold text-white">
          {questId ? 'Discussão da Missão' : 'Fórum Global'}
        </h2>
      </div>

      <form onSubmit={handlePostComment} className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Compartilhe sua estratégia..."
          className="flex-1 bg-[#12121a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all text-sm w-full"
          disabled={submitting}
        />
        <button
          type="submit"
          disabled={!newComment.trim() || submitting}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          <Send size={20} className={submitting ? 'animate-pulse' : ''} />
        </button>
      </form>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-gray-500 py-4 animate-pulse text-sm">Carregando transmissões...</div>
        ) : comments.length === 0 ? (
          <div className="text-center text-gray-500 py-8 bg-[#12121a] rounded-xl border border-white/5 text-sm px-4">
            Nenhum estrategista comentou aqui ainda. Seja o primeiro!
          </div>
        ) : (
          <AnimatePresence>
            {comments.map((comment) => (
              <motion.div key={comment.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-[#12121a] p-4 rounded-xl border border-white/5 flex gap-3 sm:gap-4 hover:border-white/10 transition-colors"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                  <Avatar className="w-full h-full rounded-full" {...(comment.profiles.avatar_config || {})} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-green-400 text-sm sm:text-base truncate">
                      {comment.profiles.username || 'Estrategista Anônimo'}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed break-words whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

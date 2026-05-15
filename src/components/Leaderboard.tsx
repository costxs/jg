import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Trophy, Users, Star } from 'lucide-react';

interface Score {
  id: string;
  team_name: string;
  points: number;
  created_at: string;
}

export default function Leaderboard() {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScores();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('piaget_scores_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'piaget_scores' }, () => {
        fetchScores();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  async function fetchScores() {
    try {
      const { data, error } = await supabase
        .from('piaget_scores')
        .select('*')
        .order('points', { ascending: false })
        .limit(10);

      if (error) throw error;
      setScores(data || []);
    } catch (err) {
      console.error('Error fetching scores:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-emerald-100/50">
        <div className="bg-emerald-600 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Trophy size={120} />
          </div>
          <h2 className="text-4xl font-black mb-2 tracking-tight">Placar de Líderes</h2>
          <p className="text-emerald-100 font-medium">Os melhores pesquisadores cognitivos</p>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          ) : scores.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Users size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-xl">Nenhuma equipe pontuou ainda.</p>
              <p className="text-sm">Escaneie o QR Code e comece a jogar!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {scores.map((score, index) => (
                <div 
                  key={score.id}
                  className={`flex items-center justify-between p-5 rounded-2xl transition-all hover:scale-[1.01] ${
                    index === 0 ? 'bg-amber-50 border border-amber-200' : 
                    index === 1 ? 'bg-slate-50 border border-slate-200' :
                    index === 2 ? 'bg-orange-50 border border-orange-200' :
                    'bg-white border border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                      index === 0 ? 'bg-amber-400 text-amber-900' :
                      index === 1 ? 'bg-slate-300 text-slate-700' :
                      index === 2 ? 'bg-orange-300 text-orange-800' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg uppercase tracking-wide">
                        {score.team_name}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {new Date(score.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-emerald-600">{score.points}</span>
                    <Star size={20} className="text-emerald-500 fill-emerald-500" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

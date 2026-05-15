import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Send, RefreshCw } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  isTrue: boolean;
  explanation: string;
}

const questions: Question[] = [
  {
    id: 1,
    text: "Segundo Piaget, a 'Assimilação' ocorre quando a criança precisa modificar um esquema mental já existente para conseguir compreender uma situação nova.",
    isTrue: false,
    explanation: "Falso. Modificar um esquema existente para lidar com o novo é a 'Acomodação'. A 'Assimilação' é quando a criança apenas incorpora a informação nova aos esquemas que ela já possui (ex: chamar um cavalo de 'cachorro grande')."
  },
  {
    id: 2,
    text: "A 'Permanência do Objeto', que é o entendimento de que as coisas continuam a existir mesmo quando não podem ser vistas, é a principal conquista do estágio Sensório-Motor (0 a 2 anos).",
    isTrue: true,
    explanation: "Verdadeiro. No início deste estágio, se você esconde um brinquedo sob um pano, para o bebê o brinquedo deixou de existir. Entender que ele ainda está lá é o marco que finaliza essa fase."
  },
  {
    id: 3,
    text: "No estágio Pré-Operatório (2 a 7 anos), a criança domina facilmente o conceito de 'Conservação de Volume', entendendo que a quantidade de líquido não muda se trocarmos um copo largo por um alto.",
    isTrue: false,
    explanation: "Falso. Esta fase é marcada justamente pela *falta* de conservação. O pensamento da criança é centrado na aparência (altura do copo), o que a impede de deduzir que o volume se manteve o mesmo."
  },
  {
    id: 4,
    text: "O Egocentrismo, característico do estágio Pré-Operatório, não significa egoísmo, mas sim a dificuldade da criança em assumir ou compreender a perspectiva e o ponto de vista de outra pessoa.",
    isTrue: true,
    explanation: "Verdadeiro. Para a criança nesta fase, o mundo gira em torno dela mesma, e ela assume que todos veem, pensam e sentem exatamente como ela."
  },
  {
    id: 5,
    text: "O estágio Operatório Concreto (7 a 11 anos) introduz a 'Reversibilidade', permitindo à criança entender que a água que virou gelo pode voltar a ser água líquida.",
    isTrue: true,
    explanation: "Verdadeiro. O pensamento torna-se lógico e reversível, mas ainda depende de objetos concretos e situações reais que possam ser manipuladas ou imaginadas com base na realidade."
  },
  {
    id: 6,
    text: "Crianças no estágio Operatório Concreto conseguem debater facilmente teorias filosóficas abstratas, hipóteses complexas e dilemas morais teóricos.",
    isTrue: false,
    explanation: "Falso. O pensamento abstrato e o raciocínio hipotético-dedutivo são as características que definem o último estágio: o Operatório Formal (a partir dos 11/12 anos)."
  }
];

export default function TrueOrFalsePiaget() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [teamName, setTeamName] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const startGame = () => {
    if (teamName.trim()) {
      setGameStarted(true);
    }
  };

  const handleAnswer = (userAnswer: boolean) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = userAnswer === currentQuestion.isTrue;

    if (isCorrect) {
      setScore(score + 1);
    }

    setFeedback({
      isCorrect,
      text: currentQuestion.explanation,
    });
  };

  const nextQuestion = () => {
    setFeedback(null);
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const restartGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResults(false);
    setFeedback(null);
    setSubmitted(false);
    setGameStarted(false);
    setTeamName('');
  };

  const submitScore = async () => {
    if (!teamName.trim()) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('piaget_scores')
        .insert([{ team_name: teamName, points: score }]);
      
      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting score:', err);
      alert('Erro ao enviar pontuação. Verifique se a tabela piaget_scores existe.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-emerald-50 p-4 font-sans text-slate-800">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 border border-emerald-100">
        <h1 className="text-3xl font-extrabold text-center text-emerald-800 mb-8 tracking-tight">
          A Jornada Cognitiva: Jean Piaget
        </h1>

        {!gameStarted ? (
          <div className="text-center animate-fade-in max-w-md mx-auto py-8">
            <div className="bg-emerald-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl">
              🎯
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Bem-vindos, Pesquisadores!</h2>
            <p className="text-slate-600 mb-8">
              Antes de começar a jornada pelos estágios do desenvolvimento, identifique sua equipe.
            </p>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nome da Equipe"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && startGame()}
                className="w-full p-4 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none text-center font-bold text-lg"
              />
              <button
                onClick={startGame}
                disabled={!teamName.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-200 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:scale-[1.02] active:scale-100"
              >
                Iniciar Desafio
              </button>
            </div>
          </div>
        ) : showResults ? (
          <div className="text-center animate-fade-in">
            <div className="text-6xl mb-4">{score >= 4 ? '🏆' : '📚'}</div>
            <h2 className="text-3xl font-bold mb-4 text-slate-800">Avaliação Concluída!</h2>
            <p className="text-xl mb-4 text-slate-600">
              Equipe: <span className="font-black text-emerald-700">{teamName}</span>
            </p>
            <p className="text-lg mb-8 text-slate-500">
              Você acertou <span className="font-extrabold text-emerald-600 text-2xl">{score}</span> de {questions.length} conceitos.
            </p>

            {!submitted ? (
              <div className="bg-emerald-50 p-6 rounded-2xl mb-8 border border-emerald-100 max-w-md mx-auto">
                <p className="text-emerald-800 font-medium mb-4">Tudo pronto para subir ao placar?</p>
                <button
                  onClick={submitScore}
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Enviando...' : (
                    <>
                      <Send size={18} />
                      Enviar Pontuação
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="bg-sky-50 p-6 rounded-2xl mb-8 border border-sky-100 max-w-md mx-auto">
                <p className="text-sky-800 font-bold text-lg mb-2">✨ Pontuação Enviada!</p>
                <p className="text-sky-600 text-sm">Sua equipe agora brilha no placar.</p>
              </div>
            )}

            <button
              onClick={restartGame}
              className="flex items-center justify-center gap-2 mx-auto text-emerald-600 font-bold hover:text-emerald-700 transition-colors"
            >
              <RefreshCw size={18} />
              Novo Jogo / Outra Equipe
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-full bg-emerald-100 rounded-full h-3 mb-6 overflow-hidden">
              <div 
                className="bg-emerald-500 h-3 rounded-full transition-all duration-700 ease-out" 
                style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
              ></div>
            </div>

            <p className="text-sm font-semibold tracking-wider text-emerald-600/80 uppercase mb-4">
              Estágio {currentQuestionIndex + 1} de {questions.length}
            </p>
            
            <h2 className="text-2xl font-medium text-slate-700 text-center mb-10 min-h-[100px] leading-relaxed">
              "{questions[currentQuestionIndex].text}"
            </h2>

            {!feedback ? (
              <div className="flex gap-6 w-full justify-center">
                <button
                  onClick={() => handleAnswer(true)}
                  className="flex-1 max-w-[220px] bg-sky-500 hover:bg-sky-600 text-white font-bold py-5 rounded-2xl shadow-md transition-all hover:-translate-y-1 active:translate-y-0"
                >
                  VERDADEIRO
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  className="flex-1 max-w-[220px] bg-rose-500 hover:bg-rose-600 text-white font-bold py-5 rounded-2xl shadow-md transition-all hover:-translate-y-1 active:translate-y-0"
                >
                  FALSO
                </button>
              </div>
            ) : (
              <div className="w-full text-center animate-fade-in">
                <div className={`p-6 rounded-2xl mb-8 border-2 ${feedback.isCorrect ? 'bg-sky-50 border-sky-200 text-sky-900' : 'bg-rose-50 border-rose-200 text-rose-900'}`}>
                  <p className={`font-black text-2xl mb-3 ${feedback.isCorrect ? 'text-sky-600' : 'text-rose-600'}`}>
                    {feedback.isCorrect ? '✨ Resposta Correta!' : '❌ Resposta Incorreta!'}
                  </p>
                  <p className="text-lg leading-relaxed">{feedback.text}</p>
                </div>
                <button
                  onClick={nextQuestion}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 px-12 rounded-xl transition-all hover:scale-105 shadow-md"
                >
                  {currentQuestionIndex + 1 === questions.length ? 'Finalizar Módulo' : 'Avançar'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

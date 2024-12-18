import { useEffect, useState } from 'react';

const NIVEL_MIN_BONUS = 5;
const MAX_VIDAS_BONUS = 3;

const BonusTimer = ({ tempoInicial, isPaused, nivel, vidasBonus }) => {
  const [tempoRestante, setTempoRestante] = useState(10);
  const porcentagem = (tempoRestante / 10) * 100;

  useEffect(() => {
    if (tempoInicial) {
      const tempoPassado = (Date.now() - tempoInicial) / 1000;
      setTempoRestante(Math.max(0, 10 - tempoPassado));
    }
  }, [tempoInicial]);

  useEffect(() => {
    if (isPaused || tempoRestante <= 0) return;

    const timer = setInterval(() => {
      setTempoRestante(prev => Math.max(0, prev - 0.1));
    }, 100);

    return () => clearInterval(timer);
  }, [isPaused, tempoRestante]);

  // Não mostra o timer se estiver abaixo do nível mínimo ou já tiver o máximo de vidas bônus
  if (tempoRestante <= 0 || nivel < NIVEL_MIN_BONUS || vidasBonus >= MAX_VIDAS_BONUS) return null;

  return (
    <div className="bg-white/30 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg flex items-center gap-2">
      <div className="flex items-center gap-1">
        <span className="text-lg sm:text-base">💖</span>
        <span className="hidden sm:inline font-bold text-pink-600 text-sm">
          Bônus em:
        </span>
      </div>
      
      <div className="w-20 sm:w-24 h-3 sm:h-2.5 bg-white/50 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-100"
          style={{ width: `${porcentagem}%` }}
        />
      </div>
      
      <span className="font-bold text-purple-600 min-w-[2.25rem] text-right text-base sm:text-sm">
        {tempoRestante.toFixed(1)}s
      </span>
    </div>
  );
};

export default BonusTimer; 
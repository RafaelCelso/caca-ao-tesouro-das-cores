import { useState, useEffect } from 'react';
import GameArea from './components/GameArea';
import ScoreBoard from './components/ScoreBoard';
import useSound from 'use-sound';

// Lista de cores disponíveis no jogo
const CORES_DISPONIVEIS = [
  { nome: 'vermelho', hex: '#FF0000' },
  { nome: 'azul', hex: '#0000FF' },
  { nome: 'verde', hex: '#00FF00' },
  { nome: 'amarelo', hex: '#FFFF00' },
  { nome: 'roxo', hex: '#800080' },
  { nome: 'laranja', hex: '#FFA500' }
];

function App() {
  const [pontuacao, setPontuacao] = useState(0);
  const [nivel, setNivel] = useState(1);
  const [corAlvo, setCorAlvo] = useState(CORES_DISPONIVEIS[0]);
  const [objetosRestantes, setObjetosRestantes] = useState(0);
  const [melhorPontuacao, setMelhorPontuacao] = useState(
    parseInt(localStorage.getItem('melhorPontuacao')) || 0
  );

  // Inicializa o jogo
  useEffect(() => {
    iniciarNovaRodada();
  }, [nivel]);

  // Salva a melhor pontuação no localStorage
  useEffect(() => {
    if (pontuacao > melhorPontuacao) {
      setMelhorPontuacao(pontuacao);
      localStorage.setItem('melhorPontuacao', pontuacao.toString());
    }
  }, [pontuacao, melhorPontuacao]);

  const escolherNovaCorAlvo = () => {
    const coresDisponiveis = CORES_DISPONIVEIS.filter(cor => cor.nome !== corAlvo.nome);
    const indiceAleatorio = Math.floor(Math.random() * coresDisponiveis.length);
    return coresDisponiveis[indiceAleatorio];
  };

  const iniciarNovaRodada = () => {
    const novaCorAlvo = escolherNovaCorAlvo();
    setCorAlvo(novaCorAlvo);
    const numeroObjetosAlvo = Math.max(3, Math.floor((5 + nivel * 3) * 0.3));
    setObjetosRestantes(numeroObjetosAlvo);
  };

  const handleAcerto = () => {
    setPontuacao(prev => prev + 10);
    setObjetosRestantes(prev => {
      const novosObjetosRestantes = prev - 1;
      if (novosObjetosRestantes <= 0) {
        // Quando todos os objetos da cor foram encontrados
        setNivel(nivelAtual => nivelAtual + 1);
        return 0;
      }
      return novosObjetosRestantes;
    });
  };

  const handleErro = () => {
    if (pontuacao > 0) {
      setPontuacao(prev => Math.max(0, prev - 5));
    }
  };

  const reiniciarJogo = () => {
    setPontuacao(0);
    setNivel(1);
    setObjetosRestantes(0);
    iniciarNovaRodada();
  };

  return (
    <div className="h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-2 md:p-4 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        {/* Header com título e botão */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            🎨 Caça ao Tesouro das Cores
          </h1>
          <button
            onClick={reiniciarJogo}
            className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold rounded-full 
                     hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 
                     shadow-lg hover:shadow-xl"
          >
            🔄 Novo Jogo
          </button>
        </div>
        
        <ScoreBoard 
          pontuacao={pontuacao}
          nivel={nivel}
          corAlvo={corAlvo}
          melhorPontuacao={melhorPontuacao}
        />

        <div className="flex-1 min-h-0 flex items-center justify-center">
          <div className="w-full h-[calc(100vh-300px)] min-h-[350px] max-h-[500px]">
            <GameArea 
              nivel={nivel}
              corAlvo={corAlvo}
              onAcerto={handleAcerto}
              onErro={handleErro}
              coresDisponiveis={CORES_DISPONIVEIS}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

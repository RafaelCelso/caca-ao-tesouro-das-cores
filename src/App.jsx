import { useState, useEffect } from 'react';
import GameArea from './components/GameArea';
import ScoreBoard from './components/ScoreBoard';
import LevelUpMessage from './components/LevelUpMessage';
import SoundControl from './components/SoundControl';
import ProgressBar from './components/ProgressBar';
import ParticleExplosion from './components/ParticleExplosion';
import useSound from 'use-sound';
import { SOUND_URLS } from './config/sounds';

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
  const [objetosTotal, setObjetosTotal] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [explosions, setExplosions] = useState([]);
  const [melhorPontuacao, setMelhorPontuacao] = useState(
    parseInt(localStorage.getItem('melhorPontuacao')) || 0
  );

  // Configuração dos sons
  const [playAcerto] = useSound(SOUND_URLS.acerto, { 
    volume: 0.5,
    soundEnabled: !isMuted,
    interrupt: true
  });
  
  const [playErro] = useSound(SOUND_URLS.erro, { 
    volume: 0.3,
    soundEnabled: !isMuted,
    interrupt: true
  });
  
  const [playLevelUp] = useSound(SOUND_URLS.levelUp, { 
    volume: 0.5,
    soundEnabled: !isMuted,
    interrupt: true
  });

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
    setObjetosTotal(numeroObjetosAlvo);
  };

  const handleAcerto = (x, y) => {
    if (!isMuted) {
      try {
        playAcerto();
      } catch (error) {
        console.log('Erro ao tocar som de acerto:', error);
      }
    }

    // Adiciona explosão de partículas
    const newExplosion = {
      id: Date.now(),
      x,
      y,
      color: corAlvo.hex
    };
    setExplosions(prev => [...prev, newExplosion]);

    setPontuacao(prev => prev + 10);
    setObjetosRestantes(prev => {
      const novosObjetosRestantes = prev - 1;
      if (novosObjetosRestantes <= 0) {
        setNivel(nivelAtual => {
          setShowLevelUp(true);
          if (!isMuted) {
            try {
              playLevelUp();
            } catch (error) {
              console.log('Erro ao tocar som de level up:', error);
            }
          }
          return nivelAtual + 1;
        });
        return 0;
      }
      return novosObjetosRestantes;
    });
  };

  const handleErro = () => {
    if (!isMuted) {
      try {
        playErro();
      } catch (error) {
        console.log('Erro ao tocar som de erro:', error);
      }
    }
    
    // Ativa o efeito de erro
    setShowError(true);
    setTimeout(() => setShowError(false), 500);

    if (pontuacao > 0) {
      setPontuacao(prev => Math.max(0, prev - 5));
    }
  };

  const handleExplosionComplete = (id) => {
    setExplosions(prev => prev.filter(exp => exp.id !== id));
  };

  const reiniciarJogo = () => {
    setPontuacao(0);
    setNivel(1);
    setObjetosRestantes(0);
    setShowLevelUp(false);
    iniciarNovaRodada();
  };

  const handleSoundToggle = (muted) => {
    setIsMuted(muted);
    localStorage.setItem('isMuted', muted.toString());
  };

  // Carrega a preferência de som ao iniciar
  useEffect(() => {
    const mutedPreference = localStorage.getItem('isMuted');
    if (mutedPreference !== null) {
      setIsMuted(mutedPreference === 'true');
    }
  }, []);

  return (
    <div className={`h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-2 md:p-4 flex flex-col
                    ${showError ? 'animate-shake' : ''}`}>
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        {/* Header com título, botão de som e novo jogo */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            🎨 Caça ao Tesouro das Cores
          </h1>
          <div className="flex items-center gap-2">
            <SoundControl onToggle={handleSoundToggle} isMuted={isMuted} />
            <button
              onClick={reiniciarJogo}
              className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold rounded-full 
                       hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 
                       shadow-lg hover:shadow-xl"
            >
              🔄 Novo Jogo
            </button>
          </div>
        </div>
        
        <ScoreBoard 
          pontuacao={pontuacao}
          nivel={nivel}
          corAlvo={corAlvo}
          melhorPontuacao={melhorPontuacao}
        />

        <ProgressBar 
          objetosRestantes={objetosRestantes}
          objetosTotal={objetosTotal}
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

        {/* Explosões de partículas */}
        {explosions.map(explosion => (
          <ParticleExplosion
            key={explosion.id}
            x={explosion.x}
            y={explosion.y}
            color={explosion.color}
            onComplete={() => handleExplosionComplete(explosion.id)}
          />
        ))}

        {showLevelUp && (
          <LevelUpMessage 
            nivel={nivel} 
            onClose={() => setShowLevelUp(false)} 
          />
        )}

        {/* Flash de erro */}
        {showError && (
          <div className="fixed inset-0 bg-red-500 opacity-30 pointer-events-none animate-flash" />
        )}
      </div>
    </div>
  );
}

export default App;

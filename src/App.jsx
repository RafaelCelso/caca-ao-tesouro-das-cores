import { useState, useEffect } from 'react';
import GameArea from './components/GameArea';
import ScoreBoard from './components/ScoreBoard';
import LevelUpMessage from './components/LevelUpMessage';
import SoundControl from './components/SoundControl';
import ProgressBar from './components/ProgressBar';
import ParticleExplosion from './components/ParticleExplosion';
import Badges, { BADGES } from './components/Badges';
import DesafioDiario from './components/DesafioDiario';
import Vidas, { MAX_VIDAS } from './components/Vidas';
import ConquistaMessage from './components/ConquistaMessage';
import GameOverMessage from './components/GameOverMessage';
import BonusTimer from './components/BonusTimer';
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

const MAX_VIDAS_BONUS = 3;
const NIVEL_MIN_BONUS = 5;

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
  const [vidas, setVidas] = useState(MAX_VIDAS);
  const [vidasBonus, setVidasBonus] = useState(0);
  const [badges, setBadges] = useState(() => {
    const savedBadges = localStorage.getItem('badges');
    return savedBadges ? JSON.parse(savedBadges) : [];
  });
  const [melhorPontuacao, setMelhorPontuacao] = useState(
    parseInt(localStorage.getItem('melhorPontuacao')) || 0
  );
  const [showConquista, setShowConquista] = useState(null);
  const [tempoInicioNivel, setTempoInicioNivel] = useState(Date.now());
  const [errosNoNivel, setErrosNoNivel] = useState(0);
  const [niveisConsecutivosSemErro, setNiveisConsecutivosSemErro] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [timerPausado, setTimerPausado] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(10);

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

  const [playConquista] = useSound(SOUND_URLS.conquista, {
    volume: 0.5,
    soundEnabled: !isMuted,
    interrupt: true
  });

  // Inicializa o jogo
  useEffect(() => {
    iniciarNovaRodada();
    setTempoInicioNivel(Date.now());
    setErrosNoNivel(0);
  }, [nivel]);

  // Salva a melhor pontuação
  useEffect(() => {
    if (pontuacao > melhorPontuacao) {
      setMelhorPontuacao(pontuacao);
      localStorage.setItem('melhorPontuacao', pontuacao.toString());
    }
  }, [pontuacao, melhorPontuacao]);

  // Salva as conquistas
  useEffect(() => {
    localStorage.setItem('badges', JSON.stringify(badges));
  }, [badges]);

  // Verifica conquistas
  useEffect(() => {
    const novasBadges = [...badges];
    let novaConquista = null;

    // Iniciante - primeiro nível
    if (nivel >= 2 && !badges.includes('iniciante')) {
      novasBadges.push('iniciante');
      novaConquista = BADGES.iniciante;
    }

    // Mestre das Cores - nível 10
    if (nivel >= 10 && !badges.includes('mestre')) {
      novasBadges.push('mestre');
      novaConquista = BADGES.mestre;
    }

    // Precisão - 15 níveis consecutivos sem erros
    if (niveisConsecutivosSemErro >= 15 && !badges.includes('precisao')) {
      novasBadges.push('precisao');
      novaConquista = BADGES.precisao;
    }

    // Persistente - verifica dias jogados
    const diasJogados = localStorage.getItem('diasJogados');
    if (diasJogados) {
      const dias = JSON.parse(diasJogados);
      if (dias.length >= 5 && !badges.includes('persistente')) {
        novasBadges.push('persistente');
        novaConquista = BADGES.persistente;
      }
    }

    if (novasBadges.length > badges.length) {
      setBadges(novasBadges);
      setShowConquista(novaConquista);
      if (!isMuted) {
        try {
          playConquista();
        } catch (error) {
          console.log('Erro ao tocar som de conquista:', error);
        }
      }
    }
  }, [nivel, niveisConsecutivosSemErro, badges, isMuted, playConquista]);

  // Registra dia jogado
  useEffect(() => {
    const hoje = new Date().toDateString();
    const diasJogados = JSON.parse(localStorage.getItem('diasJogados') || '[]');
    if (!diasJogados.includes(hoje)) {
      diasJogados.push(hoje);
      localStorage.setItem('diasJogados', JSON.stringify(diasJogados));
    }
  }, []);

  // Pausa o timer quando há mensagens na tela
  useEffect(() => {
    setTimerPausado(showLevelUp || showConquista);
  }, [showLevelUp, showConquista]);

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

  const handleDesafioCompleto = (recompensa) => {
    setPontuacao(prev => prev + recompensa);
  };

  const verificarDesafios = () => {
    const desafioSalvo = localStorage.getItem('desafioDiario');
    if (!desafioSalvo) return;

    const { desafio } = JSON.parse(desafioSalvo);
    let progresso = 0;

    switch (desafio.id) {
      case 1: // Complete 3 níveis sem errar
        if (errosNoNivel === 0) {
          setNiveisConsecutivosSemErro(prev => {
            const novosNiveisConsecutivosSemErro = prev + 1;
            progresso = (novosNiveisConsecutivosSemErro / 3) * 100;
            return novosNiveisConsecutivosSemErro;
          });
        }
        break;

      case 2: // Alcance 100 pontos em um único nível
        progresso = (pontuacao / 100) * 100;
        break;

      case 3: // Complete um nível em menos de 15 segundos
        const tempoNivel = (Date.now() - tempoInicioNivel) / 1000;
        if (tempoNivel <= 15) {
          progresso = 100;
        }
        break;
    }

    return progresso;
  };

  const handleAcerto = (x, y) => {
    if (!isMuted) {
      try {
        playAcerto();
      } catch (error) {
        console.log('Erro ao tocar som de acerto:', error);
      }
    }

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
        const tempoNivel = (Date.now() - tempoInicioNivel) / 1000;
        setTempoRestante(0);
        
        setNivel(nivelAtual => {
          setShowLevelUp(true);
          if (!isMuted) {
            try {
              playLevelUp();
            } catch (error) {
              console.log('Erro ao tocar som de level up:', error);
            }
          }
          if (errosNoNivel === 0) {
            setNiveisConsecutivosSemErro(prev => prev + 1);
            if (tempoNivel < 10 && nivelAtual >= NIVEL_MIN_BONUS && vidasBonus < MAX_VIDAS_BONUS) {
              setVidasBonus(prev => prev + 1);
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
    
    setShowError(true);
    setTimeout(() => setShowError(false), 500);

    setErrosNoNivel(prev => prev + 1);
    setNiveisConsecutivosSemErro(0);

    if (vidasBonus > 0) {
      setVidasBonus(prev => prev - 1);
    } else {
      setVidas(prev => {
        const novasVidas = prev - 1;
        if (novasVidas <= 0) {
          setShowGameOver(true);
        }
        return Math.max(0, novasVidas);
      });
    }

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
    setVidas(MAX_VIDAS);
    setVidasBonus(0);
    setErrosNoNivel(0);
    setNiveisConsecutivosSemErro(0);
    setTempoInicioNivel(Date.now());
    setShowGameOver(false);
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

  // Atualiza o tempo restante quando inicia um novo nível
  useEffect(() => {
    if (tempoInicioNivel) {
      const tempoPassado = (Date.now() - tempoInicioNivel) / 1000;
      setTempoRestante(Math.max(0, 10 - tempoPassado));
    }
  }, [tempoInicioNivel]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-2 md:p-4 flex flex-col
                    ${showError ? 'animate-shake' : ''}`}>
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        {/* Header com título, som e novo jogo */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            🎨 Caça ao Tesouro das Cores
          </h1>
          <div className="flex items-center gap-4">
            <SoundControl onToggle={handleSoundToggle} isMuted={isMuted} />
            <button
              onClick={reiniciarJogo}
              className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold rounded-full 
                       hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 
                       shadow-lg hover:shadow-xl"
            >
               Novo Jogo
            </button>
          </div>
        </div>

        <Badges conquistados={badges} />
        <DesafioDiario 
          onComplete={handleDesafioCompleto}
          pontuacao={pontuacao}
          nivel={nivel}
          errosNoNivel={errosNoNivel}
          niveisConsecutivosSemErro={niveisConsecutivosSemErro}
          tempoInicioNivel={tempoInicioNivel}
        />
        
        <ScoreBoard 
          pontuacao={pontuacao}
          nivel={nivel}
          corAlvo={corAlvo}
          melhorPontuacao={melhorPontuacao}
          niveisConsecutivosSemErro={niveisConsecutivosSemErro}
        />

        <ProgressBar 
          objetosRestantes={objetosRestantes}
          objetosTotal={objetosTotal}
        />

        {/* Área de vidas */}
        <div className="mb-4 flex justify-end items-center gap-4">
          {tempoRestante > 0 && !showGameOver && (
            <div className="transform hover:scale-105 transition-transform">
              <BonusTimer 
                tempoInicial={tempoInicioNivel}
                isPaused={timerPausado}
                nivel={nivel}
                vidasBonus={vidasBonus}
              />
            </div>
          )}
          <div className="transform hover:scale-105 transition-transform">
            <Vidas vidas={vidas} vidasBonus={vidasBonus} />
          </div>
        </div>

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

        {showConquista && (
          <ConquistaMessage
            badge={showConquista}
            onClose={() => setShowConquista(null)}
          />
        )}

        {showGameOver && (
          <GameOverMessage
            pontuacao={pontuacao}
            melhorPontuacao={melhorPontuacao}
            onJogarNovamente={reiniciarJogo}
          />
        )}

        {showError && (
          <div className="fixed inset-0 bg-red-500 opacity-30 pointer-events-none animate-flash" />
        )}
      </div>
    </div>
  );
}

export default App;

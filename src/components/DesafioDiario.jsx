import { useState, useEffect } from 'react';

const DESAFIOS = [
  {
    id: 1,
    descricao: 'Complete 3 níveis sem errar',
    recompensa: 50,
    icone: '🎯'
  },
  {
    id: 2,
    descricao: 'Alcance 100 pontos em um único nível',
    recompensa: 30,
    icone: '⭐'
  },
  {
    id: 3,
    descricao: 'Complete um nível em menos de 15 segundos',
    recompensa: 40,
    icone: '⚡'
  }
];

const DesafioDiario = ({ 
  onComplete, 
  pontuacao, 
  nivel, 
  errosNoNivel, 
  niveisPerfeitos,
  tempoInicioNivel 
}) => {
  const [desafioAtual, setDesafioAtual] = useState(null);
  const [progresso, setProgresso] = useState(0);
  const [completado, setCompletado] = useState(false);

  useEffect(() => {
    // Verifica se já existe um desafio salvo para hoje
    const hoje = new Date().toDateString();
    const desafioSalvo = localStorage.getItem('desafioDiario');
    
    if (desafioSalvo) {
      const { data, desafio, progresso, completado } = JSON.parse(desafioSalvo);
      if (data === hoje) {
        setDesafioAtual(desafio);
        setProgresso(progresso);
        setCompletado(completado);
        return;
      }
    }

    // Gera um novo desafio aleatório
    const novoDesafio = DESAFIOS[Math.floor(Math.random() * DESAFIOS.length)];
    setDesafioAtual(novoDesafio);
    setProgresso(0);
    setCompletado(false);

    // Salva o novo desafio
    localStorage.setItem('desafioDiario', JSON.stringify({
      data: hoje,
      desafio: novoDesafio,
      progresso: 0,
      completado: false
    }));
  }, []);

  useEffect(() => {
    if (!desafioAtual || completado) return;

    let novoProgresso = 0;

    switch (desafioAtual.id) {
      case 1: // Complete 3 níveis sem errar
        novoProgresso = Math.min(100, (niveisPerfeitos / 3) * 100);
        break;

      case 2: // Alcance 100 pontos em um único nível
        novoProgresso = Math.min(100, (pontuacao / 100) * 100);
        break;

      case 3: // Complete um nível em menos de 15 segundos
        const tempoNivel = (Date.now() - tempoInicioNivel) / 1000;
        if (tempoNivel <= 15) {
          novoProgresso = 100;
        }
        break;
    }

    if (novoProgresso !== progresso) {
      setProgresso(novoProgresso);
      
      // Salva o progresso
      const desafioSalvo = JSON.parse(localStorage.getItem('desafioDiario'));
      localStorage.setItem('desafioDiario', JSON.stringify({
        ...desafioSalvo,
        progresso: novoProgresso
      }));

      // Verifica se completou
      if (novoProgresso >= 100 && !completado) {
        setCompletado(true);
        onComplete?.(desafioAtual.recompensa);
        localStorage.setItem('desafioDiario', JSON.stringify({
          ...desafioSalvo,
          progresso: 100,
          completado: true
        }));
      }
    }
  }, [desafioAtual, completado, pontuacao, nivel, errosNoNivel, niveisPerfeitos, tempoInicioNivel]);

  if (!desafioAtual) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
      <h2 className="text-xl font-bold mb-3 text-purple-600">Desafio Diário ✨</h2>
      <div className="flex items-center gap-4">
        <div className="text-4xl">{desafioAtual.icone}</div>
        <div className="flex-1">
          <p className="font-medium mb-2">{desafioAtual.descricao}</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progresso}%` }}
            />
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Recompensa</div>
          <div className="font-bold text-purple-600">+{desafioAtual.recompensa} 🌟</div>
        </div>
      </div>
      {completado && (
        <div className="mt-3 text-center text-green-600 font-bold">
          Desafio Completado! 🎉
        </div>
      )}
    </div>
  );
};

export default DesafioDiario; 
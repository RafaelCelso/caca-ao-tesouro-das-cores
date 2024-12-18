import { useState, useEffect, useRef } from 'react';
import ObjectItem from './ObjectItem';

const GameArea = ({ nivel, corAlvo, onAcerto, onErro, coresDisponiveis }) => {
  const [objetos, setObjetos] = useState([]);
  const objetosRef = useRef(new Map());
  const gameAreaRef = useRef(null);

  const handleObjectClick = (objeto, event) => {
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;

    if (objeto.cor.nome === corAlvo.nome) {
      onAcerto(x, y);
      objetosRef.current.delete(objeto.id);
      setObjetos(prevObjetos => prevObjetos.filter(obj => obj.id !== objeto.id));
    } else {
      onErro();
    }
  };

  const gerarPosicaoAleatoria = () => {
    // Gera posições aleatórias mantendo distância das bordas
    return {
      top: 20 + Math.random() * 60, // Entre 20% e 80% da altura
      left: 20 + Math.random() * 60  // Entre 20% e 80% da largura
    };
  };

  useEffect(() => {
    const numeroObjetos = 5 + nivel * 3;
    const objetosCorAlvo = Math.max(3, Math.floor(numeroObjetos * 0.3));
    const outrosObjetos = numeroObjetos - objetosCorAlvo;

    const novosObjetos = [];

    // Adiciona objetos da cor alvo
    for (let i = 0; i < objetosCorAlvo; i++) {
      novosObjetos.push({
        id: `alvo-${i}`,
        cor: corAlvo,
        posicao: gerarPosicaoAleatoria()
      });
    }

    // Adiciona objetos de outras cores
    const outrasCores = coresDisponiveis.filter(cor => cor.nome !== corAlvo.nome);
    for (let i = 0; i < outrosObjetos; i++) {
      const corAleatoria = outrasCores[Math.floor(Math.random() * outrasCores.length)];
      novosObjetos.push({
        id: `outro-${i}`,
        cor: corAleatoria,
        posicao: gerarPosicaoAleatoria()
      });
    }

    // Embaralha os objetos
    const objetosEmbaralhados = novosObjetos.sort(() => Math.random() - 0.5);
    setObjetos(objetosEmbaralhados);
    objetosRef.current = new Map();
  }, [nivel, corAlvo]);

  const updateObjectPosition = (id, position, velocidade) => {
    objetosRef.current.set(id, { position, velocidade });
  };

  return (
    <div 
      ref={gameAreaRef}
      className="w-full h-full relative bg-white/50 rounded-3xl shadow-lg backdrop-blur-sm overflow-hidden"
    >
      {objetos.map(objeto => (
        <ObjectItem
          key={objeto.id}
          objeto={objeto}
          nivel={nivel}
          onClick={(event) => handleObjectClick(objeto, event)}
          objetosRef={objetosRef}
          updateObjectPosition={updateObjectPosition}
        />
      ))}
    </div>
  );
};

export default GameArea; 
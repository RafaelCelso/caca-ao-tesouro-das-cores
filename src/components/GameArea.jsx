import { useState, useEffect, useRef } from 'react';
import ObjectItem from './ObjectItem';

const GameArea = ({ nivel, corAlvo, onAcerto, onErro, coresDisponiveis }) => {
  const [objetos, setObjetos] = useState([]);
  const objetosRef = useRef(new Map());

  useEffect(() => {
    if (corAlvo) {
      gerarObjetos();
    }
  }, [nivel, corAlvo]);

  const gerarObjetos = () => {
    const numeroObjetos = 5 + nivel * 3;
    const novosObjetos = [];

    // Garante que pelo menos 3 objetos sejam da cor alvo
    const objetosCorAlvo = Math.max(3, Math.floor(numeroObjetos * 0.3));

    // Gera objetos da cor alvo
    for (let i = 0; i < objetosCorAlvo; i++) {
      novosObjetos.push({
        id: `objeto-${i}`,
        cor: corAlvo,
        posicao: gerarPosicaoAleatoria()
      });
    }

    // Gera objetos de outras cores
    for (let i = objetosCorAlvo; i < numeroObjetos; i++) {
      const coresDisponiveis2 = coresDisponiveis.filter(cor => cor.nome !== corAlvo.nome);
      const corAleatoria = coresDisponiveis2[Math.floor(Math.random() * coresDisponiveis2.length)];
      novosObjetos.push({
        id: `objeto-${i}`,
        cor: corAleatoria,
        posicao: gerarPosicaoAleatoria()
      });
    }

    // Embaralha os objetos
    setObjetos(novosObjetos.sort(() => Math.random() - 0.5));
  };

  const gerarPosicaoAleatoria = () => {
    return {
      top: 15 + Math.random() * 70,
      left: 15 + Math.random() * 70
    };
  };

  const handleClick = (objeto) => {
    if (objeto.cor.nome === corAlvo.nome) {
      onAcerto();
      objetosRef.current.delete(objeto.id);
      setObjetos(objetos.filter(obj => obj.id !== objeto.id));
    } else {
      onErro();
    }
  };

  // Verifica colisão entre dois objetos
  const checkCollision = (pos1, pos2, size1, size2) => {
    const dx = pos1.left - pos2.left;
    const dy = pos1.top - pos2.top;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = (size1 + size2) / 100; // Converte pixels para porcentagem
    return distance < minDistance;
  };

  // Atualiza a posição de um objeto no Map
  const updateObjectPosition = (id, position, direction) => {
    const objAtual = objetosRef.current.get(id);
    if (objAtual) {
      objAtual.position = position;
      objAtual.direction = direction;

      // Verifica colisão com outros objetos
      objetosRef.current.forEach((outroObj, outroId) => {
        if (id !== outroId) {
          const size1 = Math.max(35, 70 - nivel * 2);
          const size2 = Math.max(35, 70 - nivel * 2);
          
          if (checkCollision(position, outroObj.position, size1, size2)) {
            // Troca as direções dos objetos que colidiram
            const tempX = objAtual.direction.x;
            const tempY = objAtual.direction.y;
            
            objAtual.direction.x = outroObj.direction.x;
            objAtual.direction.y = outroObj.direction.y;
            
            outroObj.direction.x = tempX;
            outroObj.direction.y = tempY;
          }
        }
      });
    }
  };

  if (!corAlvo) return null;

  return (
    <div className="w-full h-full bg-white rounded-xl shadow-lg overflow-hidden relative">
      {objetos.map((objeto) => (
        <ObjectItem
          key={objeto.id}
          objeto={objeto}
          onClick={() => handleClick(objeto)}
          nivel={nivel}
          objetosRef={objetosRef}
          updateObjectPosition={updateObjectPosition}
        />
      ))}
    </div>
  );
};

export default GameArea; 
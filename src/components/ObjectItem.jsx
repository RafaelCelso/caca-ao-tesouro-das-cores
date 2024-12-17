import { useState, useEffect, useRef } from 'react';

const ObjectItem = ({ objeto, onClick, nivel, objetosRef, updateObjectPosition }) => {
  const [animating, setAnimating] = useState(false);
  
  // Define a forma do objeto uma única vez
  const forma = useRef({
    shape: ['rounded-full', 'rounded-lg', 'rounded-3xl'][Math.floor(Math.random() * 3)],
    shadow: 'shadow-lg'
  });

  const [position, setPosition] = useState({
    top: objeto.posicao.top,
    left: objeto.posicao.left
  });

  const direction = useRef({
    x: (Math.random() * 2 - 1) * 0.4, // Velocidade inicial muito maior
    y: (Math.random() * 2 - 1) * 0.4
  });

  // Velocidade base significativamente aumentada
  const speed = useRef(0.2 + Math.random() * 0.1);
  const tamanho = Math.max(35, 70 - nivel * 2);

  // Registra o objeto no Map de referências
  useEffect(() => {
    objetosRef.current.set(objeto.id, {
      position,
      direction: direction.current
    });
    return () => {
      objetosRef.current.delete(objeto.id);
    };
  }, []);

  useEffect(() => {
    let lastTime = performance.now();
    let frameId;
    
    const animate = (currentTime) => {
      const deltaTime = Math.min((currentTime - lastTime) / 16, 1.5);
      lastTime = currentTime;

      setPosition(currentPos => {
        let newX = currentPos.left;
        let newY = currentPos.top;

        // Movimento suavizado com deltaTime
        newX += direction.current.x * speed.current * deltaTime;
        newY += direction.current.y * speed.current * deltaTime;

        // Colisão com as bordas mantendo mais velocidade
        if (newX <= 15 || newX >= 85) {
          direction.current.x *= -0.95; // Mantém mais velocidade após colisão
          newX = Math.max(15, Math.min(85, newX));
        }
        if (newY <= 15 || newY >= 85) {
          direction.current.y *= -0.95; // Mantém mais velocidade após colisão
          newY = Math.max(15, Math.min(85, newY));
        }

        const newPosition = {
          top: newY,
          left: newX
        };

        // Atualiza a posição no sistema de colisão
        updateObjectPosition(objeto.id, newPosition, direction.current);

        return newPosition;
      });

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [objeto.id, updateObjectPosition]);

  const handleClick = () => {
    setAnimating(true);
    onClick();
  };

  useEffect(() => {
    if (animating) {
      const timer = setTimeout(() => setAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [animating]);

  return (
    <div
      className={`absolute cursor-pointer transition-transform duration-100 
        ${forma.current.shape} ${forma.current.shadow}
        ${animating ? 'scale-110 brightness-110' : 'hover:scale-105 hover:brightness-105'}
        transform-gpu`}
      style={{
        width: `${tamanho}px`,
        height: `${tamanho}px`,
        backgroundColor: objeto.cor.hex,
        top: `${position.top}%`,
        left: `${position.left}%`,
        transform: `translate(-50%, -50%)`,
        boxShadow: `0 4px 12px rgba(0,0,0,0.15), 
                    inset 0 -4px 4px rgba(0,0,0,0.1), 
                    inset 0 4px 4px rgba(255,255,255,0.3)`,
        willChange: 'transform, left, top',
      }}
      onClick={handleClick}
    >
      <div 
        className="absolute inset-0 rounded-full opacity-50"
        style={{
          background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)`
        }}
      />
    </div>
  );
};

export default ObjectItem; 
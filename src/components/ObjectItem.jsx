import { useState, useEffect, useRef } from 'react';

const ObjectItem = ({ objeto, onClick, nivel, objetosRef, updateObjectPosition }) => {
  const [animating, setAnimating] = useState(false);
  
  const forma = useRef({
    shape: ['rounded-full', 'rounded-lg', 'rounded-3xl'][Math.floor(Math.random() * 3)],
    shadow: 'shadow-lg'
  });

  const [position, setPosition] = useState({
    top: objeto.posicao.top,
    left: objeto.posicao.left
  });

  const velocidade = useRef({
    x: (Math.random() > 0.5 ? 1 : -1) * (0.3 + Math.random() * 0.3),
    y: (Math.random() > 0.5 ? 1 : -1) * (0.3 + Math.random() * 0.3)
  });

  const tamanho = Math.max(35, 70 - nivel * 2);

  useEffect(() => {
    const moveObject = () => {
      setPosition(currentPos => {
        let newX = currentPos.left + velocidade.current.x;
        let newY = currentPos.top + velocidade.current.y;

        if (newX <= 5 || newX >= 95) {
          velocidade.current.x *= -1;
          newX = Math.max(5, Math.min(95, newX));
        }
        if (newY <= 5 || newY >= 95) {
          velocidade.current.y *= -1;
          newY = Math.max(5, Math.min(95, newY));
        }

        const newPosition = { top: newY, left: newX };
        updateObjectPosition(objeto.id, newPosition, velocidade.current);
        return newPosition;
      });
    };

    const intervalId = setInterval(moveObject, 33);

    return () => clearInterval(intervalId);
  }, [objeto.id, updateObjectPosition]);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnimating(true);
    onClick(event);
  };

  useEffect(() => {
    if (animating) {
      const timer = setTimeout(() => setAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [animating]);

  return (
    <div
      className={`absolute cursor-pointer transition-all duration-50 ease-linear
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
        zIndex: animating ? 10 : 1
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
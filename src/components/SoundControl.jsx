import { useState } from 'react';

const SoundControl = ({ onToggle, isMuted }) => {
  const handleToggle = () => {
    onToggle(!isMuted);
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-full hover:bg-purple-100 transition-colors"
      title={isMuted ? "Ativar Som" : "Desativar Som"}
    >
      {isMuted ? (
        <span className="text-xl">🔇</span>
      ) : (
        <span className="text-xl">🔊</span>
      )}
    </button>
  );
};

export default SoundControl; 
import React from 'react';

const PulseLine: React.FC = () => {
  return (
    <div className="pulse-line-container h-12 my-4">
      <svg className="pulse-line-svg w-full h-full" viewBox="0 0 300 60" preserveAspectRatio="none">
        <path 
          className="pulse-line-path" 
          d="M0,30 L20,30 L30,30 L40,15 L50,45 L60,30 L70,30 L80,30 L90,30 L100,30 L110,15 L120,45 L130,30 L140,30 L150,30 L160,30 L170,30 L180,15 L190,45 L200,30 L210,30 L220,30 L230,30 L240,30 L250,15 L260,45 L270,30 L280,30 L300,30"
        />
      </svg>
    </div>
  );
};

export default PulseLine;

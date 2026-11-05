import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'horizontal' | 'icon';
}

/**
 * Logotipo oficial aprobado de echtagro:
 * Extraído directamente del manual de marca original (echtagro_logo_31_octubre_original_297ab8c2.png).
 * Contiene el texto con "echt" en negrita y "agro" en peso regular geométrico,
 * y la opción del ícono de la app con la "e" estilizada.
 */
export const EchtAgroLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'horizontal',
}) => {
  const [imageError, setImageError] = useState(false);

  // Dimensiones para la versión horizontal oficial
  const heightClasses = {
    sm: 'h-6 sm:h-7',
    md: 'h-7 sm:h-8',
    lg: 'h-9 sm:h-10',
  };

  // Dimensiones para el ícono de la app con la "e" estilizada
  const iconSizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <img
          src="/assets/echtagro_icon.png"
          alt="echtagro ícono"
          className={`${iconSizeClasses[size]} object-contain rounded-xl`}
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      {!imageError ? (
        <img
          src="/assets/echtagro_logo.png"
          alt="echtagro"
          className={`${heightClasses[size]} w-auto object-contain`}
          onError={() => setImageError(true)}
        />
      ) : (
        /* Respaldo tipográfico idéntico al manual de marca: echt (bold) + agro (regular) */
        <span className="text-xl sm:text-2xl tracking-tight text-[#111827] leading-none">
          <strong className="font-extrabold font-sans">echt</strong>
          <span className="font-normal font-sans">agro</span>
        </span>
      )}
    </div>
  );
};

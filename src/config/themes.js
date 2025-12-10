// Définition des thèmes disponibles
export const THEMES = {
  blue: {
    name: 'Blue',
    colors: {
      primary: '#00AAE4',
      secondary: '#0099CC',
      accent: '#00DDFF',
      gradient: 'from-[#00AAE4] to-[#0099CC]',
      hover: 'hover:border-[#00AAE4]/50 hover:bg-[#00AAE4]/10 hover:text-[#00AAE4]',
      bg: 'bg-[#00AAE4]/10',
      border: 'border-[#00AAE4]',
      text: 'text-[#00AAE4]',
      shadow: 'shadow-[#00AAE4]/30'
    }
  },
  red: {
    name: 'Red',
    colors: {
      primary: '#EF4444',
      secondary: '#DC2626',
      accent: '#F87171',
      gradient: 'from-red-500 to-red-600',
      hover: 'hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500',
      text: 'text-red-400',
      shadow: 'shadow-red-500/30'
    }
  },
  green: {
    name: 'Green',
    colors: {
      primary: '#10B981',
      secondary: '#059669',
      accent: '#34D399',
      gradient: 'from-green-500 to-emerald-600',
      hover: 'hover:border-green-500/50 hover:bg-green-500/10 hover:text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500',
      text: 'text-green-400',
      shadow: 'shadow-green-500/30'
    }
  },
  yellow: {
    name: 'Yellow',
    colors: {
      primary: '#F59E0B',
      secondary: '#D97706',
      accent: '#FBBF24',
      gradient: 'from-yellow-500 to-amber-600',
      hover: 'hover:border-yellow-500/50 hover:bg-yellow-500/10 hover:text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500',
      text: 'text-yellow-400',
      shadow: 'shadow-yellow-500/30'
    }
  },
  orange: {
    name: 'Orange',
    colors: {
      primary: '#F97316',
      secondary: '#EA580C',
      accent: '#FB923C',
      gradient: 'from-orange-500 to-orange-600',
      hover: 'hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500',
      text: 'text-orange-400',
      shadow: 'shadow-orange-500/30'
    }
  },
  purple: {
    name: 'Purple',
    colors: {
      primary: '#8B5CF6',
      secondary: '#7C3AED',
      accent: '#A78BFA',
      gradient: 'from-purple-500 to-violet-600',
      hover: 'hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500',
      text: 'text-purple-400',
      shadow: 'shadow-purple-500/30'
    }
  },
  pink: {
    name: 'Pink',
    colors: {
      primary: '#EC4899',
      secondary: '#DB2777',
      accent: '#F472B6',
      gradient: 'from-pink-500 to-rose-600',
      hover: 'hover:border-pink-500/50 hover:bg-pink-500/10 hover:text-pink-400',
      bg: 'bg-pink-500/10',
      border: 'border-pink-500',
      text: 'text-pink-400',
      shadow: 'shadow-pink-500/30'
    }
  },
  cyan: {
    name: 'Cyan',
    colors: {
      primary: '#06B6D4',
      secondary: '#0891B2',
      accent: '#22D3EE',
      gradient: 'from-cyan-500 to-sky-600',
      hover: 'hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500',
      text: 'text-cyan-400',
      shadow: 'shadow-cyan-500/30'
    }
  },
  gray: {
    name: 'Gray',
    colors: {
      primary: '#6B7280',
      secondary: '#4B5563',
      accent: '#9CA3AF',
      gradient: 'from-gray-500 to-slate-600',
      hover: 'hover:border-gray-500/50 hover:bg-gray-500/10 hover:text-gray-400',
      bg: 'bg-gray-500/10',
      border: 'border-gray-500',
      text: 'text-gray-400',
      shadow: 'shadow-gray-500/30'
    }
  },
  white: {
    name: 'White',
    colors: {
      primary: '#F3F4F6',
      secondary: '#E5E7EB',
      accent: '#FFFFFF',
      gradient: 'from-gray-100 to-slate-200',
      hover: 'hover:border-gray-300/50 hover:bg-gray-300/10 hover:text-gray-200',
      bg: 'bg-white/10',
      border: 'border-white',
      text: 'text-white',
      shadow: 'shadow-white/30'
    }
  }
};

// Fonction pour obtenir le thème d'un créateur
export const getCreatorTheme = (creator) => {
  if (!creator?.theme) {
    return THEMES.blue; // Thème par défaut
  }

  const themeName = creator.theme.name || 'blue';
  
  // Si custom, créer un thème dynamique
  if (themeName === 'custom' && creator.theme.customColor) {
    const customColor = creator.theme.customColor;
    return {
      name: 'Custom',
      colors: {
        primary: customColor,
        secondary: customColor,
        accent: customColor,
        gradient: `from-[${customColor}] to-[${customColor}]`,
        hover: `hover:border-[${customColor}]/50 hover:bg-[${customColor}]/10`,
        bg: `bg-[${customColor}]/10`,
        border: `border-[${customColor}]`,
        text: `text-[${customColor}]`,
        shadow: `shadow-[${customColor}]/30`
      },
      customColor
    };
  }

  return THEMES[themeName] || THEMES.blue;
};

// Hook React pour utiliser le thème
export const useCreatorTheme = (creator) => {
  return getCreatorTheme(creator);
};
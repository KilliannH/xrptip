import { useState } from 'react';
import { THEMES } from '../config/themes';
import { useTranslation } from 'react-i18next';

export const ThemeSelector = ({ value, onChange }) => {
  const { t } = useTranslation();
  const [customColor, setCustomColor] = useState(value?.customColor || '#00AAE4');

  const handleThemeChange = (themeName) => {
    if (themeName === 'custom') {
      onChange({ name: 'custom', customColor });
    } else {
      onChange({ name: themeName, customColor: null });
    }
  };

  const handleCustomColorChange = (color) => {
    setCustomColor(color);
    if (value?.name === 'custom') {
      onChange({ name: 'custom', customColor: color });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white/80 mb-3">
          {t('dashboard.theme.title')} 🎨
        </label>
        <p className="text-xs text-white/50 mb-4">
          {t('dashboard.theme.description')}
        </p>
      </div>

      {/* Grille de thèmes */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {Object.entries(THEMES).map(([key, theme]) => {
          const isSelected = value?.name === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleThemeChange(key)}
              className={`
                group relative rounded-xl border-2 p-4 transition-all
                ${isSelected 
                  ? `${theme.colors.border} ${theme.colors.bg} shadow-lg ${theme.colors.shadow}`
                  : 'border-white/10 hover:border-white/30'
                }
              `}
            >
              {/* Badge de sélection */}
              {isSelected && (
                <div className={`absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full ${theme.colors.gradient} shadow-lg`}>
                  <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Aperçu de couleur */}
              <div className={`mx-auto mb-2 h-12 w-12 rounded-lg bg-gradient-to-br ${theme.colors.gradient} shadow-lg`} />
              
              {/* Nom */}
              <div className="text-center">
                <p className={`text-xs font-medium ${isSelected ? theme.colors.text : 'text-white/60'}`}>
                  {theme.name}
                </p>
              </div>
            </button>
          );
        })}

        {/* Option Custom */}
        <button
          type="button"
          onClick={() => handleThemeChange('custom')}
          className={`
            group relative rounded-xl border-2 p-4 transition-all
            ${value?.name === 'custom'
              ? 'border-white bg-white/10 shadow-lg shadow-white/30'
              : 'border-white/10 hover:border-white/30'
            }
          `}
        >
          {value?.name === 'custom' && (
            <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-white to-gray-300 shadow-lg">
              <svg className="h-4 w-4 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}

          <div 
            className="mx-auto mb-2 h-12 w-12 rounded-lg shadow-lg"
            style={{ 
              background: `linear-gradient(135deg, ${customColor} 0%, ${customColor}CC 100%)`
            }}
          />
          
          <div className="text-center">
            <p className="text-lg mb-1">🎨</p>
            <p className={`text-xs font-medium ${value?.name === 'custom' ? 'text-white' : 'text-white/60'}`}>
              Custom
            </p>
          </div>
        </button>
      </div>

      {/* Custom Color Picker */}
      {value?.name === 'custom' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 rounded-xl border border-white/20 bg-white/5 p-4">
          <label className="block text-sm font-medium text-white/80 mb-2">
            {t('dashboard.theme.customColor')}
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={customColor}
              onChange={(e) => handleCustomColorChange(e.target.value)}
              className="h-12 w-20 cursor-pointer rounded-lg border border-white/20"
            />
            <input
              type="text"
              value={customColor}
              onChange={(e) => {
                const color = e.target.value;
                if (/^#[0-9A-F]{0,6}$/i.test(color)) {
                  handleCustomColorChange(color);
                }
              }}
              placeholder="#00AAE4"
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm uppercase outline-none transition-all focus:border-white/30 focus:bg-white/10"
              maxLength={7}
            />
          </div>
          <p className="mt-2 text-xs text-white/50">
            {t('dashboard.theme.customColorHint')}
          </p>
        </div>
      )}

      {/* Preview */}
      <div className="rounded-xl border border-white/20 bg-white/5 p-4">
        <p className="text-xs font-medium text-white/60 mb-3">
          {t('dashboard.theme.preview')}
        </p>
        <div className="space-y-2">
          {/* Button preview */}
          <button
            type="button"
            className={`w-full rounded-xl px-4 py-3 font-semibold transition-all ${
              value?.name === 'custom'
                ? `bg-gradient-to-r shadow-lg`
                : `bg-gradient-to-r ${THEMES[value?.name || 'blue'].colors.gradient} shadow-lg ${THEMES[value?.name || 'blue'].colors.shadow}`
            }`}
            style={value?.name === 'custom' ? {
              background: `linear-gradient(to right, ${customColor}, ${customColor}DD)`,
              boxShadow: `0 10px 25px -5px ${customColor}4D`
            } : {}}
          >
            <span className="text-white">{t('dashboard.theme.previewButton')}</span>
          </button>

          {/* Badge preview */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                value?.name === 'custom'
                  ? 'text-white'
                  : `${THEMES[value?.name || 'blue'].colors.bg} ${THEMES[value?.name || 'blue'].colors.text}`
              }`}
              style={value?.name === 'custom' ? {
                backgroundColor: `${customColor}1A`,
                color: customColor
              } : {}}
            >
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {t('dashboard.theme.previewBadge')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
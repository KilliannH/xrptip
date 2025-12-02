import { useTranslation } from 'react-i18next';

export const FeeBreakdown = ({ amount, fee, total }) => {
  const { t } = useTranslation();
  
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
      <p className="text-xs font-semibold text-white/80 mb-3">{t('feeBreakdown.title')}</p>
      
      {/* Montant pour le créateur */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/60">{t('feeBreakdown.forCreator')}</span>
        <span className="font-medium text-white">{amount.toFixed(2)} XRP</span>
      </div>
      
      {/* Frais de plateforme */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/60">{t('feeBreakdown.platformFee')}</span>
        <span className="font-medium text-white/70">{fee.toFixed(2)} XRP</span>
      </div>
      
      {/* Séparateur */}
      <div className="border-t border-white/10 pt-2 mt-2">
        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-white">{t('feeBreakdown.totalToPay')}</span>
          <span className="text-lg font-bold text-xrpBlue">{total.toFixed(2)} XRP</span>
        </div>
      </div>
      
      <p className="text-xs text-white/50 italic mt-2">
        {t('feeBreakdown.hint')}
      </p>
    </div>
  );
};
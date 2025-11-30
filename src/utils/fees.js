// Configuration des frais de la plateforme xrpTip
export const FEE_CONFIG = {
  // Pourcentage des frais (5% = 0.05)
  feePercentage: 0.05, // 5%
  
  // Adresse XRP du wallet intermédiaire de la plateforme
  // TOUS les paiements passent par cette adresse
  // Le backend redistribue ensuite au créateur (montant - frais)
  platformWalletAddress: 'rNDoLghX4eCZj82RX8f6QdPGVFQC9bCiCZ', // TODO: Mettre votre adresse XRP
  
  // Montant minimum pour appliquer les frais (en XRP)
  minAmountForFees: 1,
  
  // Frais minimum (en XRP)
  minFee: 0.1,
  
  // Frais maximum (en XRP) - optionnel
  maxFee: null, // null = pas de limite
};

/**
 * Calculer les frais pour un montant donné
 * @param {number} amount - Montant du tip en XRP
 * @returns {object} { amount, fee, total, platformAmount, creatorAmount }
 */
export const calculateFees = (amount) => {
  const numAmount = Number(amount);
  
  if (isNaN(numAmount) || numAmount <= 0) {
    return {
      amount: 0,
      fee: 0,
      total: 0,
      platformAmount: 0,
      creatorAmount: 0
    };
  }

  // Pas de frais si montant trop petit
  if (numAmount < FEE_CONFIG.minAmountForFees) {
    return {
      amount: numAmount,
      fee: 0,
      total: numAmount,
      platformAmount: 0,
      creatorAmount: numAmount
    };
  }

  // Calculer les frais
  let fee = numAmount * FEE_CONFIG.feePercentage;
  
  // Appliquer frais minimum
  if (fee < FEE_CONFIG.minFee) {
    fee = FEE_CONFIG.minFee;
  }
  
  // Appliquer frais maximum si défini
  if (FEE_CONFIG.maxFee !== null && fee > FEE_CONFIG.maxFee) {
    fee = FEE_CONFIG.maxFee;
  }

  // Arrondir à 2 décimales
  fee = Math.round(fee * 100) / 100;
  
  const total = numAmount + fee;
  const creatorAmount = numAmount;
  const platformAmount = fee;

  return {
    amount: numAmount,        // Montant pour le créateur
    fee: platformAmount,      // Frais de la plateforme
    total: total,             // Total à payer au wallet intermédiaire
    platformAmount: platformAmount, // Pour la plateforme
    creatorAmount: creatorAmount    // Pour le créateur
  };
};

/**
 * Formater les montants pour l'affichage
 * @param {object} feeBreakdown - Résultat de calculateFees()
 * @returns {object} Montants formatés
 */
export const formatFeeBreakdown = (feeBreakdown) => {
  return {
    amount: `${feeBreakdown.amount.toFixed(2)} XRP`,
    fee: `${feeBreakdown.fee.toFixed(2)} XRP`,
    total: `${feeBreakdown.total.toFixed(2)} XRP`,
    platformAmount: `${feeBreakdown.platformAmount.toFixed(2)} XRP`,
    creatorAmount: `${feeBreakdown.creatorAmount.toFixed(2)} XRP`,
    feePercentage: `${(FEE_CONFIG.feePercentage * 100).toFixed(1)}%`
  };
};
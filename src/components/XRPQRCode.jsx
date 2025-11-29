import { QRCodeSVG } from 'qrcode.react';

/**
 * Composant pour générer un QR code de paiement XRP
 * @param {string} address - Adresse XRP du destinataire
 * @param {number} amount - Montant en XRP (optionnel)
 * @param {number} size - Taille du QR code en pixels (défaut: 256)
 * @param {string} destinationTag - Tag de destination (optionnel)
 */
export const XRPQRCode = ({ 
  address, 
  amount, 
  size = 256,
  destinationTag,
  className = ""
}) => {
  if (!address) {
    return null;
  }

  // Construire l'URI de paiement XRP
  // Format: ripple:ADDRESS?amount=AMOUNT&dt=DESTINATION_TAG
  let paymentURI = `ripple:${address}`;
  const params = [];

  if (amount && amount > 0) {
    params.push(`amount=${amount}`);
  }

  if (destinationTag) {
    params.push(`dt=${destinationTag}`);
  }

  if (params.length > 0) {
    paymentURI += '?' + params.join('&');
  }

  return (
    <div className={`inline-block rounded-2xl bg-white p-4 shadow-lg ${className}`}>
      <QRCodeSVG
        value={paymentURI}
        size={size}
        level="H" // Niveau de correction d'erreur élevé
        includeMargin={true}
      />
    </div>
  );
};
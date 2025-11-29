/**
 * Télécharger un QR code en PNG
 * @param {string} qrCodeId - ID de l'élément SVG du QR code
 * @param {string} filename - Nom du fichier à télécharger
 */
export const downloadQRCode = (qrCodeId, filename = 'xrp-payment-qr.png') => {
  const svg = document.getElementById(qrCodeId);
  if (!svg) {
    console.error('QR Code SVG not found');
    return;
  }

  const svgData = new XMLSerializer().serializeToString(svg);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();

  // Taille du canvas (haute résolution pour impression)
  canvas.width = 1024;
  canvas.height = 1024;

  img.onload = () => {
    // Fond blanc
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Dessiner le QR code
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // Télécharger
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = filename;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
};

/**
 * Partager le QR code via l'API Web Share (mobile)
 * @param {string} qrCodeId - ID de l'élément SVG du QR code
 * @param {Object} shareData - Données à partager (title, text)
 */
export const shareQRCode = async (qrCodeId, shareData = {}) => {
  // Vérifier si l'API Web Share est disponible
  if (!navigator.share) {
    console.warn('Web Share API not supported');
    return false;
  }

  const svg = document.getElementById(qrCodeId);
  if (!svg) {
    console.error('QR Code SVG not found');
    return false;
  }

  try {
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 512;
    canvas.height = 512;

    return new Promise((resolve, reject) => {
      img.onload = async () => {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
          try {
            const file = new File([blob], 'xrp-payment-qr.png', { type: 'image/png' });
            
            await navigator.share({
              title: shareData.title || 'XRP Payment QR Code',
              text: shareData.text || 'Scanne ce QR code pour envoyer des XRP',
              files: [file]
            });
            
            resolve(true);
          } catch (error) {
            console.error('Error sharing:', error);
            reject(error);
          }
        }, 'image/png');
      };

      img.onerror = reject;
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    });
  } catch (error) {
    console.error('Error in shareQRCode:', error);
    return false;
  }
};

/**
 * Copier l'image du QR code dans le presse-papier
 * @param {string} qrCodeId - ID de l'élément SVG du QR code
 */
export const copyQRCodeToClipboard = async (qrCodeId) => {
  // Vérifier si l'API Clipboard est disponible
  if (!navigator.clipboard || !navigator.clipboard.write) {
    console.warn('Clipboard API not supported');
    return false;
  }

  const svg = document.getElementById(qrCodeId);
  if (!svg) {
    console.error('QR Code SVG not found');
    return false;
  }

  try {
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 512;
    canvas.height = 512;

    return new Promise((resolve, reject) => {
      img.onload = async () => {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({
                'image/png': blob
              })
            ]);
            resolve(true);
          } catch (error) {
            console.error('Error copying to clipboard:', error);
            reject(error);
          }
        }, 'image/png');
      };

      img.onerror = reject;
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    });
  } catch (error) {
    console.error('Error in copyQRCodeToClipboard:', error);
    return false;
  }
};

/**
 * Générer un URI de paiement XRP
 * @param {string} address - Adresse XRP
 * @param {number} amount - Montant en XRP
 * @param {string} destinationTag - Tag de destination (optionnel)
 * @returns {string} URI de paiement
 */
export const generateXRPPaymentURI = (address, amount, destinationTag = null) => {
  let uri = `ripple:${address}`;
  const params = [];

  if (amount && amount > 0) {
    params.push(`amount=${amount}`);
  }

  if (destinationTag) {
    params.push(`dt=${destinationTag}`);
  }

  if (params.length > 0) {
    uri += '?' + params.join('&');
  }

  return uri;
};

/**
 * Ouvrir un wallet XRP avec le paiement pré-rempli (deep link)
 * @param {string} address - Adresse XRP
 * @param {number} amount - Montant en XRP
 * @param {string} wallet - Type de wallet ('xaman', 'crossmark', 'gem')
 */
export const openWalletWithPayment = (address, amount, wallet = 'xaman') => {
  const paymentURI = generateXRPPaymentURI(address, amount);

  const walletDeepLinks = {
    xaman: `xumm://xumm.app/sign?tx=${encodeURIComponent(JSON.stringify({
      TransactionType: 'Payment',
      Destination: address,
      Amount: String(amount * 1000000) // Convertir en drops
    }))}`,
    // Xaman utilise aussi le format ripple: directement
    xamanSimple: paymentURI,
    // Autres wallets peuvent être ajoutés ici
  };

  const deepLink = walletDeepLinks[wallet] || paymentURI;
  
  // Ouvrir le deep link
  window.location.href = deepLink;
};
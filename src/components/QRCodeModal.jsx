import { QRCodeSVG } from 'qrcode.react';
import { useState, useEffect } from 'react';

export const QRCodeModal = ({ isOpen, onClose, creator, amount }) => {
  const [copied, setCopied] = useState(false);

  // Bloquer le scroll du body quand la modale est ouverte
  useEffect(() => {
    if (isOpen) {
      // Sauvegarder la position actuelle du scroll
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restaurer le scroll
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    // Cleanup au démontage
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Construire le payload XRP
  // Format: ripple:ADDRESS?amount=AMOUNT&dt=DESTINATION_TAG
  const xrpPaymentURI = `ripple:${creator.xrpAddress}?amount=${amount}`;

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(creator.xrpAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const handleDownloadQR = () => {
    // Récupérer le SVG du QR code
    const svg = document.getElementById('payment-qr-code');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 512;
    canvas.height = 512;

    img.onload = () => {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `xrptip-${creator.username}-${amount}XRP.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal - Scrollable */}
      <div className="relative z-10 w-full max-w-md my-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-xrpDark to-black shadow-2xl">
        {/* Header - Fixed */}
        <div className="border-b border-white/10 bg-gradient-to-r from-xrpBlue/20 to-cyan-500/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
              <svg className="h-6 w-6 text-xrpBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <span>Scanne pour payer</span>
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto p-6 space-y-6">
          {/* Creator Info */}
          <div className="text-center">
            <p className="text-sm text-white/60">Envoyer un tip à</p>
            <p className="mt-1 text-xl font-bold text-white">{creator.displayName}</p>
            <p className="text-sm text-white/50">@{creator.username}</p>
          </div>

          {/* Amount */}
          <div className="rounded-2xl border border-xrpBlue/30 bg-gradient-to-br from-xrpBlue/20 to-cyan-500/10 p-4 text-center">
            <p className="text-sm text-white/60">Montant</p>
            <p className="text-4xl font-bold text-xrpBlue">{amount} XRP</p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center">
            <div className="rounded-2xl bg-white p-4 shadow-xl">
              <QRCodeSVG
                id="payment-qr-code"
                value={xrpPaymentURI}
                size={240}
                level="H"
                includeMargin={true}
                imageSettings={{
                  src: "/xrp-logo.png", // Optionnel: ajouter le logo XRP au centre
                  height: 40,
                  width: 40,
                  excavate: true,
                }}
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="mb-2 text-sm font-semibold text-white">
                📱 Scanne avec ton wallet XRP
              </p>
              <p className="text-xs text-white/60">
                Utilise Xaman (XUMM), Crossmark ou tout autre wallet compatible pour scanner ce QR code.
              </p>
            </div>

            {/* XRP Address */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="mb-2 text-xs font-semibold text-white/80">
                Ou copie l'adresse manuellement :
              </p>
              <div className="flex items-center gap-2 rounded-lg bg-black/40 p-3">
                <code className="flex-1 truncate text-xs text-white/70">
                  {creator.xrpAddress}
                </code>
                <button
                  onClick={handleCopyAddress}
                  className="shrink-0 rounded-lg bg-white/10 p-2 transition-all hover:bg-xrpBlue/20 hover:text-xrpBlue"
                  title="Copier l'adresse"
                >
                  {copied ? (
                    <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleDownloadQR}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-all hover:border-xrpBlue/50 hover:bg-xrpBlue/10 hover:text-xrpBlue"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Télécharger
              </span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 rounded-xl bg-gradient-to-r from-xrpBlue to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-xrpBlue/30 transition-all hover:shadow-xl hover:shadow-xrpBlue/50 hover:scale-105"
            >
              Fermer
            </button>
          </div>

          {/* Warning */}
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3">
            <p className="flex items-start gap-2 text-xs text-yellow-200">
              <svg className="h-4 w-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>
                Vérifie toujours l'adresse de destination avant de confirmer la transaction. Les transactions XRP sont irréversibles.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
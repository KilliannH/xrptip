import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const WidgetGenerator = ({ username }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [size, setSize] = useState('medium'); // small, medium, large

  const sizeConfigs = {
    small: { width: 280, height: 80 },
    medium: { width: 350, height: 100 },
    large: { width: 450, height: 120 }
  };

  const widgetUrl = `${window.location.origin}/widget/${username}`;
  
  const iframeCode = `<iframe src="${widgetUrl}" width="${sizeConfigs[size].width}" height="${sizeConfigs[size].height}" frameborder="0" scrolling="no" allowtransparency="true" style="border: none;"></iframe>`;

  const obsCode = widgetUrl;

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!username) {
    return (
      <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
        <p className="text-sm text-yellow-200">
          ⚠️ {t('widget.saveProfileFirst')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-white">{t('widget.preview')}</h3>
        <div className="rounded-xl border border-white/10 bg-black/40 p-6 flex items-center justify-center">
          <iframe
            src={widgetUrl}
            width={sizeConfigs[size].width}
            height={sizeConfigs[size].height}
            frameBorder="0"
            scrolling="no"
            allowtransparency="true"
            style={{ border: 'none' }}
          />
        </div>
      </div>

      {/* Size Selection */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-white">{t('widget.size')}</h3>
        <div className="flex gap-3">
          {['small', 'medium', 'large'].map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                size === s
                  ? 'border-xrpBlue bg-xrpBlue/20 text-xrpBlue'
                  : 'border-white/10 bg-white/5 text-white/70 hover:border-xrpBlue/50 hover:text-white'
              }`}
            >
              {t(`widget.sizes.${s}`)}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-white/50">
          {sizeConfigs[size].width}x{sizeConfigs[size].height}px
        </p>
      </div>

      {/* Twitch / OBS Instructions */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-white">{t('widget.integration')}</h3>
        
        {/* OBS Studio */}
        <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20">
              <svg className="h-5 w-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
            </div>
            <span className="font-semibold text-purple-300">OBS Studio</span>
          </div>
          
          <ol className="space-y-2 text-sm text-purple-200/80">
            <li className="flex gap-2">
              <span className="font-bold">1.</span>
              <span>{t('widget.obs.step1')}</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">2.</span>
              <span>{t('widget.obs.step2')}</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">3.</span>
              <span>{t('widget.obs.step3')}</span>
            </li>
          </ol>

          <div className="mt-4">
            <div className="flex items-center justify-between rounded-lg bg-black/40 p-3">
              <code className="flex-1 truncate text-xs text-purple-200">{obsCode}</code>
              <button
                onClick={() => handleCopy(obsCode, 'obs')}
                className="ml-2 rounded-lg bg-purple-500/20 p-2 transition-all hover:bg-purple-500/30"
              >
                {copied === 'obs' ? (
                  <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Twitch Extension / Panels */}
        <div className="rounded-xl border border-purple-400/30 bg-purple-400/10 p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-400/20">
              <svg className="h-5 w-5 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
              </svg>
            </div>
            <span className="font-semibold text-purple-200">Twitch Panel</span>
          </div>
          
          <p className="mb-3 text-sm text-purple-200/80">
            {t('widget.twitch.description')}
          </p>

          <div className="mt-4">
            <label className="mb-2 block text-xs font-medium text-purple-200">
              {t('widget.twitch.iframeCode')}
            </label>
            <div className="flex items-start gap-2 rounded-lg bg-black/40 p-3">
              <code className="flex-1 text-xs text-purple-200 break-all">{iframeCode}</code>
              <button
                onClick={() => handleCopy(iframeCode, 'iframe')}
                className="shrink-0 rounded-lg bg-purple-400/20 p-2 transition-all hover:bg-purple-400/30"
              >
                {copied === 'iframe' ? (
                  <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Direct Link */}
        <div className="rounded-xl border border-xrpBlue/30 bg-xrpBlue/10 p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-xrpBlue/20">
              <svg className="h-5 w-5 text-xrpBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <span className="font-semibold text-xrpBlue">{t('widget.directLink')}</span>
          </div>
          
          <p className="mb-3 text-sm text-white/70">
            {t('widget.directLink.description')}
          </p>

          <div className="flex items-center gap-2 rounded-lg bg-black/40 p-3">
            <code className="flex-1 truncate text-xs text-xrpBlue">
              {window.location.origin}/u/{username}
            </code>
            <button
              onClick={() => handleCopy(`${window.location.origin}/u/${username}`, 'link')}
              className="shrink-0 rounded-lg bg-xrpBlue/20 p-2 transition-all hover:bg-xrpBlue/30"
            >
              {copied === 'link' ? (
                <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-4 w-4 text-xrpBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { creatorsAPI } from "../api";
import { useAuth } from "../contexts/AuthContext";
import { ImageUpload } from "./ImageUpload";

export const ProfileForm = ({ onUsernameChange }) => {
  const { t } = useTranslation();
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    displayName: "",
    bio: "",
    xrpAddress: "",
    twitterUrl: "",
    twitchUrl: "",
    youtubeUrl: "",
    tiktokUrl: "",
    avatarUrl: "",
    bannerUrl: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [existingCreator, setExistingCreator] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const [uploadError, setUploadError] = useState("");

  // Charger le profil créateur existant au montage
  useEffect(() => {
    loadCreatorProfile();
  }, []);

  const loadCreatorProfile = async () => {
    try {
      setIsLoadingProfile(true);
      const response = await creatorsAPI.getMyProfile();
      
      // Profil trouvé - pré-remplir le formulaire
      const creator = response.data;
      setExistingCreator(creator);
      console.log(existingCreator);
      setFormData({
        username: creator.username || "",
        displayName: creator.displayName || "",
        bio: creator.bio || "",
        xrpAddress: creator.xrpAddress || "",
        twitterUrl: creator.links?.twitter || "",
        twitchUrl: creator.links?.twitch || "",
        youtubeUrl: creator.links?.youtube || "",
        tiktokUrl: creator.links?.tiktok || "",
        avatarUrl: creator.avatarUrl || "",
        bannerUrl: creator.bannerUrl || "",
      });
      
      // Définir les previews
      if (creator.avatarUrl) setAvatarPreview(creator.avatarUrl);
      if (creator.bannerUrl) setBannerPreview(creator.bannerUrl);
      
      // Notifier le parent (Dashboard) du username
      if (onUsernameChange && creator.username) {
        onUsernameChange(creator.username);
      }
    } catch (error) {
      // Pas de profil créateur - c'est normal pour un nouveau créateur
      console.log('Aucun profil créateur trouvé, création d\'un nouveau');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Notifier le parent si c'est le username qui change
    if (name === 'username' && onUsernameChange) {
      onUsernameChange(value);
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setSuccessMessage("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = t('creator.form.errors.usernameRequired');
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username = t('creator.form.errors.usernameInvalid');
    }

    if (!formData.displayName.trim()) {
      newErrors.displayName = t('creator.form.errors.displayNameRequired');
    }

    if (!formData.bio.trim()) {
      newErrors.bio = t('creator.form.errors.bioRequired');
    } else if (formData.bio.length > 200) {
      newErrors.bio = t('creator.form.errors.bioTooLong');
    }

    if (!formData.xrpAddress.trim()) {
      newErrors.xrpAddress = t('creator.form.errors.xrpAddressRequired');
    } else if (!formData.xrpAddress.startsWith("r")) {
      newErrors.xrpAddress = t('creator.form.errors.xrpAddressInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage("");

    try {
      // Préparer les données pour l'API
      const payload = {
        username: formData.username,
        displayName: formData.displayName,
        bio: formData.bio,
        xrpAddress: formData.xrpAddress,
        avatarUrl: formData.avatarUrl,
        bannerUrl: formData.bannerUrl,
        links: {
          twitter: formData.twitterUrl,
          twitch: formData.twitchUrl,
          youtube: formData.youtubeUrl,
          tiktok: formData.tiktokUrl,
        },
      };

      let response;

      if (existingCreator) {
        // Mise à jour du profil existant
        response = await creatorsAPI.update(existingCreator.username, payload);
        setSuccessMessage(t('creator.form.success.profileUpdated'));
      } else {
        // Création d'un nouveau profil
        response = await creatorsAPI.create(payload);
        setSuccessMessage(t('creator.form.success.profileCreated'));
        setExistingCreator(response.data);
      }

      console.log("Profil sauvegardé:", response);
      
      // Rafraîchir les données utilisateur pour mettre à jour le rôle
      await refreshUser();
      
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      
      // Gérer les erreurs spécifiques
      if (error.status === 409) {
        if (error.data?.existingCreator) {
          setErrors({ 
            general: t('creator.form.errors.alreadyHasProfile', { 
              username: error.data.existingCreator.username 
            })
          });
        } else {
          setErrors({ username: t('creator.form.errors.usernameTaken') });
        }
      } else if (error.status === 403) {
        setErrors({ general: t('creator.form.errors.notAuthorized') });
      } else if (error.data?.errors) {
        // Erreurs de validation du backend
        const backendErrors = {};
        error.data.errors.forEach((err) => {
          const field = err.path || err.param;
          backendErrors[field] = err.msg;
        });
        setErrors(backendErrors);
      } else {
        setErrors({ general: error.message || t('creator.form.errors.saveFailed') });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Loading State */}
      {isLoadingProfile && (
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="spinner" />
            <span className="text-sm text-white/60">{t('creator.form.loadingProfile')}</span>
          </div>
        </div>
      )}

      {/* Existing Creator Info */}
      {existingCreator && (
        <div className="rounded-xl border border-xrpBlue/30 bg-xrpBlue/10 px-4 py-3">
          <div className="flex items-start gap-2">
            <svg className="h-5 w-5 shrink-0 text-xrpBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-semibold text-xrpBlue">{t('creator.form.editMode')}</p>
              <p className="mt-1 text-xs text-white/70">
                {t('creator.form.editingProfile', { username: existingCreator.username })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {/* General Error */}
      {errors.general && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errors.general}</span>
          </div>
        </div>
      )}

      {/* Username */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-white/80 mb-2">
          {t('creator.form.username')} <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <span className="text-white/40">@</span>
          </div>
          <input
            type="text"
            id="username"
            name="username"
            disabled={!!existingCreator}
            value={formData.username}
            onChange={handleChange}
            placeholder="cryptoartist"
            className={`w-full rounded-xl border bg-white/5 px-4 py-3 pl-8 text-white placeholder:text-white/40 transition-all focus:outline-none focus:ring-2 ${
              errors.username
                ? "border-red-500/50 focus:ring-red-500/50"
                : "border-white/10 focus:border-xrpBlue/50 focus:ring-xrpBlue/50"
            } ${existingCreator ? 'opacity-60 cursor-not-allowed' : ''}`}
          />
        </div>
        {errors.username && (
          <p className="mt-1 text-xs text-red-400">{errors.username}</p>
        )}
        <p className="mt-1 text-xs text-white/50">
          {t('creator.form.urlPreview', { username: formData.username || 'username' })}
        </p>
      </div>

      {/* Display Name */}
      <div>
        <label htmlFor="displayName" className="block text-sm font-medium text-white/80 mb-2">
          {t('creator.form.displayName')} <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          id="displayName"
          name="displayName"
          value={formData.displayName}
          onChange={handleChange}
          placeholder="CryptoArtist"
          className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-white placeholder:text-white/40 transition-all focus:outline-none focus:ring-2 ${
            errors.displayName
              ? "border-red-500/50 focus:ring-red-500/50"
              : "border-white/10 focus:border-xrpBlue/50 focus:ring-xrpBlue/50"
          }`}
        />
        {errors.displayName && (
          <p className="mt-1 text-xs text-red-400">{errors.displayName}</p>
        )}
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-white/80 mb-2">
          {t('creator.form.bio')} <span className="text-red-400">*</span>
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder={t('creator.form.placeholders.bio')}
          rows={3}
          maxLength={200}
          className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-white placeholder:text-white/40 transition-all focus:outline-none focus:ring-2 resize-none ${
            errors.bio
              ? "border-red-500/50 focus:ring-red-500/50"
              : "border-white/10 focus:border-xrpBlue/50 focus:ring-xrpBlue/50"
          }`}
        />
        <div className="mt-1 flex items-center justify-between">
          {errors.bio ? (
            <p className="text-xs text-red-400">{errors.bio}</p>
          ) : (
            <span />
          )}
          <p className="text-xs text-white/50">
            {t('creator.form.bioMaxLength', { current: formData.bio.length, max: 200 })}
          </p>
        </div>
      </div>

      {/* Photo de profil */}
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          {t('creator.form.avatar')}
        </label>
        <ImageUpload
          type="avatar"
          currentImage={formData.avatarUrl}
          onUploadSuccess={(url) => {
            setFormData(prev => ({ ...prev, avatarUrl: url }));
            setAvatarPreview(url);
            setUploadError("");
          }}
          onUploadError={(error) => {
            setUploadError(error);
          }}
        />
        {uploadError && (
          <p className="mt-2 text-sm text-red-400">{uploadError}</p>
        )}
      </div>

      {/* Bannière */}
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          {t('creator.form.banner')}
        </label>
        <ImageUpload
          type="banner"
          currentImage={formData.bannerUrl}
          onUploadSuccess={(url) => {
            setFormData(prev => ({ ...prev, bannerUrl: url }));
            setBannerPreview(url);
            setUploadError("");
          }}
          onUploadError={(error) => {
            setUploadError(error);
          }}
        />
      </div>

      {/* XRP Address */}
      <div>
        <label htmlFor="xrpAddress" className="block text-sm font-medium text-white/80 mb-2">
          {t('creator.form.xrpAddress')} <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          id="xrpAddress"
          name="xrpAddress"
          value={formData.xrpAddress}
          onChange={handleChange}
          placeholder="rXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
          className={`w-full rounded-xl border bg-white/5 px-4 py-3 font-mono text-sm text-white placeholder:text-white/40 transition-all focus:outline-none focus:ring-2 ${
            errors.xrpAddress
              ? "border-red-500/50 focus:ring-red-500/50"
              : "border-white/10 focus:border-xrpBlue/50 focus:ring-xrpBlue/50"
          }`}
        />
        {errors.xrpAddress && (
          <p className="mt-1 text-xs text-red-400">{errors.xrpAddress}</p>
        )}
        <p className="mt-1 text-xs text-white/50">
          {t('creator.form.tipsWillBeSent')}
        </p>
      </div>

      {/* Social Links */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-white/80">{t('creator.form.socialLinks')}</h3>
        
        {/* Twitter */}
        <div>
          <label htmlFor="twitterUrl" className="block text-xs text-white/60 mb-2">
            X / Twitter
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg className="h-4 w-4 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
            <input
              type="url"
              id="twitterUrl"
              name="twitterUrl"
              value={formData.twitterUrl}
              onChange={handleChange}
              placeholder="https://x.com/username"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-10 text-white placeholder:text-white/40 transition-all focus:outline-none focus:ring-2 focus:border-xrpBlue/50 focus:ring-xrpBlue/50"
            />
          </div>
        </div>

        {/* YouTube */}
        <div>
          <label htmlFor="youtubeUrl" className="block text-xs text-white/60 mb-2">
            YouTube
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg className="h-4 w-4 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <input
              type="url"
              id="youtubeUrl"
              name="youtubeUrl"
              value={formData.youtubeUrl}
              onChange={handleChange}
              placeholder="https://youtube.com/@username"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-10 text-white placeholder:text-white/40 transition-all focus:outline-none focus:ring-2 focus:border-xrpBlue/50 focus:ring-xrpBlue/50"
            />
          </div>
        </div>

        {/* TikTok */}
        <div>
          <label htmlFor="tiktokUrl" className="block text-xs text-white/60 mb-2">
            TikTok
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg className="h-4 w-4 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </div>
            <input
              type="url"
              id="tiktokUrl"
              name="tiktokUrl"
              value={formData.tiktokUrl}
              onChange={handleChange}
              placeholder="https://tiktok.com/@username"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-10 text-white placeholder:text-white/40 transition-all focus:outline-none focus:ring-2 focus:border-xrpBlue/50 focus:ring-xrpBlue/50"
            />
          </div>
        </div>

        {/* Twitch */}
        <div>
          <label htmlFor="twitchUrl" className="block text-xs text-white/60 mb-2">
            Twitch
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg className="h-4 w-4 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
              </svg>
            </div>
            <input
              type="url"
              id="twitchUrl"
              name="twitchUrl"
              value={formData.twitchUrl}
              onChange={handleChange}
              placeholder="https://twitch.tv/username"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-10 text-white placeholder:text-white/40 transition-all focus:outline-none focus:ring-2 focus:border-xrpBlue/50 focus:ring-xrpBlue/50"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 group relative overflow-hidden rounded-xl bg-gradient-to-r from-xrpBlue to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg shadow-xrpBlue/30 transition-all hover:shadow-xl hover:shadow-xrpBlue/50 disabled:cursor-not-allowed disabled:opacity-50 hover:enabled:scale-[1.02]"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <div className="spinner" />
                <span>{t('creator.form.saving')}</span>
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('creator.form.saveProfile')}</span>
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-xrpBlue opacity-0 transition-opacity group-hover:opacity-100" />
        </button>

        <button
          type="button"
          onClick={() => {
            if (confirm(t('creator.form.confirmCancel'))) {
              loadCreatorProfile();
            }
          }}
          className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition-all hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
        >
          {t('common.cancel')}
        </button>
      </div>
    </form>
  );
};
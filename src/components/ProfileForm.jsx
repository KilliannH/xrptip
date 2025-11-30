import { useState, useEffect } from "react";
import { creatorsAPI } from "../api";
import { useAuth } from "../contexts/AuthContext";

export const ProfileForm = ({ onUsernameChange }) => {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    displayName: "",
    bio: "",
    xrpAddress: "",
    twitterUrl: "",
    twitchUrl: "",
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
      setFormData({
        username: creator.username || "",
        displayName: creator.displayName || "",
        bio: creator.bio || "",
        xrpAddress: creator.xrpAddress || "",
        twitterUrl: creator.links?.twitter || "",
        twitchUrl: creator.links?.twitch || "",
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
      newErrors.username = "Le nom d'utilisateur est requis";
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username = "Uniquement lettres, chiffres, - et _";
    }

    if (!formData.displayName.trim()) {
      newErrors.displayName = "Le nom d'affichage est requis";
    }

    if (!formData.bio.trim()) {
      newErrors.bio = "La bio est requise";
    } else if (formData.bio.length > 200) {
      newErrors.bio = "Maximum 200 caractères";
    }

    if (!formData.xrpAddress.trim()) {
      newErrors.xrpAddress = "L'adresse XRP est requise";
    } else if (!formData.xrpAddress.startsWith("r")) {
      newErrors.xrpAddress = "L'adresse XRP doit commencer par 'r'";
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
        },
      };

      let response;

      if (existingCreator) {
        // Mise à jour du profil existant
        response = await creatorsAPI.update(existingCreator.username, payload);
        setSuccessMessage("Profil mis à jour avec succès ! 🎉");
      } else {
        // Création d'un nouveau profil
        response = await creatorsAPI.create(payload);
        setSuccessMessage("Profil créé avec succès ! 🎉");
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
            general: `Vous avez déjà un profil créateur : @${error.data.existingCreator.username}` 
          });
        } else {
          setErrors({ username: "Ce nom d'utilisateur est déjà pris" });
        }
      } else if (error.status === 403) {
        setErrors({ general: "Vous n'êtes pas autorisé à modifier ce profil" });
      } else if (error.data?.errors) {
        // Erreurs de validation du backend
        const backendErrors = {};
        error.data.errors.forEach((err) => {
          const field = err.path || err.param;
          backendErrors[field] = err.msg;
        });
        setErrors(backendErrors);
      } else {
        setErrors({ general: error.message || "Erreur lors de la sauvegarde du profil" });
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
            <span className="text-sm text-white/60">Chargement du profil...</span>
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
              <p className="text-sm font-semibold text-xrpBlue">Mode édition</p>
              <p className="mt-1 text-xs text-white/70">
                Vous modifiez votre profil créateur existant : <strong>@{existingCreator.username}</strong>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {/* General Error Message */}
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
          Nom d'utilisateur <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <span className="text-white/40">@</span>
          </div>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="cryptoartist"
            className={`w-full rounded-xl border bg-white/5 px-4 py-3 pl-8 text-white placeholder:text-white/40 transition-all focus:outline-none focus:ring-2 ${
              errors.username
                ? "border-red-500/50 focus:ring-red-500/50"
                : "border-white/10 focus:border-xrpBlue/50 focus:ring-xrpBlue/50"
            }`}
          />
        </div>
        {errors.username && (
          <p className="mt-1 text-xs text-red-400">{errors.username}</p>
        )}
        <p className="mt-1 text-xs text-white/50">
          Votre URL sera : xrptip.com/u/{formData.username || "username"}
        </p>
      </div>

      {/* Display Name */}
      <div>
        <label htmlFor="displayName" className="block text-sm font-medium text-white/80 mb-2">
          Nom d'affichage <span className="text-red-400">*</span>
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
          Bio <span className="text-red-400">*</span>
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Illustrateur digital & créateur de NFT sur XRPL."
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
            {formData.bio.length}/200
          </p>
        </div>
      </div>

      {/* Photo de profil */}
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          Photo de profil
        </label>
        <div className="flex items-start gap-4">
          {/* Preview */}
          <div className="shrink-0">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-white/10 bg-white/5">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="h-full w-full object-cover"
                  onError={() => setAvatarPreview("")}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <svg className="h-12 w-12 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* URL Input */}
          <div className="flex-1">
            <input
              type="url"
              id="avatarUrl"
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={(e) => {
                handleChange(e);
                setAvatarPreview(e.target.value);
              }}
              placeholder="https://exemple.com/avatar.jpg"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 transition-all focus:outline-none focus:border-xrpBlue/50 focus:ring-2 focus:ring-xrpBlue/50"
            />
            <p className="mt-2 text-xs text-white/50">
              💡 URL de votre photo de profil (format: .jpg, .png, .gif, .webp)
            </p>
          </div>
        </div>
      </div>

      {/* Bannière */}
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          Bannière
        </label>
        <div className="space-y-4">
          {/* Preview */}
          <div className="relative h-40 w-full overflow-hidden rounded-xl border-2 border-white/10 bg-white/5">
            {bannerPreview ? (
              <img
                src={bannerPreview}
                alt="Banner preview"
                className="h-full w-full object-cover"
                onError={() => setBannerPreview("")}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <svg className="h-16 w-16 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* URL Input */}
          <div>
            <input
              type="url"
              id="bannerUrl"
              name="bannerUrl"
              value={formData.bannerUrl}
              onChange={(e) => {
                handleChange(e);
                setBannerPreview(e.target.value);
              }}
              placeholder="https://exemple.com/banner.jpg"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 transition-all focus:outline-none focus:border-xrpBlue/50 focus:ring-2 focus:ring-xrpBlue/50"
            />
            <p className="mt-2 text-xs text-white/50">
              💡 URL de votre bannière (recommandé: 1500x500px, format: .jpg, .png, .webp)
            </p>
          </div>
        </div>
      </div>

      {/* XRP Address */}
      <div>
        <label htmlFor="xrpAddress" className="block text-sm font-medium text-white/80 mb-2">
          Adresse XRP <span className="text-red-400">*</span>
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
          Les tips seront envoyés à cette adresse
        </p>
      </div>

      {/* Social Links */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-white/80">Liens sociaux (optionnel)</h3>
        
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
                <span>Sauvegarde en cours...</span>
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Sauvegarder le profil</span>
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-xrpBlue opacity-0 transition-opacity group-hover:opacity-100" />
        </button>

        <button
          type="button"
          onClick={() => {
            if (confirm("Êtes-vous sûr de vouloir annuler ? Les modifications seront perdues.")) {
              setFormData({
                username: "",
                displayName: "",
                bio: "",
                xrpAddress: "",
                twitterUrl: "",
                twitchUrl: "",
                avatarUrl: "",
              });
              setErrors({});
            }
          }}
          className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition-all hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
        >
          Annuler
        </button>
      </div>
    </form>
  );
};
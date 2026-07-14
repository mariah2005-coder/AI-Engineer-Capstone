import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import {
  defaultProfileSettings,
  TIMEZONE_OPTIONS,
  VISIBILITY_OPTIONS,
  type ProfileSettings,
} from "../types/profile";
import "./ProfileSettingsForm.css";

interface ProfileSettingsFormProps {
  initialValues?: Partial<ProfileSettings>;
  onSave?: (values: ProfileSettings) => void | Promise<void>;
}

interface FormErrors {
  displayName?: string;
  email?: string;
  username?: string;
  website?: string;
}

function validate(values: ProfileSettings): FormErrors {
  const errors: FormErrors = {};

  if (!values.displayName.trim()) {
    errors.displayName = "Display name is required.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.username.trim()) {
    errors.username = "Username is required.";
  } else if (!/^[a-z0-9_-]{3,20}$/.test(values.username)) {
    errors.username = "Use 3–20 lowercase letters, numbers, underscores, or hyphens.";
  }

  if (values.website && !/^https?:\/\/.+/.test(values.website)) {
    errors.website = "Website must start with http:// or https://";
  }

  return errors;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function ProfileSettingsForm({
  initialValues,
  onSave,
}: ProfileSettingsFormProps) {
  const formId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [values, setValues] = useState<ProfileSettings>({
    ...defaultProfileSettings,
    ...initialValues,
  });
  const [savedValues, setSavedValues] = useState<ProfileSettings>(values);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const isDirty = JSON.stringify(values) !== JSON.stringify(savedValues) || avatarPreview !== null;

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  function updateField<K extends keyof ProfileSettings>(field: K, value: ProfileSettings[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setStatus("idle");

    if (field in errors) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field as keyof FormErrors];
        return next;
      });
    }
  }

  function handleAvatarChange(file: File | undefined) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setStatus("error");
      return;
    }

    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }

    setAvatarPreview(URL.createObjectURL(file));
    setStatus("idle");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      return;
    }

    setStatus("saving");

    try {
      await onSave?.(values);
      setSavedValues(values);
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  function handleReset() {
    setValues(savedValues);
    setErrors({});
    setStatus("idle");

    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="profile-settings">
      <header className="profile-settings__header">
        <div>
          <p className="profile-settings__eyebrow">Account</p>
          <h1 className="profile-settings__title">Profile settings</h1>
          <p className="profile-settings__subtitle">
            Update your public profile and notification preferences.
          </p>
        </div>
        {status === "saved" && (
          <p className="profile-settings__status profile-settings__status--success" role="status">
            Changes saved
          </p>
        )}
        {status === "error" && Object.keys(errors).length === 0 && (
          <p className="profile-settings__status profile-settings__status--error" role="alert">
            Something went wrong. Try again.
          </p>
        )}
      </header>

      <form className="profile-settings__form" onSubmit={handleSubmit} noValidate>
        <section className="profile-settings__section" aria-labelledby={`${formId}-profile`}>
          <div className="profile-settings__section-heading">
            <h2 id={`${formId}-profile`}>Public profile</h2>
            <p>Information visible on your profile page.</p>
          </div>

          <div className="profile-settings__avatar-row">
            <div
              className="profile-settings__avatar"
              aria-hidden="true"
              style={
                avatarPreview
                  ? { backgroundImage: `url(${avatarPreview})` }
                  : undefined
              }
            >
              {!avatarPreview && getInitials(values.displayName)}
            </div>
            <div className="profile-settings__avatar-actions">
              <label className="profile-settings__upload-button" htmlFor={`${formId}-avatar`}>
                Upload photo
              </label>
              <input
                ref={fileInputRef}
                id={`${formId}-avatar`}
                type="file"
                accept="image/*"
                className="profile-settings__file-input"
                onChange={(event) => handleAvatarChange(event.target.files?.[0])}
              />
              <p className="profile-settings__hint">JPG, PNG, or GIF. Max 2 MB.</p>
            </div>
          </div>

          <div className="profile-settings__grid">
            <div className="profile-settings__field">
              <label htmlFor={`${formId}-display-name`}>Display name</label>
              <input
                id={`${formId}-display-name`}
                type="text"
                value={values.displayName}
                autoComplete="name"
                aria-invalid={Boolean(errors.displayName)}
                aria-describedby={errors.displayName ? `${formId}-display-name-error` : undefined}
                onChange={(event) => updateField("displayName", event.target.value)}
              />
              {errors.displayName && (
                <p id={`${formId}-display-name-error`} className="profile-settings__error">
                  {errors.displayName}
                </p>
              )}
            </div>

            <div className="profile-settings__field">
              <label htmlFor={`${formId}-username`}>Username</label>
              <div className="profile-settings__input-prefix">
                <span>@</span>
                <input
                  id={`${formId}-username`}
                  type="text"
                  value={values.username}
                  autoComplete="username"
                  aria-invalid={Boolean(errors.username)}
                  aria-describedby={errors.username ? `${formId}-username-error` : undefined}
                  onChange={(event) =>
                    updateField("username", event.target.value.toLowerCase())
                  }
                />
              </div>
              {errors.username && (
                <p id={`${formId}-username-error`} className="profile-settings__error">
                  {errors.username}
                </p>
              )}
            </div>
          </div>

          <div className="profile-settings__field">
            <label htmlFor={`${formId}-bio`}>Bio</label>
            <textarea
              id={`${formId}-bio`}
              rows={4}
              maxLength={280}
              value={values.bio}
              onChange={(event) => updateField("bio", event.target.value)}
            />
            <p className="profile-settings__hint">{values.bio.length}/280 characters</p>
          </div>

          <div className="profile-settings__grid">
            <div className="profile-settings__field">
              <label htmlFor={`${formId}-location`}>Location</label>
              <input
                id={`${formId}-location`}
                type="text"
                value={values.location}
                autoComplete="address-level2"
                onChange={(event) => updateField("location", event.target.value)}
              />
            </div>

            <div className="profile-settings__field">
              <label htmlFor={`${formId}-website`}>Website</label>
              <input
                id={`${formId}-website`}
                type="url"
                value={values.website}
                placeholder="https://"
                aria-invalid={Boolean(errors.website)}
                aria-describedby={errors.website ? `${formId}-website-error` : undefined}
                onChange={(event) => updateField("website", event.target.value)}
              />
              {errors.website && (
                <p id={`${formId}-website-error`} className="profile-settings__error">
                  {errors.website}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="profile-settings__section" aria-labelledby={`${formId}-account`}>
          <div className="profile-settings__section-heading">
            <h2 id={`${formId}-account`}>Account</h2>
            <p>Private details used for login and communication.</p>
          </div>

          <div className="profile-settings__grid">
            <div className="profile-settings__field">
              <label htmlFor={`${formId}-email`}>Email address</label>
              <input
                id={`${formId}-email`}
                type="email"
                value={values.email}
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? `${formId}-email-error` : undefined}
                onChange={(event) => updateField("email", event.target.value)}
              />
              {errors.email && (
                <p id={`${formId}-email-error`} className="profile-settings__error">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="profile-settings__field">
              <label htmlFor={`${formId}-timezone`}>Timezone</label>
              <select
                id={`${formId}-timezone`}
                value={values.timezone}
                onChange={(event) => updateField("timezone", event.target.value)}
              >
                {TIMEZONE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="profile-settings__section" aria-labelledby={`${formId}-privacy`}>
          <div className="profile-settings__section-heading">
            <h2 id={`${formId}-privacy`}>Privacy & notifications</h2>
            <p>Control who sees your profile and how we contact you.</p>
          </div>

          <fieldset className="profile-settings__fieldset">
            <legend>Profile visibility</legend>
            {VISIBILITY_OPTIONS.map((option) => (
              <label key={option.value} className="profile-settings__radio-card">
                <input
                  type="radio"
                  name="profileVisibility"
                  value={option.value}
                  checked={values.profileVisibility === option.value}
                  onChange={() => updateField("profileVisibility", option.value)}
                />
                <span className="profile-settings__radio-content">
                  <span className="profile-settings__radio-label">{option.label}</span>
                  <span className="profile-settings__radio-description">
                    {option.description}
                  </span>
                </span>
              </label>
            ))}
          </fieldset>

          <div className="profile-settings__toggles">
            <label className="profile-settings__toggle">
              <input
                type="checkbox"
                checked={values.emailNotifications}
                onChange={(event) => updateField("emailNotifications", event.target.checked)}
              />
              <span className="profile-settings__toggle-switch" aria-hidden="true" />
              <span className="profile-settings__toggle-copy">
                <span>Email notifications</span>
                <span>Receive updates about account activity and security alerts.</span>
              </span>
            </label>

            <label className="profile-settings__toggle">
              <input
                type="checkbox"
                checked={values.marketingEmails}
                onChange={(event) => updateField("marketingEmails", event.target.checked)}
              />
              <span className="profile-settings__toggle-switch" aria-hidden="true" />
              <span className="profile-settings__toggle-copy">
                <span>Product updates</span>
                <span>Get occasional emails about new features and tips.</span>
              </span>
            </label>
          </div>
        </section>

        <footer className="profile-settings__footer">
          <button
            type="button"
            className="profile-settings__button profile-settings__button--secondary"
            onClick={handleReset}
            disabled={!isDirty || status === "saving"}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="profile-settings__button profile-settings__button--primary"
            disabled={!isDirty || status === "saving"}
          >
            {status === "saving" ? "Saving…" : "Save changes"}
          </button>
        </footer>
      </form>
    </div>
  );
}

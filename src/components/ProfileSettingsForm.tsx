import { FormEvent, useState } from "react";
import {
  isFormValid,
  ProfileFormData,
  validateEmail,
  validateName,
  validatePhone,
} from "./profileSettingsValidation";

const FIELD_IDS = {
  name: "profile-name",
  email: "profile-email",
  phone: "profile-phone",
} as const;

const ERROR_IDS = {
  name: "profile-name-error",
  email: "profile-email-error",
  phone: "profile-phone-error",
} as const;

const initialFormData: ProfileFormData = {
  name: "",
  email: "",
  phone: "",
};

export function ProfileSettingsForm() {
  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);
  const [touched, setTouched] = useState<Record<keyof ProfileFormData, boolean>>({
    name: false,
    email: false,
    phone: false,
  });

  const errors = {
    name: validateName(formData.name),
    email: validateEmail(formData.email),
    phone: validatePhone(formData.phone),
  };

  const canSave = isFormValid(formData);

  function handleChange(field: keyof ProfileFormData, value: string) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  function handleBlur(field: keyof ProfileFormData) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched({ name: true, email: true, phone: true });

    if (!isFormValid(formData)) {
      return;
    }

    console.log("Profile settings saved:", {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor={FIELD_IDS.name}>Name</label>
        <input
          id={FIELD_IDS.name}
          name="name"
          type="text"
          value={formData.name}
          onChange={(event) => handleChange("name", event.target.value)}
          onBlur={() => handleBlur("name")}
          aria-invalid={touched.name && errors.name ? true : undefined}
          aria-describedby={touched.name && errors.name ? ERROR_IDS.name : undefined}
          required
        />
        {touched.name && errors.name ? (
          <p id={ERROR_IDS.name} role="alert">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={FIELD_IDS.email}>Email</label>
        <input
          id={FIELD_IDS.email}
          name="email"
          type="email"
          value={formData.email}
          onChange={(event) => handleChange("email", event.target.value)}
          onBlur={() => handleBlur("email")}
          aria-invalid={touched.email && errors.email ? true : undefined}
          aria-describedby={
            touched.email && errors.email ? ERROR_IDS.email : undefined
          }
          required
        />
        {touched.email && errors.email ? (
          <p id={ERROR_IDS.email} role="alert">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={FIELD_IDS.phone}>Phone</label>
        <input
          id={FIELD_IDS.phone}
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={(event) => handleChange("phone", event.target.value)}
          onBlur={() => handleBlur("phone")}
          aria-invalid={touched.phone && errors.phone ? true : undefined}
          aria-describedby={
            touched.phone && errors.phone ? ERROR_IDS.phone : undefined
          }
          placeholder="XXX-XXX-XXXX"
        />
        {touched.phone && errors.phone ? (
          <p id={ERROR_IDS.phone} role="alert">
            {errors.phone}
          </p>
        ) : null}
      </div>

      <button type="submit" disabled={!canSave}>
        Save
      </button>
    </form>
  );
}

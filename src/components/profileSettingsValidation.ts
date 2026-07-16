/** Validation helpers for ProfileSettingsForm fields. */

export type ProfileFormData = {
  name: string;
  email: string;
  phone: string;
};

export function validateName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) {
    return "Name is required.";
  }
  if (trimmed.length < 2) {
    return "Name must be at least 2 characters.";
  }
  return null;
}

export function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) {
    return "Email is required.";
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(trimmed)) {
    return "Enter a valid email address.";
  }
  return null;
}

export function validatePhone(phone: string): string | null {
  const trimmed = phone.trim();
  if (!trimmed) {
    return null;
  }
  const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
  if (!phonePattern.test(trimmed)) {
    return "Phone must match XXX-XXX-XXXX format.";
  }
  return null;
}

export function isFormValid(data: ProfileFormData): boolean {
  return (
    validateName(data.name) === null &&
    validateEmail(data.email) === null &&
    validatePhone(data.phone) === null
  );
}

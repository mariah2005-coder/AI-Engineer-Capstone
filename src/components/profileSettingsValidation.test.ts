import { describe, expect, it } from "vitest";
import {
  isFormValid,
  validateEmail,
  validateName,
  validatePhone,
} from "./profileSettingsValidation";

describe("validateName", () => {
  it("requires a non-empty name", () => {
    expect(validateName("")).toBe("Name is required.");
    expect(validateName("   ")).toBe("Name is required.");
  });

  it("requires at least 2 characters", () => {
    expect(validateName("A")).toBe("Name must be at least 2 characters.");
  });

  it("accepts valid names", () => {
    expect(validateName("Jo")).toBeNull();
    expect(validateName("  Jane Doe  ")).toBeNull();
  });
});

describe("validateEmail", () => {
  it("requires a non-empty email", () => {
    expect(validateEmail("")).toBe("Email is required.");
  });

  it("rejects invalid email formats", () => {
    expect(validateEmail("not-an-email")).toBe("Enter a valid email address.");
    expect(validateEmail("missing@domain")).toBe("Enter a valid email address.");
    expect(validateEmail("@example.com")).toBe("Enter a valid email address.");
  });

  it("accepts valid email formats", () => {
    expect(validateEmail("user@example.com")).toBeNull();
    expect(validateEmail("  user.name@example.co  ")).toBeNull();
  });
});

describe("validatePhone", () => {
  it("allows an empty phone number", () => {
    expect(validatePhone("")).toBeNull();
    expect(validatePhone("   ")).toBeNull();
  });

  it("requires XXX-XXX-XXXX format when provided", () => {
    expect(validatePhone("1234567890")).toBe(
      "Phone must match XXX-XXX-XXXX format."
    );
    expect(validatePhone("12-345-6789")).toBe(
      "Phone must match XXX-XXX-XXXX format."
    );
  });

  it("accepts valid phone numbers", () => {
    expect(validatePhone("555-123-4567")).toBeNull();
  });
});

describe("isFormValid", () => {
  it("is false when required fields are invalid", () => {
    expect(
      isFormValid({ name: "", email: "user@example.com", phone: "" })
    ).toBe(false);
    expect(isFormValid({ name: "Jo", email: "bad", phone: "" })).toBe(false);
  });

  it("is false when an optional phone value is invalid", () => {
    expect(
      isFormValid({
        name: "Jo",
        email: "user@example.com",
        phone: "12345",
      })
    ).toBe(false);
  });

  it("is true when required fields are valid and phone is empty or valid", () => {
    expect(
      isFormValid({ name: "Jo", email: "user@example.com", phone: "" })
    ).toBe(true);
    expect(
      isFormValid({
        name: "Jo",
        email: "user@example.com",
        phone: "555-123-4567",
      })
    ).toBe(true);
  });
});

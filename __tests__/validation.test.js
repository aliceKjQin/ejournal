import { validateEmail, validatePassword } from "@/app/validateEmailNpassword";
import { validateJournalEntry } from "@/app/dashboard/validateJournalEntry";

// Validate email
describe("validateEmail", () => {
  test("should return valid for a correct email", () => {
    const result = validateEmail("test@example.com");
    expect(result).toEqual({ valid: true });
  });

  test("should return invalid for an email exceeding max length", () => {
    const longEmail = "a".repeat(255) + "@example.com";
    const result = validateEmail(longEmail);
    expect(result).toEqual({
      valid: false,
      message: "Email exceeds maximum length of 254 characters.",
    });
  });

  test("should return invalid for an incorrect email format", () => {
    const result = validateEmail("invalid-email");
    expect(result).toEqual({
      valid: false,
      message: "Invalid email format.",
    });
  });

  test("should trim whitespace and validate correctly", () => {
    const result = validateEmail("  test@example.com  ");
    expect(result).toEqual({ valid: true });
  });
});

// Validate password
describe("validatePassword", () => {
  test("should return valid for a strong password", () => {
    const result = validatePassword("StrongP@ssw0rd");
    expect(result).toEqual({ valid: true, message: null });
  });

  test("should return invalid for a password shorter than 8 characters", () => {
    const result = validatePassword("Short1!");
    expect(result).toEqual({
      valid: false,
      message: "Password must be at least 8 characters long.",
    });
  });

  test("should return invalid for a password longer than 64 characters", () => {
    const longPassword = "A".repeat(65) + "1!";
    const result = validatePassword(longPassword);
    expect(result).toEqual({
      valid: false,
      message: "Password must be no more than 64 characters long.",
    });
  });

  test("should return invalid if no uppercase letter is present", () => {
    const result = validatePassword("lowercase1!");
    expect(result).toEqual({
      valid: false,
      message: "Password must include at least one uppercase letter.",
    });
  });

  test("should return invalid if no lowercase letter is present", () => {
    const result = validatePassword("UPPERCASE1!");
    expect(result).toEqual({
      valid: false,
      message: "Password must include at least one lowercase letter.",
    });
  });

  test("should return invalid if no number is present", () => {
    const result = validatePassword("NoNumbers!");
    expect(result).toEqual({
      valid: false,
      message: "Password must include at least one number.",
    });
  });

  test("should return invalid if no special character is present", () => {
    const result = validatePassword("NoSpecial1");
    expect(result).toEqual({
      valid: false,
      message: "Password must include at least one special character i.e.,!@#.",
    });
  });

  test("should return invalid if spaces are present", () => {
    const result = validatePassword("No Spaces1!");
    expect(result).toEqual({
      valid: false,
      message: "Password cannot contain spaces.",
    });
  });
});

// Validate Journal Entry
describe("validateJournalEntry", () => {
    test("should return invalid for input exceeding max length", () => {
      const longInput = "A".repeat(501); // 501 characters
      const result = validateJournalEntry(longInput);
      expect(result).toEqual({
        valid: false,
        message: "Entry cannot exceed 500 characters.",
      });
    });
  
    test("should return invalid for input with prohibited characters", () => {
      const result = validateJournalEntry("<script>alert('Hello')</script>");
      expect(result).toEqual({
        valid: false,
        message: "HTML tags are not allowed.",
      });
    });
  
    test("should return valid for input with valid text and emojis", () => {
      const result = validateJournalEntry("This is a valid entry 😊");
      expect(result).toEqual({
        valid: true,
      });
    });
  
    test("should return valid for input within character limit with no prohibited characters", () => {
      const result = validateJournalEntry("A valid entry without any issues.");
      expect(result).toEqual({
        valid: true,
      });
    });
  
    test("should return invalid for input with space and prohibited characters", () => {
      const result = validateJournalEntry("This has <html> tags");
      expect(result).toEqual({
        valid: false,
        message: "HTML tags are not allowed.",
      });
    });
  });

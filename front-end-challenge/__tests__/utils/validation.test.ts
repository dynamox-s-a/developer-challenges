import {
  isValidEmail,
  isValidPassword,
  isRequired,
  isValidEventName,
  isValidEventLocation,
  isValidEventDescription,
  isValidEventDate,
  isValidEventCategory,
  validateEventForm,
  validateLoginForm,
  VALIDATION_MESSAGES,
} from "@/utils/validation";

describe("Validation Utils", () => {
  describe("isValidEmail", () => {
    it("should accept valid email formats", () => {
      const validEmails = [
        "user@example.com",
        "test.email@domain.co.uk",
        "user+tag@example.org",
        "firstname.lastname@example.com",
        "email@123.123.123.123", // IP address
        "email@[123.123.123.123]", // IP address in brackets
        "user@example-domain.com",
      ];

      validEmails.forEach((email) => {
        expect(isValidEmail(email)).toBe(true);
      });
    });

    it("should reject invalid email formats", () => {
      const invalidEmails = [
        "invalid",
        "@example.com",
        "user@",
        "user@@example.com",
        "user@example",
        "user.example.com",
        "",
        "user @example.com", // space
        "user@.com",
        "user@com",
      ];

      invalidEmails.forEach((email) => {
        expect(isValidEmail(email)).toBe(false);
      });
    });
  });

  describe("isValidPassword", () => {
    it("should accept passwords with 6 or more characters", () => {
      const validPasswords = [
        "123456",
        "password",
        "strongPassword123",
        "P@ssw0rd!",
        "      ", // 6 spaces
      ];

      validPasswords.forEach((password) => {
        expect(isValidPassword(password)).toBe(true);
      });
    });

    it("should reject passwords with less than 6 characters", () => {
      const invalidPasswords = ["", "1", "12", "123", "1234", "12345"];

      invalidPasswords.forEach((password) => {
        expect(isValidPassword(password)).toBe(false);
      });
    });
  });

  describe("isRequired", () => {
    it("should accept non-empty strings", () => {
      const validValues = [
        "test",
        "a",
        "123",
        "text with spaces",
        " text with leading/trailing spaces ",
      ];

      validValues.forEach((value) => {
        expect(isRequired(value)).toBe(true);
      });
    });

    it("should reject empty or whitespace-only strings", () => {
      const invalidValues = ["", " ", "   ", "\t", "\n", "  \n  \t  "];

      invalidValues.forEach((value) => {
        expect(isRequired(value)).toBe(false);
      });
    });
  });

  describe("isValidEventName", () => {
    it("should accept names between 2-100 characters", () => {
      const validNames = [
        "AB", // 2 chars
        "Event Name",
        "Workshop de TypeScript",
        "A".repeat(100), // exactly 100 chars
      ];

      validNames.forEach((name) => {
        expect(isValidEventName(name)).toBe(true);
      });
    });

    it("should reject names outside 2-100 character range", () => {
      const invalidNames = [
        "",
        "A", // 1 char
        "A".repeat(101), // 101 chars
        "  ", // only spaces
        "   A   ", // would be valid after trim but testing edge case
      ];

      invalidNames.forEach((name) => {
        expect(isValidEventName(name)).toBe(false);
      });
    });
  });

  describe("isValidEventLocation", () => {
    it("should accept locations between 2-200 characters", () => {
      const validLocations = [
        "SP", // 2 chars
        "São Paulo, Brazil",
        "Online",
        "A".repeat(200), // exactly 200 chars
      ];

      validLocations.forEach((location) => {
        expect(isValidEventLocation(location)).toBe(true);
      });
    });

    it("should reject locations outside 2-200 character range", () => {
      const invalidLocations = [
        "",
        "A", // 1 char
        "A".repeat(201), // 201 chars
      ];

      invalidLocations.forEach((location) => {
        expect(isValidEventLocation(location)).toBe(false);
      });
    });
  });

  describe("isValidEventDescription", () => {
    it("should accept descriptions between 50-1000 characters", () => {
      const validDescriptions = [
        "A".repeat(50), // exactly 50 chars
        "Este é um evento de teste com descrição válida para testar validação e precisa ter pelo menos cinquenta caracteres.",
        "A".repeat(1000), // exactly 1000 chars
      ];

      validDescriptions.forEach((description) => {
        expect(isValidEventDescription(description)).toBe(true);
      });
    });

    it("should reject descriptions outside 50-1000 character range", () => {
      const invalidDescriptions = [
        "",
        "Short", // 5 chars
        "A".repeat(10), // 10 chars
        "A".repeat(49), // 49 chars
        "A".repeat(1001), // 1001 chars
      ];

      invalidDescriptions.forEach((description) => {
        expect(isValidEventDescription(description)).toBe(false);
      });
    });

    it("should trim whitespace when validating length", () => {
      const description = " " + "A".repeat(50) + " "; // 50 chars + whitespace
      expect(isValidEventDescription(description)).toBe(true);

      const shortDescription = " " + "A".repeat(49) + " "; // 49 chars + whitespace
      expect(isValidEventDescription(shortDescription)).toBe(false);
    });
  });

  describe("isValidEventDate", () => {
    it("should accept future dates", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1); // tomorrow

      const futureDate2 = new Date();
      futureDate2.setFullYear(futureDate2.getFullYear() + 1); // next year

      expect(isValidEventDate(futureDate.toISOString().split("T")[0])).toBe(
        true
      );
      expect(isValidEventDate(futureDate2.toISOString().split("T")[0])).toBe(
        true
      );
    });

    it("should reject past dates", () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1); // yesterday

      expect(isValidEventDate(pastDate.toISOString().split("T")[0])).toBe(
        false
      );
    });

    it("should handle invalid date strings", () => {
      const invalidDates = [
        "invalid",
        "",
        "2023-13-01", // invalid month
        "2023-01-32", // invalid day
        "not-a-date",
      ];

      invalidDates.forEach((date) => {
        expect(isValidEventDate(date)).toBe(false);
      });
    });
  });

  describe("isValidEventCategory", () => {
    const allowedCategories = ["Workshop", "Conference", "Webinar", "Meetup"];

    it("should accept valid categories", () => {
      allowedCategories.forEach((category) => {
        expect(isValidEventCategory(category, allowedCategories)).toBe(true);
      });
    });

    it("should reject invalid categories", () => {
      const invalidCategories = [
        "InvalidCategory",
        "workshop", // case sensitive
        "CONFERENCE",
        "",
        "Other",
      ];

      invalidCategories.forEach((category) => {
        expect(isValidEventCategory(category, allowedCategories)).toBe(false);
      });
    });
  });

  describe("validateEventForm", () => {
    const allowedCategories = ["Workshop", "Conference", "Webinar", "Meetup"];
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    const validEventData = {
      name: "Test Event",
      date: futureDate.toISOString().split("T")[0],
      location: "Test Location",
      description:
        "Esta é uma descrição válida para propósitos de teste e tem pelo menos cinquenta caracteres para atender aos requisitos.",
      category: "Workshop",
    };

    it("should return no errors for valid event data", () => {
      const errors = validateEventForm(validEventData, allowedCategories);
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it("should return errors for invalid event data", () => {
      const invalidEventData = {
        name: "", // required
        date: "2020-01-01", // past date
        location: "A", // too short
        description: "Short", // too short
        category: "Invalid", // not in allowed list
      };

      const errors = validateEventForm(invalidEventData, allowedCategories);

      expect(errors.name).toBe(VALIDATION_MESSAGES.REQUIRED);
      expect(errors.date).toBe(VALIDATION_MESSAGES.INVALID_EVENT_DATE);
      expect(errors.location).toBe(VALIDATION_MESSAGES.INVALID_EVENT_LOCATION);
      expect(errors.description).toBe(
        VALIDATION_MESSAGES.INVALID_EVENT_DESCRIPTION
      );
      expect(errors.category).toBe(VALIDATION_MESSAGES.INVALID_EVENT_CATEGORY);
    });

    it("should validate each field independently", () => {
      const partiallyInvalidData = {
        ...validEventData,
        name: "A".repeat(101), // too long
      };

      const errors = validateEventForm(partiallyInvalidData, allowedCategories);

      expect(errors.name).toBe(VALIDATION_MESSAGES.INVALID_EVENT_NAME);
      expect(errors.date).toBeUndefined();
      expect(errors.location).toBeUndefined();
      expect(errors.description).toBeUndefined();
      expect(errors.category).toBeUndefined();
    });
  });

  describe("validateLoginForm", () => {
    it("should return no errors for valid login data", () => {
      const errors = validateLoginForm("user@example.com", "password123");
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it("should return errors for invalid email", () => {
      const errors = validateLoginForm("invalid-email", "password123");
      expect(errors.email).toBe(VALIDATION_MESSAGES.INVALID_EMAIL);
      expect(errors.password).toBeUndefined();
    });

    it("should return errors for invalid password", () => {
      const errors = validateLoginForm("user@example.com", "12345");
      expect(errors.email).toBeUndefined();
      expect(errors.password).toBe(VALIDATION_MESSAGES.INVALID_PASSWORD);
    });

    it("should return errors for empty fields", () => {
      const errors = validateLoginForm("", "");
      expect(errors.email).toBe(VALIDATION_MESSAGES.REQUIRED);
      expect(errors.password).toBe(VALIDATION_MESSAGES.REQUIRED);
    });

    it("should return multiple errors when both fields are invalid", () => {
      const errors = validateLoginForm("invalid-email", "123");
      expect(errors.email).toBe(VALIDATION_MESSAGES.INVALID_EMAIL);
      expect(errors.password).toBe(VALIDATION_MESSAGES.INVALID_PASSWORD);
    });
  });

  describe("VALIDATION_MESSAGES", () => {
    it("should have all required message constants", () => {
      expect(VALIDATION_MESSAGES.REQUIRED).toBeDefined();
      expect(VALIDATION_MESSAGES.INVALID_EMAIL).toBeDefined();
      expect(VALIDATION_MESSAGES.INVALID_PASSWORD).toBeDefined();
      expect(VALIDATION_MESSAGES.INVALID_EVENT_NAME).toBeDefined();
      expect(VALIDATION_MESSAGES.INVALID_EVENT_LOCATION).toBeDefined();
      expect(VALIDATION_MESSAGES.INVALID_EVENT_DESCRIPTION).toBeDefined();
      expect(VALIDATION_MESSAGES.INVALID_EVENT_DATE).toBeDefined();
      expect(VALIDATION_MESSAGES.INVALID_EVENT_CATEGORY).toBeDefined();
    });
  });
});

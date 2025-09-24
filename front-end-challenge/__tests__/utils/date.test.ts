import {
  formatEventDate,
  formatDateForInput,
  getCurrentDateForInput,
} from "@/utils/date";

describe("Date Utils", () => {
  // Mock console.error to avoid noise in tests
  const originalConsoleError = console.error;

  beforeEach(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  describe("formatEventDate", () => {
    it("should format valid date strings to Brazilian format", () => {
      // Test with ISO date string - just check it doesn't return error message
      const result = formatEventDate("2024-01-15T10:30:00");
      expect(result).not.toBe("Data inválida");
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it("should include time in the formatted output", () => {
      const result = formatEventDate("2024-01-15T14:30:00");
      expect(result).not.toBe("Data inválida");
      expect(result).toMatch(/\d{2}:\d{2}/);
    });

    it("should handle invalid dates gracefully", () => {
      const invalidDates = [
        "invalid-date",
        "",
        "2024-13-01", // invalid month
        "not-a-date",
      ];

      invalidDates.forEach((invalidDate) => {
        const result = formatEventDate(invalidDate);
        // JavaScript Date constructor doesn't throw for invalid strings,
        // but creates invalid dates that format as "Invalid Date"
        expect(result).toMatch(/Invalid Date|Data inválida/);
      });
    });

    it("should handle null and undefined input", () => {
      // Test that these don't crash and return some string
      const nullResult = formatEventDate(null as any);
      const undefinedResult = formatEventDate(undefined as any);

      expect(typeof nullResult).toBe("string");
      expect(typeof undefinedResult).toBe("string");
    });
  });

  describe("formatDateForInput", () => {
    it("should format valid dates for HTML input elements", () => {
      const result = formatDateForInput("2024-01-15T10:30:00");

      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
      expect(result).toContain("2024-01-15");
    });

    it("should handle dates without seconds", () => {
      const result = formatDateForInput("2024-01-15T10:30");
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    });

    it("should return empty string for invalid dates", () => {
      const invalidDates = ["invalid-date", "", "2024-13-01", "not-a-date"];

      invalidDates.forEach((invalidDate) => {
        const result = formatDateForInput(invalidDate);
        expect(result).toBe("");
      });
    });

    it("should handle null and undefined input", () => {
      // Test that these don't crash and return some string
      const nullResult = formatDateForInput(null as any);
      const undefinedResult = formatDateForInput(undefined as any);

      expect(typeof nullResult).toBe("string");
      expect(typeof undefinedResult).toBe("string");
    });
  });

  describe("getCurrentDateForInput", () => {
    it("should return current date in correct format", () => {
      const result = getCurrentDateForInput();

      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);

      // Parse the result to ensure it's a valid date
      const resultDate = new Date(result);
      expect(resultDate).toBeInstanceOf(Date);
      expect(resultDate.getTime()).not.toBeNaN();
    });

    it("should return consistent format across calls", () => {
      const result1 = getCurrentDateForInput();
      const result2 = getCurrentDateForInput();

      // Both should have the same format
      expect(result1).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
      expect(result2).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);

      // Should be parseable as dates
      expect(new Date(result1).getTime()).not.toBeNaN();
      expect(new Date(result2).getTime()).not.toBeNaN();
    });

    it("should be usable as input value", () => {
      const currentDate = getCurrentDateForInput();

      // Should be parseable back to a Date
      const parsedDate = new Date(currentDate);
      expect(parsedDate).toBeInstanceOf(Date);
      expect(parsedDate.getTime()).not.toBeNaN();

      // Should be suitable for datetime-local input
      expect(currentDate.length).toBe(16); // YYYY-MM-DDTHH:MM
    });
  });

  describe("integration tests", () => {
    it("should work together for form handling", () => {
      // Simulate getting current date for default value
      const currentDate = getCurrentDateForInput();

      // Format it back for event display
      const displayDate = formatEventDate(currentDate);

      expect(displayDate).not.toBe("Data inválida");
      expect(displayDate).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it("should handle valid date string conversion", () => {
      const testDate = "2024-06-15T14:30:00";

      // Convert to input format
      const inputFormat = formatDateForInput(testDate);
      expect(inputFormat).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);

      // Convert back to display format
      const displayFormat = formatEventDate(inputFormat);
      expect(displayFormat).not.toBe("Data inválida");
    });

    it("should handle error cases gracefully in integration", () => {
      const invalidDate = "invalid";

      const inputFormat = formatDateForInput(invalidDate);
      const displayFormat = formatEventDate(invalidDate);

      expect(inputFormat).toBe("");
      expect(displayFormat).toMatch(/Invalid Date|Data inválida/);
    });
  });

  describe("real-world scenarios", () => {
    it("should handle future dates correctly", () => {
      // Create a future date
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7); // One week from now

      const dateString = futureDate.toISOString();

      const inputFormat = formatDateForInput(dateString);
      const displayFormat = formatEventDate(dateString);

      expect(inputFormat).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
      expect(displayFormat).not.toBe("Data inválida");
    });

    it("should maintain consistency between functions", () => {
      const testDate = "2024-03-15T09:30:00";

      const input = formatDateForInput(testDate);
      const display = formatEventDate(testDate);

      // Input should be in ISO format (contains date part)
      expect(input).toContain("2024-03-15");

      // Display should be formatted (not error message)
      expect(display).not.toBe("Data inválida");
    });

    it("should handle different date input formats", () => {
      const dateFormats = [
        "2024-01-15",
        "2024-01-15T10:30:00",
        "2024-01-15T10:30:00.000Z",
      ];

      dateFormats.forEach((dateFormat) => {
        const inputResult = formatDateForInput(dateFormat);
        const displayResult = formatEventDate(dateFormat);

        expect(inputResult).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
        expect(displayResult).not.toBe("Data inválida");
      });
    });
  });
});

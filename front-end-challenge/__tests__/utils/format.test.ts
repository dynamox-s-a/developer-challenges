import {
  capitalize,
  capitalizeWords,
  truncateText,
  formatCardDescription,
  formatEventCategory,
} from "@/utils/format";

describe("Format Utils", () => {
  describe("capitalize", () => {
    it("should capitalize first letter and lowercase the rest", () => {
      expect(capitalize("hello")).toBe("Hello");
      expect(capitalize("HELLO")).toBe("Hello");
      expect(capitalize("hELLO")).toBe("Hello");
      expect(capitalize("hello world")).toBe("Hello world");
    });

    it("should handle single characters", () => {
      expect(capitalize("a")).toBe("A");
      expect(capitalize("Z")).toBe("Z");
    });

    it("should handle edge cases", () => {
      expect(capitalize("")).toBe("");
      expect(capitalize(" ")).toBe(" ");
      expect(capitalize("1hello")).toBe("1hello");
      expect(capitalize("123")).toBe("123");
    });

    it("should handle special characters", () => {
      expect(capitalize("áéíóú")).toBe("Áéíóú");
      expect(capitalize("ção")).toBe("Ção");
    });

    it("should handle null/undefined input", () => {
      expect(capitalize(null as any)).toBe("");
      expect(capitalize(undefined as any)).toBe("");
    });
  });

  describe("capitalizeWords", () => {
    it("should capitalize each word in a sentence", () => {
      expect(capitalizeWords("hello world")).toBe("Hello World");
      expect(capitalizeWords("HELLO WORLD")).toBe("Hello World");
      expect(capitalizeWords("hELLO wORLD")).toBe("Hello World");
    });

    it("should handle multiple spaces", () => {
      expect(capitalizeWords("hello  world")).toBe("Hello  World");
      expect(capitalizeWords("  hello   world  ")).toBe("  Hello   World  ");
    });

    it("should handle single words", () => {
      expect(capitalizeWords("hello")).toBe("Hello");
      expect(capitalizeWords("HELLO")).toBe("Hello");
    });

    it("should handle edge cases", () => {
      expect(capitalizeWords("")).toBe("");
      expect(capitalizeWords(" ")).toBe(" ");
      expect(capitalizeWords("a b c")).toBe("A B C");
    });

    it("should handle numbers and special characters", () => {
      expect(capitalizeWords("123 abc")).toBe("123 Abc");
      expect(capitalizeWords("hello-world test")).toBe("Hello-world Test");
      expect(capitalizeWords("café com leite")).toBe("Café Com Leite");
    });

    it("should handle null/undefined input", () => {
      expect(capitalizeWords(null as any)).toBe("");
      expect(capitalizeWords(undefined as any)).toBe("");
    });
  });

  describe("truncateText", () => {
    it("should truncate text longer than maxLength", () => {
      expect(truncateText("Hello World", 8)).toBe("Hello...");
      expect(truncateText("This is a long sentence", 10)).toBe("This is...");
    });

    it("should not truncate text shorter than maxLength", () => {
      expect(truncateText("Hello", 10)).toBe("Hello");
      expect(truncateText("Hello World", 11)).toBe("Hello World");
      expect(truncateText("Hello World", 12)).toBe("Hello World");
    });

    it("should handle exact length", () => {
      expect(truncateText("Hello", 5)).toBe("Hello");
      expect(truncateText("Hello World", 11)).toBe("Hello World");
    });

    it("should handle edge cases", () => {
      expect(truncateText("", 5)).toBe("");
      expect(truncateText("Hello", 0)).toBe("...");
      expect(truncateText("Hello", 3)).toBe("...");
      expect(truncateText("Hello", 4)).toBe("H...");
    });

    it("should handle very short maxLength", () => {
      expect(truncateText("Hello World", 1)).toBe("...");
      expect(truncateText("Hello World", 2)).toBe("...");
      expect(truncateText("Hello World", 3)).toBe("...");
      expect(truncateText("Hello World", 4)).toBe("H...");
    });

    it("should handle null/undefined input", () => {
      expect(truncateText(null as any, 5)).toBe(null);
      expect(truncateText(undefined as any, 5)).toBe(undefined);
    });

    it("should preserve unicode characters", () => {
      expect(truncateText("Olá mundo", 6)).toBe("Olá...");
      expect(truncateText("Café ☕", 5)).toBe("Ca...");
    });
  });

  describe("formatCardDescription", () => {
    it("should use default maxLength of 120", () => {
      const longText = "A".repeat(150);
      const result = formatCardDescription(longText);
      expect(result).toBe("A".repeat(117) + "...");
      expect(result.length).toBe(120);
    });

    it("should use custom maxLength", () => {
      const longText = "This is a long description for testing";
      const result = formatCardDescription(longText, 20);
      expect(result.length).toBeLessThanOrEqual(20);
      expect(result.endsWith("...")).toBe(true);
    });

    it("should not truncate short descriptions", () => {
      const shortText = "Short description";
      expect(formatCardDescription(shortText)).toBe(shortText);
      expect(formatCardDescription(shortText, 50)).toBe(shortText);
    });

    it("should handle edge cases", () => {
      expect(formatCardDescription("")).toBe("");
      expect(formatCardDescription("", 10)).toBe("");
    });
  });

  describe("formatEventCategory", () => {
    it("should format known categories correctly", () => {
      expect(formatEventCategory("workshop")).toBe("Workshop");
      expect(formatEventCategory("WORKSHOP")).toBe("Workshop");
      expect(formatEventCategory("Workshop")).toBe("Workshop");

      expect(formatEventCategory("conference")).toBe("Conferência");
      expect(formatEventCategory("CONFERENCE")).toBe("Conferência");

      expect(formatEventCategory("webinar")).toBe("Webinar");
      expect(formatEventCategory("meetup")).toBe("Meetup");
      expect(formatEventCategory("seminar")).toBe("Seminário");
      expect(formatEventCategory("training")).toBe("Treinamento");
      expect(formatEventCategory("networking")).toBe("Networking");
      expect(formatEventCategory("other")).toBe("Outro");
    });

    it("should capitalize unknown categories", () => {
      expect(formatEventCategory("custom category")).toBe("Custom Category");
      expect(formatEventCategory("CUSTOM CATEGORY")).toBe("Custom Category");
      expect(formatEventCategory("customCategory")).toBe("Customcategory");
    });

    it("should handle edge cases", () => {
      expect(formatEventCategory("")).toBe("");
      expect(formatEventCategory(" ")).toBe(" ");
      expect(formatEventCategory("unknown")).toBe("Unknown");
    });

    it("should be case insensitive for known categories", () => {
      const testCases = [
        ["workshop", "Workshop"],
        ["WORKSHOP", "Workshop"],
        ["WorkShop", "Workshop"],
        ["conference", "Conferência"],
        ["CONFERENCE", "Conferência"],
        ["Conference", "Conferência"],
      ];

      testCases.forEach(([input, expected]) => {
        expect(formatEventCategory(input)).toBe(expected);
      });
    });

    it("should handle mixed case unknown categories", () => {
      expect(formatEventCategory("custom Event")).toBe("Custom Event");
      expect(formatEventCategory("special MEETING")).toBe("Special Meeting");
    });

    it("should handle special characters in categories", () => {
      expect(formatEventCategory("tech-talk")).toBe("Tech-talk");
      expect(formatEventCategory("café & networking")).toBe(
        "Café & Networking"
      );
    });
  });

  describe("integration tests", () => {
    it("should work well together for event display", () => {
      // Simulating real-world usage
      const eventData = {
        category: "WORKSHOP",
        description:
          "Este é um workshop muito interessante sobre desenvolvimento web moderno com React, Next.js e TypeScript que vai ensinar técnicas avançadas",
      };

      const formattedCategory = formatEventCategory(eventData.category);
      const formattedDescription = formatCardDescription(
        eventData.description,
        80
      );

      expect(formattedCategory).toBe("Workshop");
      expect(formattedDescription.length).toBeLessThanOrEqual(80);
      expect(formattedDescription.endsWith("...")).toBe(true);
    });

    it("should handle empty/null data gracefully", () => {
      expect(formatEventCategory("")).toBe("");
      expect(formatCardDescription("")).toBe("");
      expect(truncateText("", 10)).toBe("");
      expect(capitalize("")).toBe("");
      expect(capitalizeWords("")).toBe("");
    });
  });
});

/**
 * Text and data formatting utilities
 */

/**
 * Capitalizes the first letter of a string
 */
export const capitalize = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Capitalizes each word in a string
 */
export const capitalizeWords = (str: string): string => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
};

/**
 * Truncates text to a specified length with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
};

/**
 * Formats text for display in cards (truncates description)
 */
export const formatCardDescription = (
  description: string,
  maxLength: number = 120
): string => {
  return truncateText(description, maxLength);
};

/**
 * Formats event category for display
 */
export const formatEventCategory = (category: string): string => {
  const categoryMap: Record<string, string> = {
    workshop: "Workshop",
    conference: "Conferência",
    webinar: "Webinar",
    meetup: "Meetup",
    seminar: "Seminário",
    training: "Treinamento",
    networking: "Networking",
    other: "Outro",
  };
  return categoryMap[category.toLowerCase()] || capitalizeWords(category);
};

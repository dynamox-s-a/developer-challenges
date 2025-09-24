/**
 * Date formatting and manipulation utilities
 */

/**
 * Formats a date string for event display
 */
export const formatEventDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Data inválida";
  }
};

/**
 * Formats a date for form inputs (YYYY-MM-DDTHH:mm)
 */
export const formatDateForInput = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  } catch (error) {
    console.error("Error formatting date for input:", error);
    return "";
  }
};

/**
 * Gets the current date formatted for form inputs
 */
export const getCurrentDateForInput = (): string => {
  return new Date().toISOString().slice(0, 16);
};

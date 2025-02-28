/**
 * Converts text wrapped in asterisks (*) to HTML <strong> tags while escaping HTML.
 * Example: "This is *bold* text" -> "This is <strong>bold</strong> text"
 * 
 * @param text - The input string containing bold markers (*)
 * @returns A string with <strong> tags replacing the asterisks, safely escaped
 */
export const parseBoldText = (text: string): string => {
  if (!text) return "";

  // Escape HTML special characters
  const escapeHTML = (str: string) =>
    str.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp;");

  const escapedText = escapeHTML(text);

  // Replace *bold* while ensuring it's not inside a word
  return escapedText.replace(/\B\*(.*?)\*\B/g, "<strong>$1</strong>");
};

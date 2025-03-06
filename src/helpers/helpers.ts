/**
 * Converts *bold* text to <strong> tags while escaping HTML.
 */
export const parseBoldText = (text: string): string => {
  if (!text) return "";

  // Escape HTML characters
  const escapeHTML = (str: string) =>
    str.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp;");

  const escapedText = escapeHTML(text);

  // Replace *bold* with <strong>
  return escapedText.replace(/\B\*(.*?)\*\B/g, "<strong>$1</strong>");
};

/** 
 * Checks value A and B matches.
 */
export const isMatched = (valueA?: boolean | string, valueB?: boolean | string) =>
  valueA === valueB;

/** 
 * Combines class names, removing falsy values.
 */
export const mergeClassNames  = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

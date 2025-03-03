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
 * Checks if the user's answer is correct.
 */
export const isMatched = (isCorrect?: boolean, userAnswer?: boolean) =>
  Boolean(isCorrect) === Boolean(userAnswer);

/** 
 * Combines class names, removing falsy values.
 */
export const classNames = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(" ");

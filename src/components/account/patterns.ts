/** Patterns for native validation. Browsers compile these with the regex `v` flag. */
export const PHONE_PATTERN = String.raw`(\+91[ \-]?)?[6-9][0-9]{4}[ \-]?[0-9]{5}`;
export const PIN_PATTERN = "[1-9][0-9]{5}";
export const PHONE_MESSAGE = "Enter a 10-digit mobile number, like +91 90000 12345.";
export const PIN_MESSAGE = "Enter a 6-digit PIN code.";

/** Only same-site paths are allowed, so ?next= can't send people elsewhere. */
export function safeNextPath(next: string | string[] | undefined, fallback = "/") {
  return typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}

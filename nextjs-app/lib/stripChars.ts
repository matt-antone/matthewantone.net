export function stripChars(str: string) {
  return str.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
}
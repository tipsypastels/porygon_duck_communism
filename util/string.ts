const ELLIPSIS = "…";

export function ellipsis(string: string, len: number) {
  return string.length > len ? `${string.slice(0, len)}${ELLIPSIS}` : string;
}

export function codeBlock(string: string) {
  return `\`\`\`${string}\`\`\``;
}

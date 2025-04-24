export function splitParagraphs(text: string): string[] {
  return text
    .split(/(?<=[.?!])\s+(?=[A-Z])/g) // quebra onde tem ponto final + espaço + letra maiúscula
    .map((p) => p.trim()) // tira espaços extras
    .filter(Boolean) // remove strings vazias
}

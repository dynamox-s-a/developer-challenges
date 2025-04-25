export function splitFirstWord(title: string): { firstWord: string; rest: string } {
  const [firstWord, ...rest] = title.split(' ')
  return {
    firstWord,
    rest: rest.join(' '),
  }
}

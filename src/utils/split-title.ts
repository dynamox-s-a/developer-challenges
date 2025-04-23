export function splitTitle(title: string) {
  const words = title.trim().split(' ')
  const middle = Math.ceil(words.length / 2)
  const firstHalf = words.slice(0, middle).join(' ')
  const secondHalf = words.slice(middle).join(' ')
  return { firstHalf, secondHalf }
}

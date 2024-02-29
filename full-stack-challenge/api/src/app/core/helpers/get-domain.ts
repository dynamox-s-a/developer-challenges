export const getDomain = (hostname: string) => {
  const splitDomain = hostname.split('.')
  splitDomain.shift()
  return splitDomain.join('.')
}
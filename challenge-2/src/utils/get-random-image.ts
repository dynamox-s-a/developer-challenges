export const getRandomImageUrl = (images: string[]) => {
  const randomIndex = Math.floor(Math.random() * images.length)
  return images[randomIndex]
}

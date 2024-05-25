export function useCurrentYear(){
  const currentYear = new Date().getFullYear()

  return { currentYear }
}
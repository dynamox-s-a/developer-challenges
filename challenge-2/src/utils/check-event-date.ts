export function isEventPast(eventDateTime: string): boolean {
  const eventDate = new Date(eventDateTime)
  const currentDate = new Date()
  return eventDate < currentDate
}

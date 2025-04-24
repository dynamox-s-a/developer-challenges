export interface PurposeCardLink {
  href: string
  text: string
}

export interface PurposeCardData {
  id: number
  image: string
  sectionIcon: string
  title: string
  paragraph: string | null
  topics: string[] | null
  link: PurposeCardLink
}

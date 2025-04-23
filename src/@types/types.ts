export interface CMSSectionLink {
  href: string
  text: string
}

export interface CMSSection {
  id: number
  image: string
  sectionIcon: string
  title: string
  paragraph: string | null
  topics: string[] | null
  link: CMSSectionLink
}

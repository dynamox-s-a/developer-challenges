import type React from "react"

export type ContentImageSectionItem = {
  text: string
}

export type ContentImageSectionProps = {
  imageSrc: string
  imageAlt: string
  icon?: React.FC<React.SVGProps<SVGSVGElement>>
  titleHighlight: string
  title: string
  items?: ContentImageSectionItem[]
  textContent?: string
  linkLabel: string
  linkUrl: string
  reverse?: boolean
}

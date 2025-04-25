import lupaIcon from '../../public/section-icons/lupa.svg'
import cardsIcon from '../../public/section-icons/cards.svg'
import chatsIcon from '../../public/section-icons/chats.svg'
import infiniteChats from '../../public/section-icons/infinite.svg'

export const CMS_CAROUSEL_IMAGES = [
  { id: 1, src: '/carousel-images/engineers_1.webp' },
  { id: 2, src: '/carousel-images/engineers_2.webp' },
  { id: 3, src: '/carousel-images/engineers_3.webp' },
]

export const CMS_HISTORY_SECTION = [
  {
    id: 1,
    title: 'Dynamox, por uma indústria mais segura e produtiva',
    paragraph: [
      {
        id: 1,
        text: 'Em um mundo em que há crescimento na oferta de sensores e hardwares é normal que a escolha entre diferentes produtos seja um processo trabalhoso. Afinal, pesquisas e comparações tornam-se necessárias para entender as melhores opções para as respectivas aplicações.',
      },
      {
        id: 2,
        text: 'Se essa escolha já parece complicada, ao acrescentarmos a questão da análise do software, a comparação se torna ainda mais complexa.',
      },
      {
        id: 3,
        text: 'Uma forma de simplificar este processo é basear os critérios de análise em um sistema de referência.  Esse manifesto é a consolidação da visão Dynamox: ser referência em tecnologias eficientes e eficazes para monitoramento, manutenção e performance de ativos.',
      },
    ],
  },
]

export const CMS_DATA_SECTIONS = [
  {
    id: 1,
    image: '/hotsite_1.webp',
    sectionIcon: lupaIcon,
    title: 'Uma solução que é referência',
    paragraph: null,
    topics: ['Qualidade dos Hardwares', 'Usabilidade do Software', 'Segurança de dado'],
    link: {
      href: 'https://dynamox.net/blog',
      text: 'Leia mais',
    },
  },
  {
    id: 2,
    image: '/hotsite_2.webp',
    sectionIcon: cardsIcon,
    title: 'Uma solução que integra ',
    paragraph:
      'Entendemos o papel central das pessoas na indústria e a importância da integração entre setores. Com dados e tecnologia, apoiamos a busca pela máxima produtividade e segurança.',
    topics: null,
    link: {
      href: 'https://dynamox.net/blog',
      text: 'Leia mais',
    },
  },
  {
    id: 3,
    image: '/hotsite_3.webp',
    sectionIcon: chatsIcon,
    title: 'Uma solução que viabiliza a comunicação',
    paragraph:
      'Temos a comunicação como a base das relações humanas e dos sistemas de informação na tecnologia. Derrubamos as barreiras de compreensão entre diferentes grupos criadas pela especialização.',
    topics: null,
    link: {
      href: 'https://dynamox.net/blog',
      text: 'Leia mais',
    },
  },
  {
    id: 4,
    image: '/hotsite_4.webp',
    sectionIcon: infiniteChats,
    title: 'Uma plataforma que se comunica de ponta a ponta',
    paragraph:
      'Tecnologia que conecta, unifica e proporciona a comunicação efetiva de ponta a ponta.',
    topics: null,
    link: {
      href: 'https://dynamox.net/blog',
      text: 'Leia mais',
    },
  },
]

export const CMS_SOCIAL_MEDIA_DATA = {
  linkedin: {
    src: '/social-media-icons/linkedin.svg',
    link: 'https://www.linkedin.com/company/dynamox/',
    alt: 'Linkedin Logo',
  },
  instagram: {
    src: '/social-media-icons/instagram.svg',
    link: 'https://www.instagram.com/dynamox_s.a/',
    alt: 'Instagram logo',
  },
  facebook: {
    src: '/social-media-icons/facebook.svg',
    link: 'https://www.facebook.com/dynamoxtech/',
    alt: 'Facebook Logo',
  },
  youtube: {
    src: '/social-media-icons/youtube.svg',
    link: 'https://www.youtube.com/@DynamoxTech',
    alt: 'Youtube Logo',
  },
}

export const CMS_FOOTER_LINKS = [
  {
    id: 1,
    name: 'Consentimento de Cookies',
    link: '#',
    description: 'Consentimento de Cookies',
  },
  {
    id: 2,
    name: 'Aviso de privacidade',
    link: 'https://content.dynamox.net/wp-content/uploads/2024/09/AVISO-DE-PRIVACIDADE-UNIFICADO.pdf',
    description: 'Aviso de Privacidade',
  },
]

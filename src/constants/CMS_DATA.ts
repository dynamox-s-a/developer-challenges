import lupaIcon from '../../public/section-icons/lupa.svg'
import cardsIcon from '../../public/section-icons/cards.svg'
import chatsIcon from '../../public/section-icons/chats.svg'
import infiniteChats from '../../public/section-icons/infinite.svg'

export const CMS_DATA_SECTIONS = [
  {
    id: 1,
    image: '/hotsite_1.png',
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
    image: '/hotsite_2.jpg',
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
    image: '/hotsite_3.jpg',
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
    image: '/hotsite_4.png',
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

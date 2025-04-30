import image1 from '@/assets/card-solution/image1.png';
import image2 from '@/assets/card-solution/image2.png';
import image3 from '@/assets/card-solution/image3.png';
import image4 from '@/assets/card-solution/image4.png';
import icon1 from '@/assets/card-solution/icon1.png';
import icon2 from '@/assets/card-solution/icon2.png';
import icon3 from '@/assets/card-solution/icon3.png';
import icon4 from '@/assets/card-solution/icon4.png';

export const solutions = [
  {
    mainImage: image1,
    iconImage: icon1,
    title: (
      <p className="text-gray-dy">
        Uma solução
        <br />
        <span className="text-main">que é referência</span>
      </p>
    ),
    items: ['Qualidade dos Hardwares', 'Usabilidade do Software', 'Segurança de dados'],
    imagePosition: 'left' as const,
  },
  {
    mainImage: image2,
    iconImage: icon2,
    title: (
      <p className="text-gray-dy">
        Uma solução
        <br />
        <span className="text-main">que integra</span>
      </p>
    ),
    description:
      'Entendemos o papel central das pessoas na indústria e a importância da integração entre setores. Com dados e tecnologia, apoiamos a busca pela máxima produtividade e segurança.',
    imagePosition: 'right' as const,
  },
  {
    mainImage: image3,
    iconImage: icon3,
    title: (
      <p className="text-gray-dy">
        Uma solução
        <br />
        <span className="text-main">que viabiliza a comunicação</span>
      </p>
    ),
    description:
      'Temos a comunicação como a base das relações humanas e dos sistemas de informação na tecnologia. Derrubamos as barreiras de compreensão entre diferentes grupos criadas pela especialização.',
    imagePosition: 'left' as const,
  },
  {
    mainImage: image4,
    iconImage: icon4,
    title: (
      <p className="text-gray-dy">
        Uma plataforma que
        <br />
        <span className="text-main">se comunica de ponta a ponta</span>
      </p>
    ),
    description: (
      <p>
        Tecnologia que <span className="font-bold">conecta</span>,{' '}
        <span className="font-bold">unifica</span> e proporciona a{' '}
        <span className="font-bold">comunicação efetiva</span> de ponta a ponta.
      </p>
    ),
    imagePosition: 'right' as const,
  },
];

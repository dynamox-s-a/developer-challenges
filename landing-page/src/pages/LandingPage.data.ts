import type { ContentImageSectionProps } from "@/components/ContentImageSection/ContentImageSection.types";
import dynamoxOfficeReception from '@/assets/images/dynamox-office-reception.webp';
import techniciansMonitoringEquipment from '@/assets/images/technicians-monitoring-equipment.webp';
import teamMeetingPlanning from '@/assets/images/team-meeting-planning.webp';
import engineersInspection from '@/assets/images/engineers-inspection.webp';
import ZoomIcon from '@/assets/icons/zoom-icon.svg?react';
import LayerIcon from '@/assets/icons/layer-icon.svg?react';
import ChatIcon from '@/assets/icons/chat-icon.svg?react';
import ConectionIcon from '@/assets/icons/conection-icon.svg?react';
import type { ContentSectionProps } from "@/components/ContentSection/ContentSection.types";


export const contentSections: ContentSectionProps[] = [
  {
    title: 'Dynamox',
    titleHighlight: ', por uma indústria mais segura e produtiva',
    textContent: ['Em um mundo em que há crescimento na oferta de sensores e hardwares é normal que a escolha entre diferentes produtos seja um processo trabalhoso. Afinal, pesquisas e comparações tornam-se necessárias para entender as melhores opções para as respectivas aplicações. ',
     'Se essa escolha já parece complicada, ao acrescentarmos a questão da análise do software, a comparação se torna ainda mais complexa.',
      'Uma forma de simplificar este processo é basear os critérios de análise em um sistema de referência.  Esse manifesto é a consolidação da visão Dynamox: ser referência em tecnologias eficientes e eficazes para monitoramento, manutenção e performance de ativos.'
    ]
  }
]

export const contentImageSections: ContentImageSectionProps[] = [
  {
    imageSrc: dynamoxOfficeReception,
    imageAlt: 'Recepção do escritório da Dynamox com certificados na parede e colaboradora trabalhando',
    icon: ZoomIcon,
    titleHighlight: 'Uma solução',
    title: 'que é referência',
    items: [
      { text: 'Qualidade dos Hardwares' },
      { text: 'Usabilidade do Software' },
      { text: 'Segurança de Dados' },
    ],
    linkLabel: 'Leia mais',
    linkUrl: 'https://dynamox.net/blog',
  },
  {
    imageSrc: techniciansMonitoringEquipment,
    imageAlt: 'Técnicos de manutenção industrial utilizando tablet para monitoramento de equipamentos',
    icon: LayerIcon,
    titleHighlight: 'Uma solução',
    title: 'que integra',
    textContent: 'Entendemos o papel central das pessoas na indústria e a importância da integração entre setores. Com dados e tecnologia, apoiamos a busca pela máxima produtividade e segurança.',
    linkLabel: 'Leia mais',
    linkUrl: 'https://dynamox.net/blog',
    reverse: true
  },
  {
    imageSrc: teamMeetingPlanning,
    imageAlt: 'Equipe em reunião de planejamento analisando dados em quadro branco',
    icon: ChatIcon,
    titleHighlight: 'Uma solução',
    title: 'que viabiliza a comunicação',
    textContent: 'Temos a comunicação como a base das relações humanas e dos sistemas de informação na tecnologia. Derrubamos as barreiras de compreensão entre diferentes grupos criadas pela especialização.',
    linkLabel: 'Leia mais',
    linkUrl: 'https://dynamox.net/blog',
  },
    {
    imageSrc: engineersInspection,
    imageAlt: 'Engenheiros em campo realizando inspeção industrial com equipamentos de segurança',
    icon: ConectionIcon,
    titleHighlight: 'Uma plataforma que',
    title: 'se comunica de ponta a ponta',
    textContent: 'Tecnologia que {{conecta, unifica}} e proporciona a {{comunicação efetiva}} de ponta a ponta.',
    linkLabel: 'Leia mais',
    linkUrl: 'https://dynamox.net/blog',
    reverse: true
  }
]


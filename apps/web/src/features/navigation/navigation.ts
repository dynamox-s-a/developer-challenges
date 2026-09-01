/**
 * Destinos do menu lateral, em um lugar só.
 *
 * O sidenav lista DESTINOS DE PRIMEIRO NÍVEL — nunca rotas contextuais. "Nova máquina",
 * "editar", "aquisição" e "detalhe do alerta" são alcançados de dentro da página e voltam
 * pela trilha (breadcrumb); colocá-los aqui transformaria o menu num mapa do site.
 *
 * Os grupos separam as duas perguntas que a aplicação responde: **o que está acontecendo
 * agora** (monitoramento) e **o que existe na planta** (cadastro). A página da máquina é
 * canônica e junta operação e cadastro — por isso ela aparece UMA vez, no cadastro, com a
 * descrição dizendo que também abre a operação do ativo.
 */
export interface NavItem {
  /** Rota canônica do destino. */
  to: string;
  label: string;
  /** Segunda linha: para que serve o destino, não o que ele é. */
  description: string;
  /**
   * Prefixos extras que mantêm este item ativo. É aqui que a árvore de investigação se
   * declara: cada rota profunda aponta para o ÍNDICE do seu recurso, não para o degrau
   * anterior da trilha — `/sensors/:serial` pertence ao registro de instrumentação, que é a
   * página que lista sensores, e não à lista de máquinas.
   */
  match?: string[];
}

export interface NavGroup {
  /** Rótulo discreto da seção; identifica o grupo para leitores de tela. */
  label: string;
  id: string;
  items: NavItem[];
}

export const NAV_GROUPS: readonly NavGroup[] = [
  {
    id: 'monitoramento',
    label: 'Monitoramento',
    items: [
      {
        to: '/',
        label: 'Visão geral',
        description: 'Condição, prioridade e tendência',
        // A janela horária nasce do mapa de calor do painel e volta para ele.
        match: ['/monitoring/windows'],
      },
      {
        to: '/alerts',
        label: 'Alertas',
        description: 'Episódios A1/A2 abertos pelo motor',
      },
    ],
  },
  {
    id: 'cadastro',
    label: 'Cadastro',
    items: [
      {
        to: '/machines',
        label: 'Máquinas',
        description: 'Cadastro e condição dos ativos',
        // `/machines/:key/points/:point` já cai aqui pelo prefixo: um ponto pertence a uma
        // máquina, e é dentro dela que ele é descoberto. `/assets` é o endereço antigo.
        match: ['/assets'],
      },
      {
        to: '/monitoring-points',
        label: 'Pontos e sensores',
        description: 'Instrumentação de toda a planta',
        /*
         * O sensor tem rota própria de primeiro nível (`/sensors/:serial`) e o índice dele é
         * ESTE registro — é aqui que cada série aparece como linha e leva à página do sensor.
         * A aquisição e as amostras descem do sensor, então herdam o mesmo ramo. Marcar
         * "Máquinas" seria apontar para o índice do recurso errado.
         */
        match: ['/sensors', '/acquisitions'],
      },
    ],
  },
];

/**
 * O item está no caminho atual? A raiz casa exatamente (senão ficaria ativa em tudo); os
 * demais casam com o próprio caminho e com seus descendentes, porque `/machines/P-101/edit`
 * ainda é "Máquinas".
 */
export function isNavItemActive(item: NavItem, pathname: string): boolean {
  return [item.to, ...(item.match ?? [])].some((path) =>
    path === '/' ? pathname === '/' : pathname === path || pathname.startsWith(`${path}/`),
  );
}

/** O grupo que contém o caminho atual — usado para destacar a seção junto com o item. */
export function activeNavGroup(pathname: string): NavGroup | null {
  return NAV_GROUPS.find((group) => group.items.some((item) => isNavItemActive(item, pathname))) ?? null;
}

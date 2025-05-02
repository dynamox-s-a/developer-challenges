import type { Meta, StoryObj } from "@storybook/react";
import { EventFilters } from "./index";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { eventsSlice } from "@/store/events/slice";
import { authSlice } from "@/store/auth/slice";
import type { RootState } from "@/store";

// Store padrão para o exemplo Default
const defaultStore = configureStore({
	reducer: {
		events: eventsSlice.reducer,
		auth: authSlice.reducer,
	},
});

// Store com filtros pré-aplicados
const storeWithFilters = configureStore<RootState>({
	reducer: {
		events: eventsSlice.reducer,
		auth: authSlice.reducer,
	},
	preloadedState: {
		events: {
			filters: {
				searchTerm: "Workshop",
				period: "future" as const,
				sortBy: "title" as const,
				order: "asc" as const,
			},
			items: [],
			filteredItems: [],
			loading: false,
			error: null,
		},
		auth: {
			user: null,
			isAuthenticated: false,
			isInitialized: false,
		},
	},
});

/**
 * O componente EventFilters é responsável por fornecer uma interface de filtragem e ordenação para a lista de eventos.
 *
 * ### Funcionalidades
 *
 * #### Busca por Texto
 * - Campo de busca que filtra eventos por título ou descrição
 * - Atualização em tempo real conforme o usuário digita
 *
 * #### Filtro por Período
 * - **Todos os eventos**: Exibe todos os eventos sem filtro de data
 * - **Eventos futuros**: Mostra apenas eventos com data posterior à atual
 * - **Eventos passados**: Mostra apenas eventos com data anterior à atual
 *
 * #### Ordenação
 * - Por Data:
 *   - Mais recente (padrão)
 *   - Mais antiga
 * - Por Nome:
 *   - A-Z
 *   - Z-A
 *
 * #### Reset de Filtros
 * - Botão para limpar todos os filtros aplicados
 * - Desabilitado quando os filtros estão em seu estado inicial
 *
 * ### Integração com Redux
 * O componente utiliza o Redux para gerenciar o estado dos filtros:
 * - `searchTerm`: Termo de busca
 * - `period`: Período selecionado (all | future | past)
 * - `sortBy`: Campo de ordenação (date | title)
 * - `order`: Direção da ordenação (asc | desc)
 *
 * ### Estilização
 * - Utiliza o tema Material-UI com cores personalizadas
 * - Campos com bordas e cores consistentes com a identidade visual
 * - Layout responsivo com espaçamento adequado entre elementos
 */

const meta = {
	title: "Components/EventFilters",
	component: EventFilters,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<div style={{ width: "600px", padding: "1rem" }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof EventFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Estado inicial do componente, sem filtros aplicados.
 * - Campo de busca vazio
 * - Período: Todos os eventos
 * - Ordenação: Data (mais recente)
 */
export const Default: Story = {
	decorators: [
		(Story) => (
			<Provider store={defaultStore}>
				<Story />
			</Provider>
		),
	],
};

/**
 * Exemplo de como o componente se comporta com filtros ativos.
 *
 * Você pode:
 * 1. Digitar no campo de busca para filtrar eventos
 * 2. Selecionar diferentes períodos (todos, futuros, passados)
 * 3. Alterar a ordenação por data ou título
 * 4. Usar o botão "Limpar filtros" para resetar tudo
 *
 * O botão de limpar filtros fica habilitado apenas quando há
 * filtros diferentes do padrão aplicados.
 */
export const WithFiltersApplied: Story = {
	decorators: [
		(Story) => (
			<Provider store={storeWithFilters}>
				<Story />
			</Provider>
		),
	],
};

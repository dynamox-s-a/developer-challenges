import { describe, it, expect } from "vitest";
import eventsReducer, {
  clearError,
  createEvent,
  deleteEvent,
  fetchEvents,
  updateEvent,
} from "./eventsSlice";

describe("EventsSlice - Redux de Eventos", () => {
  const initialState = {
    events: [],
    loading: false,
    error: null,
    filters: {
      timeFilter: "all" as const,
    },
  };

  it("deve retornar o estado inicial", () => {
    const state = eventsReducer(undefined, { type: "unknown" });

    expect(state).toEqual(initialState);
  });

  describe("clearError", () => {
    it("deve limpar mensagem de erro", () => {
      const stateWithError = {
        events: [],
        loading: false,
        error: "Erro ao buscar eventos",
        filters: {
          timeFilter: "all" as const,
        },
      };

      const newState = eventsReducer(stateWithError, clearError());

      expect(newState.error).toBeNull();
      expect(newState.events).toEqual([]);
      expect(newState.loading).toBe(false);
    });

    it("deve funcionar quando não há erro", () => {
      const newState = eventsReducer(initialState, clearError());

      expect(newState.error).toBeNull();
    });
  });

  describe("Estado com eventos", () => {
    it("não deve perder eventos ao limpar erro", () => {
      const stateWithEvents = {
        events: [
          {
            id: 1,
            name: "Evento Teste",
            date: "2026-03-15T10:00:00",
            location: "São Paulo",
            description:
              "Descrição do evento de teste com mais de cinquenta caracteres.",
            category: "Conferência" as const,
          },
        ],
        loading: false,
        error: "Algum erro",
        filters: {
          timeFilter: "all" as const,
        },
      };

      const newState = eventsReducer(stateWithEvents, clearError());

      expect(newState.error).toBeNull();
      expect(newState.events).toHaveLength(1);
      expect(newState.events[0].name).toBe("Evento Teste");
    });
  });

  describe("Estados de loading", () => {
    it("deve manter estado de eventos quando há erro", () => {
      const stateWithData = {
        events: [
          {
            id: 1,
            name: "Evento 1",
            date: "2026-03-15T10:00:00",
            location: "Rio de Janeiro",
            description:
              "Um evento interessante sobre tecnologia e inovação no Brasil.",
            category: "Workshop" as const,
          },
        ],
        loading: false,
        error: "Erro de rede",
        filters: {
          timeFilter: "all" as const,
        },
      };

      const newState = eventsReducer(stateWithData, clearError());

      expect(newState.events).toHaveLength(1);
      expect(newState.error).toBeNull();
    });
  });

  describe("Estrutura de eventos", () => {
    it("deve aceitar array vazio de eventos", () => {
      const state = eventsReducer(initialState, { type: "unknown" });

      expect(Array.isArray(state.events)).toBe(true);
      expect(state.events).toHaveLength(0);
    });

    it("deve manter estrutura correta do estado", () => {
      const state = eventsReducer(undefined, { type: "unknown" });

      expect(state).toHaveProperty("events");
      expect(state).toHaveProperty("loading");
      expect(state).toHaveProperty("error");
      expect(state).toHaveProperty("filters");
    });
  });

  describe("Async thunks - extraReducers", () => {
    it("deve setar loading true ao buscar eventos", () => {
      const state = eventsReducer(
        initialState,
        fetchEvents.pending("", undefined),
      );

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("deve preencher eventos ao buscar com sucesso", () => {
      const events = [
        {
          id: 1,
          name: "Evento 1",
          date: "2026-03-15T10:00:00",
          location: "São Paulo",
          description: "Descrição longa o suficiente para o evento.",
          category: "Conferência" as const,
        },
      ];

      const state = eventsReducer(
        { ...initialState, loading: true },
        fetchEvents.fulfilled(events, "", undefined),
      );

      expect(state.loading).toBe(false);
      expect(state.events).toHaveLength(1);
    });

    it("deve setar erro ao falhar busca de eventos", () => {
      const state = eventsReducer(
        { ...initialState, loading: true },
        fetchEvents.rejected(null, "", undefined),
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe("Erro ao buscar eventos");
    });

    it("deve adicionar evento ao criar com sucesso", () => {
      const newEvent = {
        id: 2,
        name: "Novo Evento",
        date: "2026-04-10T14:00:00",
        location: "Online",
        description: "Descrição válida com mais de cinquenta caracteres.",
        category: "Webinar" as const,
      };

      const state = eventsReducer(
        initialState,
        createEvent.fulfilled(newEvent, "", newEvent),
      );

      expect(state.events).toHaveLength(1);
      expect(state.events[0].id).toBe(2);
    });

    it("deve atualizar evento existente", () => {
      const stateWithEvent = {
        ...initialState,
        events: [
          {
            id: 1,
            name: "Evento Antigo",
            date: "2026-03-15T10:00:00",
            location: "SP",
            description: "Descrição antiga longa o suficiente.",
            category: "Workshop" as const,
          },
        ],
      };

      const updatedEvent = {
        ...stateWithEvent.events[0],
        name: "Evento Atualizado",
      };

      const state = eventsReducer(
        stateWithEvent,
        updateEvent.fulfilled(updatedEvent, "", {
          id: 1,
          eventData: updatedEvent,
        }),
      );

      expect(state.events[0].name).toBe("Evento Atualizado");
    });

    it("deve remover evento pelo id", () => {
      const stateWithEvents = {
        ...initialState,
        events: [
          {
            id: 1,
            name: "Evento",
            date: "2026-03-15T10:00:00",
            location: "RJ",
            description: "Descrição longa o suficiente.",
            category: "Outro" as const,
          },
        ],
      };

      const state = eventsReducer(
        stateWithEvents,
        deleteEvent.fulfilled(1, "", 1),
      );

      expect(state.events).toHaveLength(0);
    });
  });
});

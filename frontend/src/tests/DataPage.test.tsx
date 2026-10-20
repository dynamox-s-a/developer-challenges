import { describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import DataPage from "../app/pages/DataPage";
import { renderWithProviders, stubApi } from "./utils";
import { chartsFixture, machineFixture } from "./features/data/fixtures";

describe("DataPage", () => {
  it("fetches on mount and renders machine info and three chart cards", async () => {
    stubApi();
    renderWithProviders(<DataPage />);

    expect(await screen.findByText("Máquina 1023")).toBeInTheDocument();
    for (const name of ["Aceleração RMS", "Temperatura", "Velocidade RMS"]) {
      expect(screen.getByRole("region", { name })).toBeInTheDocument();
    }
  });

  it("fetches again on every mount", async () => {
    const fetchMock = stubApi();
    const first = renderWithProviders(<DataPage />);
    await screen.findByText("Máquina 1023");
    first.unmount();

    renderWithProviders(<DataPage />);
    await screen.findByText("Máquina 1023");

    const machineCalls = fetchMock.mock.calls.filter(([url]) =>
      String(url).endsWith("/machine"),
    );
    expect(machineCalls).toHaveLength(2);
  });

  it("keeps showing stale data while refetching", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {})),
    );
    const { store } = renderWithProviders(<DataPage />, {
      preloadedState: {
        data: {
          status: "succeeded",
          error: null,
          machine: machineFixture,
          charts: chartsFixture,
        },
      },
    });

    expect(store.getState().data.status).toBe("loading");
    expect(screen.getByText("Máquina 1023")).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Temperatura" }),
    ).toBeInTheDocument();
  });

  it("shows a spinner while loading with no data", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {})),
    );
    renderWithProviders(<DataPage />);

    expect(
      screen.getByRole("progressbar", { name: "Carregando dados" }),
    ).toBeInTheDocument();
  });

  it("shows an error with retry and no charts when the first load fails", async () => {
    vi.stubEnv("VITE_API_URL", "http://api.test");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("", { status: 500 })),
    );
    renderWithProviders(<DataPage />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível carregar os dados",
    );
    expect(
      screen.queryByRole("region", { name: "Temperatura" }),
    ).not.toBeInTheDocument();
  });

  it("retries when clicking the retry button", async () => {
    const fetchMock = vi.fn<typeof fetch>(
      async () => new Response("", { status: 500 }),
    );
    vi.stubEnv("VITE_API_URL", "http://api.test");
    vi.stubGlobal("fetch", fetchMock);
    renderWithProviders(<DataPage />);

    await userEvent.click(
      await screen.findByRole("button", { name: "Tentar novamente" }),
    );

    await waitFor(() => expect(fetchMock.mock.calls.length).toBeGreaterThan(2));
  });

  it("keeps stale charts and shows an error when a refetch fails", async () => {
    vi.stubEnv("VITE_API_URL", "http://api.test");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("", { status: 500 })),
    );
    renderWithProviders(<DataPage />, {
      preloadedState: {
        data: {
          status: "idle",
          error: null,
          machine: machineFixture,
          charts: chartsFixture,
        },
      },
    });

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Máquina 1023")).toBeInTheDocument();
    for (const name of ["Aceleração RMS", "Temperatura", "Velocidade RMS"]) {
      expect(screen.getByRole("region", { name })).toBeInTheDocument();
    }
  });
});

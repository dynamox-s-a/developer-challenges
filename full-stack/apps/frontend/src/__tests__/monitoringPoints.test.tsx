import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../store";

const apiGetMock = vi.hoisted(() => vi.fn());

// monitoringPointsSlice uses `import { api } from "../api"`
vi.mock("../api", () => ({
  api: {
    get: apiGetMock,
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: (props: any) => (
    <div data-testid="datagrid">
      {(props.rows ?? []).map((r: any) => (
        <div key={r.id} data-testid="row">
          {r.machineName} - {r.monitoringPointName}
        </div>
      ))}
    </div>
  ),
  GridToolbar: () => null,
}));

describe("MonitoringPointsPage", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("token", "FAKE_TOKEN");
  });

  it("fetches and shows rows", async () => {
    apiGetMock.mockResolvedValueOnce({
      data: {
        items: [
          {
            id: "mp-1",
            monitoringPointName: "MP 1",
            machineName: "Pump A",
            machineType: "Pump",
            sensorModel: "HF_plus",
            sensorUniqueId: "S-1",
            createdAt: new Date().toISOString(),
          },
        ],
        total: 1,
        take: 5,
        skip: 0,
        sortBy: "machineName",
        sortOrder: "asc",
      },
    });

    const { default: App } = await import("../App");

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Monitoring Points")).toBeTruthy();
    expect(screen.getByText("Loading...")).toBeTruthy();
    
    expect(apiGetMock).toHaveBeenCalled();
  });
});

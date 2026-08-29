import type { Machine } from "@dyn/contracts";
import { ThemeProvider } from "@mui/material";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import type { ApiClient } from "../../api/client";
import { createAppStore } from "../../app/store";
import { theme } from "../../app/theme";
import { AppShell } from "../../layout/AppShell";
import { createFakeApi } from "../../test/fakeApi";
import { MachinesPage } from "./MachinesPage";

const MACHINE_ID = "00000000-0000-4000-8000-000000000001";

const machine: Machine = {
  id: MACHINE_ID,
  name: "Primary pump",
  type: "Pump",
  createdAt: "2026-08-24T12:00:00.000Z",
  updatedAt: "2026-08-24T12:00:00.000Z",
};

const fan: Machine = { ...machine, name: "Cooling fan", type: "Fan" };

const INCOMPATIBLE_MESSAGE =
  "Machine type cannot change to Pump because Pump machines only support HF+ sensors, and this machine has TcAg sensors attached";

// Rendered inside the shell because the success snackbar lives there, not on the page.
function renderPage(overrides: Partial<ApiClient> = {}) {
  const store = createAppStore(createFakeApi(overrides));
  render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <MemoryRouter
          future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
          initialEntries={["/machines"]}
        >
          <Routes>
            <Route element={<AppShell />}>
              <Route element={<MachinesPage />} path="machines" />
            </Route>
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    </Provider>
  );
  return store;
}

describe("MachinesPage", () => {
  it("confirms a delete with a success snackbar and removes the row", async () => {
    const user = userEvent.setup();
    renderPage({ listMachines: async () => [machine] });
    expect(await screen.findByText("Primary pump")).toBeInTheDocument();

    await user.click(screen.getByLabelText("Delete Primary pump"));
    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(await screen.findByText("Machine deleted")).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText("Primary pump")).not.toBeInTheDocument());
  });

  it("keeps the row unchanged when the confirmation is cancelled", async () => {
    const user = userEvent.setup();
    const deleteMachine = vi.fn(async () => undefined);
    renderPage({ listMachines: async () => [machine], deleteMachine });
    expect(await screen.findByText("Primary pump")).toBeInTheDocument();

    await user.click(screen.getByLabelText("Delete Primary pump"));
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(deleteMachine).not.toHaveBeenCalled();
    expect(screen.getByText("Primary pump")).toBeInTheDocument();
  });

  it("surfaces an incompatible Fan to Pump change inside the edit dialog", async () => {
    const user = userEvent.setup();
    const updateMachine = vi
      .fn<ApiClient["updateMachine"]>()
      .mockRejectedValue(new Error(INCOMPATIBLE_MESSAGE));
    renderPage({ listMachines: async () => [fan], updateMachine });

    await user.click(await screen.findByLabelText("Edit Cooling fan"));
    await user.click(screen.getByLabelText("Machine type"));
    await user.click(screen.getByRole("option", { name: "Pump" }));
    await user.click(screen.getByRole("button", { name: "Save" }));

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("alert")).toHaveTextContent(/only support HF\+ sensors/);
    expect(updateMachine).toHaveBeenCalledWith(MACHINE_ID, { name: "Cooling fan", type: "Pump" });
    // The rejected change must not be reflected optimistically in the row chip.
    expect(screen.getByText("Fan")).toBeInTheDocument();
  });

  it("clears a rejected edit before another machine dialog opens", async () => {
    const user = userEvent.setup();
    const updateMachine = vi
      .fn<ApiClient["updateMachine"]>()
      .mockRejectedValue(new Error(INCOMPATIBLE_MESSAGE));
    renderPage({
      listMachines: async () => [fan],
      updateMachine,
    });

    await user.click(await screen.findByLabelText("Edit Cooling fan"));
    await user.click(screen.getByLabelText("Machine type"));
    await user.click(screen.getByRole("option", { name: "Pump" }));
    await user.click(screen.getByRole("button", { name: "Save" }));

    const editDialog = await screen.findByRole("dialog");
    expect(within(editDialog).getByRole("alert")).toHaveTextContent(/only support HF\+ sensors/);
    await user.click(within(editDialog).getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: "Add machine" }));
    expect(within(await screen.findByRole("dialog")).queryByRole("alert")).not.toBeInTheDocument();
  });

  it("closes the dialog and retypes the row when the type change is accepted", async () => {
    const user = userEvent.setup();
    renderPage({
      listMachines: async () => [fan],
      updateMachine: async () => ({ ...fan, type: "Pump" }),
    });

    await user.click(await screen.findByLabelText("Edit Cooling fan"));
    await user.click(screen.getByLabelText("Machine type"));
    await user.click(screen.getByRole("option", { name: "Pump" }));
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Machine updated")).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    const table = within(screen.getByRole("table"));
    expect(table.getByText("Pump")).toBeInTheDocument();
    expect(table.queryByText("Fan")).not.toBeInTheDocument();
  });
});

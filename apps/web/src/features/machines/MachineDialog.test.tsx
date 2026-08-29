import type { Machine } from "@dyn/contracts";
import { ThemeProvider } from "@mui/material";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { theme } from "../../app/theme";
import { MachineDialog } from "./MachineDialog";

const machine: Machine = {
  id: "0b64ba99-ac8b-44f0-8c32-972f0a8be903",
  name: "Primary pump",
  type: "Pump",
  createdAt: "2026-08-24T12:00:00.000Z",
  updatedAt: "2026-08-24T12:00:00.000Z",
};

function renderDialog(props: { onSubmit: (input: unknown) => void; error?: string | null }) {
  render(
    <ThemeProvider theme={theme}>
      <MachineDialog
        error={props.error ?? null}
        machine={machine}
        onClose={() => undefined}
        onSubmit={props.onSubmit}
        open
        pending={false}
      />
    </ThemeProvider>
  );
}

describe("MachineDialog", () => {
  it("edits the name and the type of an existing machine", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderDialog({ onSubmit });

    const name = screen.getByLabelText(/Machine name/i);
    await user.clear(name);
    await user.type(name, "Renamed pump");

    await user.click(screen.getByLabelText("Machine type"));
    await user.click(screen.getByRole("option", { name: "Fan" }));
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onSubmit).toHaveBeenCalledWith({ name: "Renamed pump", type: "Fan" });
  });

  it("preselects the current type and surfaces a rejected type change", () => {
    renderDialog({
      onSubmit: vi.fn(),
      error: "Machine type cannot change to Pump because Pump machines only support HF+ sensors",
    });

    expect(screen.getByLabelText("Machine type")).toHaveTextContent("Pump");
    expect(screen.getByRole("alert")).toHaveTextContent(/only support HF\+ sensors/);
  });
});

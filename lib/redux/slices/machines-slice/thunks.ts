import { createAppAsyncThunk } from "@/lib/redux/createAppAsyncThunk";

interface NewMachine {
  name: string;
  type: string;
}

interface UpdateMachine {
  id: number;
  name: string;
  type: string;
}

interface DeleteMachine {
  id: number;
}

export const getMachines = createAppAsyncThunk("machines/getMachines", async () => {
  const response = await fetch("/api/machine");
  const result = await response.json();

  // The value we return becomes the `fulfilled` action payload
  return result;
});

export const createMachine = createAppAsyncThunk(
  "machines/createMachine",
  async (machine: NewMachine) => {
    const response = await fetch("/api/machine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(machine),
    });
    const result = await response.json();

    return result;
  }
);

export const updateMachine = createAppAsyncThunk(
  "machines/updateMachine",
  async ({ id, name, type }: UpdateMachine) => {
    const response = await fetch(`/api/machine/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        type,
      }),
    });
    const result = await response.json();

    return result;
  }
);

export const deleteMachine = createAppAsyncThunk(
  "machines/deleteMachine",
  async ({ id }: DeleteMachine) => {
    const response = await fetch(`/api/machine/${id}`, {
      method: "DELETE",
    });
    const result = await response.json();

    return result;
  }
);

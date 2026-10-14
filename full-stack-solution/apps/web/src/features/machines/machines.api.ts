import type {
  CreateMachineInput,
  Machine,
  UpdateMachineInput,
} from "@full-stack-solution/shared";
import { request } from "@web/api/http-client";

/** `GET /api/machines` — every machine owned by the signed-in user. */
export function listMachines(token: string): Promise<Machine[]> {
  return request<Machine[]>("/api/machines", { token });
}

/** `POST /api/machines` */
export function createMachine(
  token: string,
  input: CreateMachineInput,
): Promise<Machine> {
  return request<Machine>("/api/machines", {
    method: "POST",
    body: input,
    token,
  });
}

/** `PATCH /api/machines/:id` */
export function updateMachine(
  token: string,
  id: string,
  input: UpdateMachineInput,
): Promise<Machine> {
  return request<Machine>(`/api/machines/${id}`, {
    method: "PATCH",
    body: input,
    token,
  });
}

/** `DELETE /api/machines/:id` — cascades to monitoring points and readings. */
export function deleteMachine(token: string, id: string): Promise<void> {
  return request<void>(`/api/machines/${id}`, { method: "DELETE", token });
}

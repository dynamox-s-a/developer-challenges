import type { SerializedApiError } from "@web/api/api-error";
import type { RootState } from "./store";

/**
 * Shared `createAsyncThunk` configuration.
 *
 * Every thunk reads the auth token from the store and rejects with a
 * serialized API error, so reducers never have to handle class instances
 * (which Redux cannot serialize).
 */
export interface ThunkConfig {
  state: RootState;
  rejectValue: SerializedApiError;
}

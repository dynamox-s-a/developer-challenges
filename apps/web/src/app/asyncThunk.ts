import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ApiClient } from "../api/client";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{ extra: ApiClient }>();

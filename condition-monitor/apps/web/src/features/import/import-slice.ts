import type { IngestionReport } from '@condition-monitor/shared';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toFailure, type RequestFailure } from '../../api/failure';
import { ApiError, postForm } from '../../api/http';

/** One refused line of the file, or the file itself when `line` is null. */
export interface ImportError {
  line: number | null;
  field: string;
  message: string;
}

export interface ImportFailure extends RequestFailure {
  errors: ImportError[];
}

export interface ImportState {
  status: 'idle' | 'uploading' | 'done' | 'failed';
  report: IngestionReport | null;
  failure: ImportFailure | null;
}

const initialState: ImportState = { status: 'idle', report: null, failure: null };

function importErrorsOf(error: unknown): ImportError[] {
  if (!(error instanceof ApiError)) return [];
  return (error.problem?.errors ?? []).flatMap((item) =>
    typeof item['field'] === 'string' && typeof item['message'] === 'string'
      ? [
          {
            line: typeof item['line'] === 'number' ? item['line'] : null,
            field: item['field'],
            message: item['message'],
          },
        ]
      : [],
  );
}

/** Uploads the file; every line is stored or none is (C4). */
export const importFile = createAsyncThunk<IngestionReport, File, { rejectValue: ImportFailure }>(
  'import/upload',
  async (file, { rejectWithValue }) => {
    const form = new FormData();
    form.append('file', file);
    try {
      return await postForm<IngestionReport>('/imports', form);
    } catch (error) {
      return rejectWithValue({ ...toFailure(error), errors: importErrorsOf(error) });
    }
  },
);

export const importSlice = createSlice({
  name: 'import',
  initialState,
  reducers: {
    /** A new file was chosen: the previous answer no longer describes it. */
    importCleared: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(importFile.pending, (state) => {
        state.status = 'uploading';
        state.report = null;
        state.failure = null;
      })
      .addCase(importFile.fulfilled, (state, action) => {
        state.status = 'done';
        state.report = action.payload;
      })
      .addCase(importFile.rejected, (state, action) => {
        state.status = 'failed';
        state.failure = action.payload ?? {
          status: null,
          message: 'The import failed.',
          fieldErrors: [],
          reasons: [],
          errors: [],
        };
      });
  },
});

export const { importCleared } = importSlice.actions;

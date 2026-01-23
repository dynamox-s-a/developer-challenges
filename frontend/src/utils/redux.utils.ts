import type { ActionReducerMapBuilder, AsyncThunk, Draft } from '@reduxjs/toolkit';

interface AsyncState {
  loading: boolean;
  error: string | null;
}

export function addAsyncHandlers<State extends AsyncState, Returned, ThunkArg>(
  builder: ActionReducerMapBuilder<State>,
  thunk: AsyncThunk<Returned, ThunkArg, any>,
  handlers?: {
    onPending?: (state: Draft<State>) => void;
    onFulfilled?: (state: Draft<State>, action: any) => void;
    onRejected?: (state: Draft<State>, action: any) => void;
  }
) {
  builder
    .addCase(thunk.pending, (state) => {
      state.loading = true;
      state.error = null;
      handlers?.onPending?.(state);
    })
    .addCase(thunk.fulfilled, (state, action) => {
      state.loading = false;
      handlers?.onFulfilled?.(state, action);
    })
    .addCase(thunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Erro desconhecido';
      handlers?.onRejected?.(state, action);
    });
}
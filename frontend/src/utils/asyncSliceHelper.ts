export const handleAsyncAction = <T>(
  builder: any,
  actionType: string,
  successAction: (state: any, action: any) => void,
) => {
  builder
    .addCase(`${actionType}/pending`, (state: any) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(`${actionType}/fulfilled`, (state: any, action: any) => {
      state.isLoading = false;
      successAction(state, action);
    })
    .addCase(`${actionType}/rejected`, (state: any, action: any) => {
      state.isLoading = false;
      state.error = action.error.message || "Request failed";
    });
};

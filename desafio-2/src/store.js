import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/user/userSlice";
import itemSlice from "./features/Item/itemSlice";
import allitemsSlice from "./features/Item/allitemsSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    item: itemSlice,
    allitems: allitemsSlice,
  },
});

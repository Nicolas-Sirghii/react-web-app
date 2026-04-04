import { configureStore } from "@reduxjs/toolkit";

import urlSlice from "./slices/pathSlice"

export const store = configureStore({
  reducer: {
    path: urlSlice,
  },
});
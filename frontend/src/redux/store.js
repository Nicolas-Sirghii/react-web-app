import { configureStore } from "@reduxjs/toolkit";

import urlSlice from "./slices/pathSlice"
import loginSlice from "./slices/loginSlice"

export const store = configureStore({
  reducer: {
    path: urlSlice,
    user_data: loginSlice
  },
});
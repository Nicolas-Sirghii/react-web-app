import { configureStore } from "@reduxjs/toolkit";

import urlSlice from "./slices/pathSlice"
import loginSlice from "./slices/loginSlice"
import userSlice from "./slices/userSlice"

export const store = configureStore({
  reducer: {
    path: urlSlice,
    user_data: loginSlice,
    userSlice
  },
});
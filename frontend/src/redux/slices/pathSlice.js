import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  path: "/api",
  pathFlag: false
};

const urlSlice = createSlice({
  name: "host",
  initialState,
  reducers: {
    changePath: (state) => {
      state.pathFlag = !state.pathFlag
      if (state.pathFlag) {
        state.path = "http://127.0.0.1:8000";
      }else{
        state.path = "/api"
      }
    },

  },
});

export const { changePath } = urlSlice.actions;
export default urlSlice.reducer;
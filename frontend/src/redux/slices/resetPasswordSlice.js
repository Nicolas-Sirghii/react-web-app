import { createSlice } from "@reduxjs/toolkit";
const initialState = {
 step: 1,
 email: "",
 code: "",
 newPassword: "",
 message: "",
 showPopup: "",
 isError: false,

 status: "Verifying..."
};

const resetPassSlice = createSlice({
  name: "reset",
  initialState,
  reducers: {
   setStep: (state, action) => {
    state.step = action.payload;
   },
   setEmail: (state, action) => {
    state.email = action.payload;
   },
   setCode: (state, action) => {
    state.code = action.payload;
   },
   setNewPassword: (state, action) => {
    state.newPassword = action.payload;
   },
   setMessage: (state, action) => {
    state.message = action.payload;
   },
   setShowPopup: (state, actoin) => {
    state.showPopup = actoin.payload;
   },
   setIsError: (state, action) => {
    state.isError = action.payload;
   }
  },
  setStatus: (state, action) => {
    state.status = action.payload;
  }
});

export const { setStep, setEmail, setCode, setNewPassword, setMessage, setShowPopup, setIsError, setStatus  } = resetPassSlice.actions;
export default resetPassSlice.reducer;
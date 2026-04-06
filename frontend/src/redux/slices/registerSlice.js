import { createSlice } from "@reduxjs/toolkit";



const initialState = {
 form: {
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  },
  message: "",
  showPopup: false,
  isError: false,
  showPassword: false,
};

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
   setForm: (state, action) => {
    state.form = action.payload
   },
   setMessage: (state, action) => {
    state.message = action.payload;
   },
   setShowPopup: (state, action) => {
    state.showPopup = action.payload;
   },
   setIsError: (state, action) => {
    state.isError = action.payload;
   },
   setShowPassword: (state, action) => {
    state.showPassword = action.payload;
   }
  },
});

export const { setForm, setMessage, setShowPopup, setIsError, setShowPassword  } = registerSlice.actions;
export default registerSlice.reducer;
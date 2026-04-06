import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  form: { email: "", password: "" },
  error: "",
  showPopup: false,
  showPassword: false,
  loading: false,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setForm: (state, action) => {
        state.form = action.payload;
    },
    setError: (state, action) => {
        state.error = action.payload;
    },
    setShowPopup: (state, action) => {
        state.showPopup = action.payload;
    },
    setShowPassword: (state, action) => {
        state.showPassword = action.payload;
    },
    setLoading: (state, action) => {
        state.loading = action.payload;
    }
  },
});

export const { setForm, setError, setShowPopup, setShowPassword, setLoading } = loginSlice.actions;
export default loginSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";



const initialState = {
  form: { email: "", password: "" },
  error: "",
  showPopup: false,
  showPassword: false,
  loading: false,
  is_autorized: false,
  timeLeft: null
  
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
    },
    setAutorization: (state, action) => {
            state.is_autorized = action.payload; 
    },
    setTimeLeft: (state) => {
        state.is_autorized = true
        const expiresAt = localStorage.getItem("expires_at") || 0;
        state.timeLeft = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));

    }
  },
});

export const { setForm, setError, setShowPopup, setShowPassword, setLoading, setAutorization, setTimeLeft } = loginSlice.actions;
export default loginSlice.reducer;
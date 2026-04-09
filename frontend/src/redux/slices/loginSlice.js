import { createSlice } from "@reduxjs/toolkit";



const initialState = {
  form: { email: "", password: "" },
  error: "",
  showPopup: false,
  showPassword: false,
  loading: false,
  is_autorized: false,
  timeLeft: 0
  
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
    check_autorization: (state, action) => {
            state.is_autorized = action.payload; 
    },
    setTimeLeft: (state) => {
        const expiresAt = localStorage.getItem("expires_at");
        if (!expiresAt) return 0;
        state.timeLeft = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
    }
  },
});

export const { setForm, setError, setShowPopup, setShowPassword, setLoading, check_autorization, setTimeLeft } = loginSlice.actions;
export default loginSlice.reducer;
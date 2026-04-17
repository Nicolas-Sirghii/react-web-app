import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    state: "idle",
    dots: "",
    timeLeft: 0,
    message: "",
    popup: false,

};

const verifiEmail = createSlice({
    name: "verifiEmail",
    initialState,
    reducers: {
        setState: (state, action ) => {
            state.state = action.payload;
        },
        setDots: ( state, action ) => {
            state.dots = action.payload;
        },
        setTimeLeft: ( state, action ) => {
            state.timeLeft = action.payload;
        },
        setMessage: ( state, action ) => {
            state.message = action.payload;
        },
        setPopup: ( state, action ) => {
            state.popup = action.payload;
        }


    },
});

export const { setState, setDots, setTimeLeft, setMessage, setPopup } = verifiEmail.actions;
export default verifiEmail.reducer;
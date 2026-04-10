import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem("neonverseUser")) || {
    id: 11,
    username: null,
    email: "",
    is_verified: 0,
    avatar_url: null,
    age: null,
    phone: null,
    gender: null,
    bio: null
    
};

const userSlice = createSlice({
    name: "user_information",
    initialState,
    reducers: {
        setUserData: (state, action) => {
            if (action.payload.email) {
                state.id          = action.payload.id
                state.username    = action.payload.username
                state.email       = action.payload.email
                state.is_verified = action.payload.is_verified
                state.avatar_url  = action.payload.avatar_url
                state.age         = action.payload.age
                state.phone       = action.payload.phone
                state.gender      = action.payload.gender
                state.bio         = action.payload.bio
                
                localStorage.setItem("neonverseUser", JSON.stringify(action.payload))
            }
        },
        setVerifiEmail: ( state ) => {
            state.is_verified = 1
            const local = JSON.parse(localStorage.getItem("neonverseUser"));
            local.is_verified = 1;
            localStorage.setItem("neonverseUser", JSON.stringify(local));
        },
       
    },
});

export const { setUserData, setVerifiEmail } = userSlice.actions;
export default userSlice.reducer;

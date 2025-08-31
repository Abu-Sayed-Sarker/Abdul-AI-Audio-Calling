import { createSlice } from "@reduxjs/toolkit";

const innitialState = {
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: innitialState,
  reducers: {
    setCredentials: (state, action) => {
      state.accessToken = action.payload;
    },
    logOut: (state) => {
      state.accessToken = null;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

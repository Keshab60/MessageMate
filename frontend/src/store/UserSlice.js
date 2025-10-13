import { createSlice } from "@reduxjs/toolkit";

// load saved user from localStorage if exists
const savedUser = sessionStorage.getItem("user")
  ? JSON.parse(sessionStorage.getItem("user"))
  : { id: null };

const UserSlice = createSlice({
  name: "user",
  initialState: savedUser,
  reducers: {
    setUser: (state, action) => {
      state.id = action.payload;
      sessionStorage.setItem("user", JSON.stringify(state)); // persist
    },
    clearUser: (state) => {
      state.id = null;
      sessionStorage.removeItem("user");
    }
  }
});

export const { setUser, clearUser } = UserSlice.actions;
export default UserSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const savedUser = sessionStorage.getItem("user")
  ? JSON.parse(sessionStorage.getItem("user"))
  : { id: null, email: null, name: null };

const UserSlice = createSlice({
  name: "user", /* we need this name because redux creates a action based on this name like
  userSlice.actions.setUser = function(payload) {
  return {
    type: "user/setUser",  // sliceName + "/" + reducerName
    payload
  };
}; and later on when we dispatch a event and we call setuser or clearuser that dispatch creates a action based on this predefined action and then we acess that action using action.payload.variablename and the action created during the dispatch looks like this 

const action = {
  type: "user/setUser",
  payload: { id: 1, name: "Keshab" }
};  
 that is why we use ction.payload.id 
*/
  initialState: savedUser,
  reducers: {
    setUser: (state, action) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.name = action.payload.name
      sessionStorage.setItem("user", JSON.stringify(state)); // persist
    },
    clearUser: (state) => {
      state.id = null;
      state.email = null;
      state.name = null;
      sessionStorage.removeItem("user");
    },
  },
});

export const { setUser, clearUser } = UserSlice.actions;
export default UserSlice.reducer;

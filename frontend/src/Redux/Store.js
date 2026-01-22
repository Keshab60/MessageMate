import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./UserSlice";  // import reducer

const store = configureStore({
  reducer: {
    user: userReducer,   // register slice here
  },
});

export default store;

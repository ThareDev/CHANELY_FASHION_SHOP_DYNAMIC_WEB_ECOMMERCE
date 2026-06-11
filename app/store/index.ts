// app/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/app/store/slices/authSlice";
import cartReducer from "@/app/store/slices/cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
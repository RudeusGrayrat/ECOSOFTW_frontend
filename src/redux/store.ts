// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

// 🔹 Crea el store (ya viene con thunk incluido por defecto)
export const store = configureStore({
  reducer: rootReducer,
});

// 🔹 Tipos inferidos automáticos
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

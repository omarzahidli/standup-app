import { configureStore } from '@reduxjs/toolkit';
import { standupsApi } from './standupsApi';

export const store = configureStore({
  reducer: {
    [standupsApi.reducerPath]: standupsApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(standupsApi.middleware),
});
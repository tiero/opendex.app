import { configureStore } from '@reduxjs/toolkit';
import swapsReducer from './swaps-slice';
import providersReducer from './providers-slice';

export const store = configureStore({
  reducer: {
    swaps: swapsReducer,
    providers: providersReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

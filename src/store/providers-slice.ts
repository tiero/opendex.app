import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProviderWithMarket } from '../components/TdexSwapFlow/constants';
import { RootState } from './index';

// Define a type for the slice state
interface ProvidersState {
  tdex: TdexState;
}

interface TdexState {
  bestProvider?: ProviderWithMarket;
}

// Define the initial state using that type
export const initialState: ProvidersState = {
  tdex: {},
};

export const providersSlice = createSlice({
  name: 'providers',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setTdex: (state, action: PayloadAction<TdexState>) => {
      state.tdex = action.payload;
    },
  },
});

export const { setTdex } = providersSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectTdex = (state: RootState) => state.providers.tdex;

export default providersSlice.reducer;

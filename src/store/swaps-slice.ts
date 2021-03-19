import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';

// Define a type for the slice state
interface SwapsState {
  baseAsset: string;
  quoteAsset: string;
  rates?: any;
}

// Define the initial state using that type
const initialState: SwapsState = {
  baseAsset: 'ETH',
  quoteAsset: 'BTC',
};

export const swapsSlice = createSlice({
  name: 'swaps',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setBaseAsset: (state, action: PayloadAction<string>) => {
      state.baseAsset = action.payload;
    },
    setQuoteAsset: (state, action: PayloadAction<string>) => {
      state.quoteAsset = action.payload;
    },
    setRates: (state, action: PayloadAction<any>) => {
      state.rates = action.payload;
    },
  },
});

export const { setBaseAsset, setQuoteAsset, setRates } = swapsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectBaseAsset = (state: RootState) => state.swaps.baseAsset;
export const selectQuoteAsset = (state: RootState) => state.swaps.quoteAsset;
export const isRatesLoaded = (state: RootState) => !!state.swaps.rates;

export default swapsSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';

// Define a type for the slice state
interface SwapsState {
  baseAsset: string;
  quoteAsset: string;
  baseAmount: string;
  quoteAmount: string;
  rates?: any;
}

// Define the initial state using that type
const initialState: SwapsState = {
  baseAsset: 'ETH',
  quoteAsset: 'BTC',
  baseAmount: '',
  quoteAmount: '',
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
    setBaseAmount: (state, action: PayloadAction<string>) => {
      state.baseAmount = action.payload;
    },
    setQuoteAmount: (state, action: PayloadAction<string>) => {
      state.quoteAmount = action.payload;
    },
    setRates: (state, action: PayloadAction<any>) => {
      state.rates = action.payload;
    },
  },
});

export const {
  setBaseAsset,
  setQuoteAsset,
  setBaseAmount,
  setQuoteAmount,
  setRates,
} = swapsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectBaseAsset = (state: RootState) => state.swaps.baseAsset;
export const selectQuoteAsset = (state: RootState) => state.swaps.quoteAsset;
export const selectBaseAmount = (state: RootState) => state.swaps.baseAmount;
export const selectQuoteAmount = (state: RootState) => state.swaps.quoteAmount;
export const isRatesLoaded = (state: RootState) => !!state.swaps.rates;

export default swapsSlice.reducer;

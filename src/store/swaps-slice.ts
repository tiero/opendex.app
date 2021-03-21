import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Currency, SwapStep } from '../constants/swap';
import { getSwapProvider } from '../utils/swapProvider';
import { RootState } from './index';

// Define a type for the slice state
interface SwapsState {
  baseAsset: Currency;
  quoteAsset: Currency;
  baseAmount: string;
  quoteAmount: string;
  swapStep: SwapStep;
  rates?: any;
}

// Define the initial state using that type
const initialState: SwapsState = {
  swapStep: SwapStep.CHOOSE_PAIR,
  baseAsset: Currency.LIGHTNING_BTC,
  quoteAsset: Currency.ETH,
  baseAmount: '',
  quoteAmount: '',
};

export const swapsSlice = createSlice({
  name: 'swaps',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setBaseAsset: (state, action: PayloadAction<Currency>) => {
      state.baseAsset = action.payload;
    },
    setQuoteAsset: (state, action: PayloadAction<Currency>) => {
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
    setSwapStep: (state, action: PayloadAction<SwapStep>) => {
      state.swapStep = action.payload;
    },
  },
});

export const {
  setBaseAsset,
  setQuoteAsset,
  setBaseAmount,
  setQuoteAmount,
  setRates,
  setSwapStep,
} = swapsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectSwapStep = (state: RootState) => state.swaps.swapStep;
export const selectBaseAsset = (state: RootState) => state.swaps.baseAsset;
export const selectQuoteAsset = (state: RootState) => state.swaps.quoteAsset;
export const selectBaseAmount = (state: RootState) => state.swaps.baseAmount;
export const selectQuoteAmount = (state: RootState) => state.swaps.quoteAmount;
export const selectSwapProvider = (state: RootState) =>
  getSwapProvider(state.swaps.baseAsset, state.swaps.quoteAsset);
export const isRatesLoaded = (state: RootState) => !!state.swaps.rates;

export default swapsSlice.reducer;

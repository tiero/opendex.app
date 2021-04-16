import CurrencyID from './currency';

export interface AmountCurrency {
  amount: number;
  currency: CurrencyID;
}

export interface AmountPreview {
  // This is comprehensive of swap provider fees
  amountWithFees: AmountCurrency;
  // This is general purpose key value object that can be used to communicate
  // to end users the detail of amounts added into the amountWithFees
  feesDetail?: Record<string, any>;
}

export interface RatesFetcherOpts {}

export interface RatesFetcher {
  // preview wants the amount and the currency entered by the user and will return the
  // amount to be sent or to be received of the opposite currency in the pair, comprehensive of fees.
  // By default it "should" expect the "sending amount" to be given, but also the "receiving amount" could be
  // passed setting the isSend parameter to false in order to do a reverse calculation.
  Preview(
    amountWithCurrency: AmountCurrency,
    isSend: boolean
  ): Promise<AmountPreview>;

  // PreviewGivenSend does the same thing as Preview with isSend = true
  PreviewGivenSend(amountWithCurrency: AmountCurrency): Promise<AmountPreview>;

  // PreviewGivenReceive does the same thing as Preview with isSend = false
  PreviewGivenReceive(
    amountWithCurrency: AmountCurrency
  ): Promise<AmountPreview>;
}

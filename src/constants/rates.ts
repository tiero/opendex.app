import Decimal from 'decimal.js';
import CurrencyID from './currency';


export enum AmountFeeType {
  Percentage = 'Percentage',
  Fixed = 'Fixed',
  // TODO add more types here for all providers
}
export interface AmountCurrency {
  amount: Decimal;
  currency: CurrencyID;
}

export interface AmountPreview {
  // This is comprehensive of swap provider fees
  amountWithFees: AmountCurrency;
  // This is general purpose key value object that can be used to communicate
  // to end users the detail of amounts added into the amountWithFees
  feesDetail?: Record<AmountFeeType, number>;
}

export interface RatesFetcherOpts { }

export interface RatesFetcher {
  // preview wants the amount and the currency entered by the user and will return the
  // amount to be sent or to be received of the opposite currency in the pair, comprehensive of fees.
  // By default it "should" expect the "sending amount" to be given, but also the "receiving amount" could be
  // passed setting the isSend parameter to false in order to do a reverse calculation.
  preview(
    amountWithCurrency: AmountCurrency,
    isSend: boolean
  ): Promise<AmountPreview>;

  // PreviewGivenSend does the same thing as Preview with isSend = true
  previewGivenSend(amountWithCurrency: AmountCurrency): Promise<AmountPreview>;

  // PreviewGivenReceive does the same thing as Preview with isSend = false
  previewGivenReceive(
    amountWithCurrency: AmountCurrency
  ): Promise<AmountPreview>;

  // define wich trading pair is suppported by the fetcher implementation
  isPairSupported(x: CurrencyID, y: CurrencyID): boolean;

}

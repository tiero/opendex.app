import CurrencyID from './currency';
import {
  RatesFetcher,
  AmountPreview,
  AmountCurrency,
  RatesFetcherOpts,
} from './rates';

interface ExampleOptions extends RatesFetcherOpts {
  url: string;
}

//'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'

export default class ExampleFetcherWithInitalizer implements RatesFetcher {
  private url: string;

  constructor(options: ExampleOptions) {
    this.url = options.url;
  }

  async Preview(
    amountWithCurrency: AmountCurrency,
    isSend: boolean = true
  ): Promise<AmountPreview> {
    const usdPerBtc = await this.fetchPriceBTC();

    const isBTCcomingIn =
      (isSend && amountWithCurrency.currency === CurrencyID.LIQUID_BTC) ||
      (!isSend && amountWithCurrency.currency !== CurrencyID.LIQUID_USDT);

    const amount = isBTCcomingIn
      ? usdPerBtc * amountWithCurrency.amount
      : amountWithCurrency.amount / usdPerBtc;
    const currency = isBTCcomingIn
      ? CurrencyID.LIQUID_USDT
      : CurrencyID.LIQUID_BTC;
    return {
      amountWithFees: {
        amount: amount,
        currency: currency,
      },
    };
  }

  // PreviewGivenSend does the same thing as Preview with isSend = true
  PreviewGivenSend(amountWithCurrency: AmountCurrency): Promise<AmountPreview> {
    return this.Preview(amountWithCurrency, true);
  }

  // PreviewGivenReceive does the same thing as Preview with isSend = false
  PreviewGivenReceive(
    amountWithCurrency: AmountCurrency
  ): Promise<AmountPreview> {
    return this.Preview(amountWithCurrency, false);
  }

  async fetchPriceBTC(): Promise<number> {
    const res = await fetch(this.url);
    const json = await res.json();

    return json.bitcoin.usd as number;
  }

  public static async WithCustomInitializer(): Promise<ExampleOptions> {
    return {
      url:
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
    };
  }
}

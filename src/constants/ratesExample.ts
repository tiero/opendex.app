import CurrencyID from './currency';
import {
  RatesFetcher,
  AmountPreview,
  AmountCurrency,
  RatesFetcherOpts,
} from './rates';

interface ExampleOptions extends RatesFetcherOpts {
  url: string;
  useInterval: boolean;
}

export default class ExampleFetcherWithInitalizer implements RatesFetcher {
  private url: string;
  private useInterval: boolean;
  private interval: any;
  private usdPerBtc: number = 0;
  private isFetching: boolean = false;

  constructor(options: ExampleOptions) {
    this.url = options.url;
    this.useInterval = options.useInterval;

    if (options.useInterval) {
      this.interval = setInterval(async () => {
        if (this.isFetching) return;

        this.isFetching = true;

        this.usdPerBtc = await this._fetchPriceBTC();

        this.isFetching = false;
      }, 1000);
    }
  }


  clean(): void {
    if (this.useInterval && this.interval) {
      clearInterval(this.interval);
    }
  }

  isPairSupported(x: CurrencyID, y: CurrencyID): boolean {
    const pair = [x, y];
    return pair.includes(CurrencyID.LIQUID_BTC) && pair.includes(CurrencyID.LIQUID_USDT);
  }

  preview(
    amountWithCurrency: AmountCurrency,
    isSend: boolean = true
  ): Promise<AmountPreview> {
    return this._preview(amountWithCurrency, isSend);
  }

  // PreviewGivenSend does the same thing as Preview with isSend = true
  previewGivenSend(amountWithCurrency: AmountCurrency): Promise<AmountPreview> {
    return this._preview(amountWithCurrency, true);
  }

  // PreviewGivenReceive does the same thing as Preview with isSend = false
  previewGivenReceive(
    amountWithCurrency: AmountCurrency
  ): Promise<AmountPreview> {
    return this._preview(amountWithCurrency, false);
  }

  private async _fetchPriceBTC(): Promise<number> {
    const res = await fetch(this.url);
    const json = await res.json();

    return json.bitcoin.usd as number;
  }

  private async _preview(
    amountWithCurrency: AmountCurrency,
    isSend: boolean = true
  ): Promise<AmountPreview> {
    const usdPerBtc = this.useInterval
      ? this.usdPerBtc
      : await this._fetchPriceBTC();

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

  public static async WithoutInterval(): Promise<ExampleOptions> {
    // here I can do all my async initiazization and instantiate my class as I wish
    return {
      useInterval: false,
      url:
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
    };
  }

  public static async WithInterval(): Promise<ExampleOptions> {
    // here I can do all my async initiazization and instantiate my class as I wish
    return {
      useInterval: true,
      url:
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
    };
  }
}
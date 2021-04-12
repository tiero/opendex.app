import CurrencyID from './currency';
import { RatesFetcher, Preview, AmountCurrency } from './rates';

export default class ExampleFetcher implements RatesFetcher {
  private client: any;

  constructor() {
    this.client = window.fetch;
  }

  async Preview(
    amountWithCurrency: AmountCurrency,
    isSend: boolean = true
  ): Promise<Preview> {
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
  PreviewGivenSend(amountWithCurrency: AmountCurrency): Promise<Preview> {
    return this.Preview(amountWithCurrency, true);
  }

  // PreviewGivenReceive does the same thing as Preview with isSend = false
  PreviewGivenReceive(amountWithCurrency: AmountCurrency): Promise<Preview> {
    return this.Preview(amountWithCurrency, false);
  }

  async fetchPriceBTC(): Promise<number> {
    const res = await this.client(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
    );
    const json = await res.json();

    return json.bitcoin.usd as number;
  }
}

import Decimal from 'decimal.js';
import {
  from,
  interval,
  Observable,
  Subscription,
  throwError,
  timer,
} from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import {
  catchError,
  map,
  mergeMap,
  mergeMapTo,
  shareReplay,
  startWith,
  switchMap,
  take,
} from 'rxjs/operators';
import { GET_PAIRS } from '../api/apiUrls';
import CurrencyID from './currency';
import {
  AmountPreview,
  CurrencyAmount,
  CurrencyPair,
  RatesFetcher,
  RatesFetcherOpts,
} from './rates';

interface BoltzRatesFetcherOptions extends RatesFetcherOpts {
  url: string;
}

// Map CurrencyID to the corresponding key from Boltz's API
const boltzPairsMap = (currency: CurrencyID) => {
  switch (currency) {
    case CurrencyID.BTC:
      return 'BTC';
    case CurrencyID.LIGHTNING_BTC:
      return 'BTC';
    case CurrencyID.LTC:
      return 'LTC';
    case CurrencyID.LIGHTNING_LTC:
      return 'LTC';
    case CurrencyID.ETH:
      return 'ETH';
    case CurrencyID.ETH_USDT:
      return 'USDT';
    default:
      throw new Error('currency not supported by Boltz API');
  }
};

// Map CurrencyID to a boolean whether it's on on-chain or off-chain
const isCurrencyOnChain = (currency: CurrencyID) => {
  switch (currency) {
    case CurrencyID.BTC:
      return true;
    case CurrencyID.ETH:
      return true;
    case CurrencyID.ETH_USDT:
      return true;
    case CurrencyID.LIGHTNING_BTC:
      return false;
    case CurrencyID.LIGHTNING_LTC:
      return false;
    default:
      throw new Error('unsupported CurrencyID - this should not happen');
  }
};

export const getAmountOut = (
  { currency: inputCurrency, amount: inputAmount }: CurrencyAmount,
  pair: CurrencyPair,
  rates: BoltzGetRatesResponse,
  fixedSendAmount: boolean
): AmountPreview => {
  const outputCurrency = pair.filter(currency => currency !== inputCurrency)[0];
  const inputCurrencyIsBaseAsset = !!rates.pairs[
    `${boltzPairsMap(inputCurrency)}/${boltzPairsMap(outputCurrency)}`
  ];
  const { rate, fees } = inputCurrencyIsBaseAsset
    ? rates.pairs[
        `${boltzPairsMap(inputCurrency)}/${boltzPairsMap(outputCurrency)}`
      ]
    : rates.pairs[
        `${boltzPairsMap(outputCurrency)}/${boltzPairsMap(inputCurrency)}`
      ];
  // We have 4 paths here now
  // 1. I want to send X quote asset and receive Y base asset
  // 2. I want to send X base asset and receive Y quote asset
  // 3. I want to receive X quote asset and send Y base asset
  // 4. I want to receive X base asset and send ? quote asset
  let outputAmountWithoutFees;
  let minerFees;
  if (
    (fixedSendAmount && inputCurrencyIsBaseAsset) ||
    (!fixedSendAmount && inputCurrencyIsBaseAsset)
  ) {
    // send fixed base asset
    // receive fixed base asset
    outputAmountWithoutFees = new Decimal(rate).mul(inputAmount);
    // paying fees in quote asset
    minerFees = fees.minerFees.quoteAsset;
  } else {
    // send fixed quote asset
    // receive fixed quote asset
    outputAmountWithoutFees = inputAmount.div(new Decimal(rate));
    // paying fees in base asset
    minerFees = fees.minerFees.baseAsset;
  }
  const nominalPercentageFee = new Decimal(fees.percentage)
    .div(new Decimal('100'))
    .mul(outputAmountWithoutFees);
  const sendingOnChain = fixedSendAmount
    ? isCurrencyOnChain(inputCurrency)
    : isCurrencyOnChain(outputCurrency);
  const getFixedMinerFees = () => {
    const SATOSHIS_PER_COIN = new Decimal('10').pow('8');
    if (sendingOnChain) {
      // sending on-chain only includes 1 fee (for Boltz to claim the funds)
      return new Decimal(minerFees.normal).div(SATOSHIS_PER_COIN);
    }
    // sending off-chain includes 2 fees (claim and lockup)
    return new Decimal(minerFees.reverse.claim)
      .div(SATOSHIS_PER_COIN)
      .add(new Decimal(minerFees.reverse.lockup).div(SATOSHIS_PER_COIN));
  };
  const fixedMinerFee = getFixedMinerFees();
  let outputAmount: Decimal;
  if (fixedSendAmount) {
    // sending fixed input asset - subtracting fees from output asset
    outputAmount = outputAmountWithoutFees
      .sub(nominalPercentageFee)
      .sub(fixedMinerFee);
  } else {
    // receiving fixed input asset - adding fees to output asset
    outputAmount = outputAmountWithoutFees
      .add(nominalPercentageFee)
      .add(fixedMinerFee);
  }
  return {
    amountWithFees: {
      amount: outputAmount,
      currency: outputCurrency,
    },
    // MVP: skipping fee details
    // feesDetail: {},
  };
};

type BoltzPair = {
  fees: {
    percentage: number;
    minerFees: {
      baseAsset: {
        normal: number;
        reverse: {
          claim: number;
          lockup: number;
        };
      };
      quoteAsset: {
        normal: number;
        reverse: {
          claim: number;
          lockup: number;
        };
      };
    };
  };
  rate: number;
  /* TODO: implement later
  limits: {
    maximal: number;
    minimal: number;
    maximalZeroConf: {
      baseAsset: number; // number
      quoteAsset: number; // number
    };
  };
  */
};

type BoltzGetRatesResponse = {
  pairs: Record<string, BoltzPair>;
};

export default class BoltzFetcher implements RatesFetcher {
  private rates$: Observable<BoltzGetRatesResponse>;
  private rates$subscription: Subscription;

  constructor(options: BoltzRatesFetcherOptions) {
    // update rates every 15000ms
    this.rates$ = interval(15000).pipe(
      // emit immediately
      startWith(0),
      mergeMap(() => {
        return fromFetch(options.url).pipe(
          // stop processing the old pairs response when a new one comes in
          switchMap(response => {
            if (response.ok) {
              // OK return data
              return from(response.json());
            }
            // otherwise throw an error to trigger retry mechanism
            return throwError('The response code is not OK');
          }),
          catchError((err, caught) => {
            // Network or other error, retry in 1000ms
            console.error(err);
            return timer(1000).pipe(mergeMapTo(caught));
          }),
          // share the subscription and replay 1 latest events to late subscribers
          shareReplay({ bufferSize: 1, refCount: true })
        );
      })
    );
    this.rates$subscription = this.rates$.subscribe(() => {});
  }

  // PreviewGivenSend wants the sending amount and the currency entered by the user and will return the
  // amount to be received of the opposite currency in the pair, included of fees.
  public previewGivenSend(
    amountWithCurrency: CurrencyAmount,
    pair: CurrencyPair
  ): Promise<AmountPreview> {
    // get the latest rates event stream
    return this.rates$
      .pipe(
        map(rates => getAmountOut(amountWithCurrency, pair, rates, true)),
        take(1) // take 1 event and unsubscribe so that the promise can complete
      )
      .toPromise();
  }

  // PreviewGivenReceive wants the receving amount and the currency entered by the user and will return the
  // amount to be sent of the opposite currency in the pair, included of fees.
  public previewGivenReceive(
    amountWithCurrency: CurrencyAmount,
    pair: CurrencyPair
  ): Promise<AmountPreview> {
    // get the latest rates event stream
    return this.rates$
      .pipe(
        map(rates => getAmountOut(amountWithCurrency, pair, rates, false)),
        take(1) // take 1 event and unsubscribe so that the promise can complete
      )
      .toPromise();
  }

  // define which trading pair is suppported by the fetcher implementation
  public isPairSupported(pair: CurrencyPair): boolean {
    return true;
  }

  public static async WithInterval(): Promise<BoltzRatesFetcherOptions> {
    return {
      url: GET_PAIRS,
    };
  }

  public clean(): void {
    this.rates$subscription.unsubscribe();
  }
}

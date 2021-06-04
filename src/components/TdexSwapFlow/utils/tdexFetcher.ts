import BigNumber from 'bignumber.js';
import {
  RatesFetcher,
  AmountPreview,
  CurrencyAmount,
  RatesFetcherOpts,
  CurrencyPair,
} from '../../../constants/rates';
import {
  Provider,
  ProviderWithMarket,
  CurrencyToAssetByChain,
  AssetToCurrencyByChain,
  CurrencyPairKey,
  BaseQuoteByPair,
} from '../constants';

import { MarketInterface, TraderClient, TradeType } from 'tdex-sdk';
import {
  fromSatoshi,
  toSatoshi,
  toKey,
  baseQuoteFromCurrencyPair,
} from './format';

interface TdexFetcherOptions extends RatesFetcherOpts {
  network: 'liquid' | 'regtest';
  providersWithMarketByPair: Record<CurrencyPairKey, ProviderWithMarket[]>;
}

export default class TdexFetcher implements RatesFetcher {
  private network: 'liquid' | 'regtest';
  private supportedPairs: CurrencyPairKey[];
  private providersWithMarketByPair: Record<
    CurrencyPairKey,
    ProviderWithMarket[]
  >;

  constructor(options: TdexFetcherOptions) {
    const { providersWithMarketByPair, network } = options;

    this.network = network;
    this.providersWithMarketByPair = providersWithMarketByPair;

    this.supportedPairs = Object.keys(BaseQuoteByPair) as CurrencyPairKey[];
  }

  isPairSupported(pair: CurrencyPair): boolean {
    return this.supportedPairs.includes(toKey(pair));
  }

  // PreviewGivenSend does the same thing as Preview with isSend = true
  previewGivenSend(
    amountWithCurrency: CurrencyAmount,
    pair: CurrencyPair
  ): Promise<AmountPreview> {
    if (!this.isPairSupported(pair)) throw new Error('pair is not supported');

    return this.previewForPair(amountWithCurrency, pair, true);
  }

  // PreviewGivenReceive does the same thing as Preview with isSend = false
  previewGivenReceive(
    amountWithCurrency: CurrencyAmount,
    pair: CurrencyPair
  ): Promise<AmountPreview> {
    if (!this.isPairSupported(pair)) throw new Error('pair is not supported');

    return this.previewForPair(amountWithCurrency, pair, false);
  }

  private async previewForPair(
    amountWithCurrency: CurrencyAmount,
    pair: CurrencyPair,
    isSend: boolean = true
  ): Promise<AmountPreview> {
    const [baseCurrency, quoteCurrency] = baseQuoteFromCurrencyPair(pair);

    const isBaseComingIn =
      (isSend && amountWithCurrency.currency === baseCurrency) ||
      (!isSend && amountWithCurrency.currency !== quoteCurrency);

    const tradeType = isBaseComingIn ? TradeType.SELL : TradeType.BUY;

    const providersForPair =
      this.providersWithMarketByPair[toKey([baseCurrency, quoteCurrency])];

    let bestPrice;
    let bestProvider;
    for (const providerWithMarket of providersForPair) {
      try {
        const client = new TraderClient(providerWithMarket.provider.endpoint);
        const [firstPrice] = await client.marketPrice(
          providerWithMarket.market,
          tradeType,
          toSatoshi(
            amountWithCurrency.amount.toNumber(),
            CurrencyToAssetByChain[this.network][amountWithCurrency.currency]
              .precision
          ),
          CurrencyToAssetByChain[this.network][amountWithCurrency.currency].hash
        );

        if (tradeType === TradeType.BUY) {
          if (
            firstPrice.balance &&
            (!bestPrice ||
              firstPrice.balance.baseAmount > bestPrice.balance.baseAmount)
          ) {
            bestPrice = { ...firstPrice };
            bestProvider = providerWithMarket;
          }
        } else {
          if (
            firstPrice.balance &&
            (!bestPrice ||
              firstPrice.balance.quoteAmount > bestPrice.balance.quoteAmount)
          ) {
            bestPrice = { ...firstPrice };
            bestProvider = providerWithMarket;
          }
        }
      } catch (e) {
        console.warn(
          `TDEX provider ${providerWithMarket.provider.name} is not reachable`
        );
        continue;
      }
    }

    const event = new CustomEvent('bestProvider', { detail: bestProvider });
    window.dispatchEvent(event);

    const expectedCurrency =
      amountWithCurrency.currency === baseCurrency
        ? quoteCurrency
        : baseCurrency;

    return {
      amountWithFees: {
        amount: new BigNumber(
          fromSatoshi(
            bestPrice.amount,
            CurrencyToAssetByChain[this.network][expectedCurrency].precision
          )
        ),
        currency: AssetToCurrencyByChain[this.network][bestPrice.asset],
      },
    };
  }

  public static async WithTdexProviders(
    providers: Provider[],
    network: 'liquid' | 'regtest'
  ): Promise<TdexFetcherOptions> {
    let providersWithMarketByPair = {};
    for (const provider of providers) {
      const client = new TraderClient(provider.endpoint);
      let markets: MarketInterface[];

      try {
        markets = await client.markets();
      } catch (e) {
        throw new Error(`TDEX provider ${provider.name} is not reachable`);
      }

      markets.forEach((market: MarketInterface) => {
        const { baseAsset, quoteAsset } = market;
        const baseCurrency = AssetToCurrencyByChain[network][baseAsset];
        const quoteCurrency = AssetToCurrencyByChain[network][quoteAsset];
        const pairAsKey = toKey([baseCurrency, quoteCurrency]);

        if (providersWithMarketByPair.hasOwnProperty(pairAsKey)) {
          providersWithMarketByPair[pairAsKey].push({ provider, market });
        } else {
          providersWithMarketByPair[pairAsKey] = [{ provider, market }];
        }
      });
    }

    return { network, providersWithMarketByPair };
  }
}

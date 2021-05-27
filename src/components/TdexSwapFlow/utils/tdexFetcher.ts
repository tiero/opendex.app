import BigNumber from 'bignumber.js';
import CurrencyID from '../../../constants/currency';
import {
  RatesFetcher,
  AmountPreview,
  CurrencyAmount,
  RatesFetcherOpts,
  CurrencyPair,
} from '../../../constants/rates';
import { Provider, ProviderWithMarket, CurrencyToAssetByChain, AssetToCurrencyByChain, CurrencyPairKey } from '../constants';

import { TraderClient, TradeType } from 'tdex-sdk';
import { fromSatoshi, toSatoshi, toKey } from './format';




interface TdexFetcherOptions extends RatesFetcherOpts {
  network: 'liquid' | 'regtest';
  providersWithMarketByPair: Record<CurrencyPairKey, ProviderWithMarket[]>;
}

export default class TdexFetcher implements RatesFetcher {
  private network: 'liquid' | 'regtest';
  private supportedPairs: CurrencyPairKey[];
  private providersWithMarketByPair: Record<CurrencyPairKey, ProviderWithMarket[]>;

  constructor(options: TdexFetcherOptions) {
    const { providersWithMarketByPair, network } = options;

    this.network = network;
    this.providersWithMarketByPair = providersWithMarketByPair;

    this.supportedPairs = Object.keys(providersWithMarketByPair) as CurrencyPairKey[];
  }

  isPairSupported(pair: CurrencyPair): boolean {
    const pairAsKey = toKey(pair);
    return this.supportedPairs.includes(pairAsKey);
  }

  // PreviewGivenSend does the same thing as Preview with isSend = true
  previewGivenSend(
    amountWithCurrency: CurrencyAmount,
    pair: CurrencyPair
  ): Promise<AmountPreview> {
    if (!this.isPairSupported(pair)) throw new Error('pair is not support');

    return this.previewForPair(amountWithCurrency, pair, true);
  }

  // PreviewGivenReceive does the same thing as Preview with isSend = false
  previewGivenReceive(
    amountWithCurrency: CurrencyAmount,
    pair: CurrencyPair
  ): Promise<AmountPreview> {
    if (!this.isPairSupported(pair)) throw new Error('pair is not support');

    return this.previewForPair(amountWithCurrency, pair, false);
  }

  private async previewForPair(
    amountWithCurrency: CurrencyAmount,
    pair: CurrencyPair,
    isSend: boolean = true
  ): Promise<AmountPreview> {

    const pairAsKey = toKey(pair);
    if (!this.supportedPairs.includes(pairAsKey))
      throw new Error('selected pair is not supported by tdex');

    const [baseCurrency, quoteCurrecy] = pair;

    const isBaseComingIn =
      (isSend && amountWithCurrency.currency === baseCurrency) ||
      (!isSend && amountWithCurrency.currency !== quoteCurrecy);

    const tradeType = isBaseComingIn ? TradeType.SELL : TradeType.BUY;

    const providersForPair = this.providersWithMarketByPair[pairAsKey];

    const promises = providersForPair.map((providerWithMarket: ProviderWithMarket) => {
      const client = new TraderClient(providerWithMarket.provider.endpoint);
      return client.marketPrice(
        providerWithMarket.market, tradeType,
        toSatoshi(
          amountWithCurrency.amount.toNumber(),
          CurrencyToAssetByChain[this.network][amountWithCurrency.currency].precision
        ),
        CurrencyToAssetByChain[this.network][amountWithCurrency.currency].hash
      )
    });


    const results = (await Promise.allSettled(promises))
      .filter(({ status }) => status === 'fulfilled')
      .map(
        (p) => (p as PromiseFulfilledResult<Array<{ amount: number, asset: string, balance: any, fee: any, price: any }>>).value
      )
      .filter((res) => res !== undefined);

    const [firstProvider] = results;
    const [firstPrice] = firstProvider;

    const expectedCurrency = amountWithCurrency.currency === baseCurrency ? quoteCurrecy : baseCurrency;

    return {
      amountWithFees: {
        amount: new BigNumber(fromSatoshi(firstPrice.amount, CurrencyToAssetByChain[this.network][expectedCurrency].precision)),
        currency: AssetToCurrencyByChain[this.network][firstPrice.asset],
      },
    };
  }

  public static async WithTdexProviders(providers: Provider[], network: 'liquid' | 'regtest'): Promise<TdexFetcherOptions> {
    // normalize providers per market
    return {
      network: network,
      providersWithMarketByPair: {
        [toKey([CurrencyID.LIQUID_BTC, CurrencyID.LIQUID_USDT])]: [
          {
            provider: { name: 'regtest daemon', endpoint: 'http://localhost:9945' },
            market: {
              baseAsset: CurrencyToAssetByChain[network][CurrencyID.LIQUID_BTC].hash,
              quoteAsset: CurrencyToAssetByChain[network][CurrencyID.LIQUID_USDT].hash
            }
          }
        ]
      }
    };
  }
}

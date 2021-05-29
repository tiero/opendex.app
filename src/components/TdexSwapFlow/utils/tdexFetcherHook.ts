import { useState, useEffect } from 'react';
import { RatesFetcher } from '../../../constants/rates';
import { Network } from '../../../context/NetworkContext';
import TdexFetcher from './tdexFetcher';

export default function useTdexFetcher(network: Network): RatesFetcher | null {
  let [fetcher, setFetcher] = useState<RatesFetcher | null>(null);

  useEffect(() => {
    (async () => {
      const liquidNetwork = network === Network.Mainnet ? 'liquid' : 'regtest';
      let listOfProviders = [
        {
          name: 'local dev daemon',
          endpoint: 'http://localhost:9945',
        },
      ];

      if (liquidNetwork === 'liquid') {
        const result = await fetch(
          `https://raw.githubusercontent.com/TDex-network/tdex-registry/master/registry.json`
        );
        listOfProviders = await result.json();
      }

      // async instantiation using the The Functional Options Pattern
      // https://betterprogramming.pub/how-to-write-an-async-class-constructor-in-typescript-javascript-7d7e8325c35e

      const tdexFetcher = new TdexFetcher(
        await TdexFetcher.WithTdexProviders(listOfProviders, liquidNetwork)
      );
      setFetcher(tdexFetcher);
    })();
  }, [network]);

  return fetcher;
}

import { useState, useEffect } from 'react';
import { RatesFetcher } from '../../../constants/rates';
import TdexFetcher from './tdexFetcher';

export default function useTdexFetcher(): RatesFetcher | null {
  let [fetcher, setFetcher] = useState<RatesFetcher | null>(null);

  useEffect(() => {
    (async () => {
      let liquidNetwork: 'liquid' | 'regtest' = 'regtest';
      let listOfProviders = [
        {
          name: 'development daemon',
          endpoint: 'http://localhost:9945',
        },
      ];

      if (process.env.NODE_ENV === 'production') {
        const result = await fetch(
          `https://raw.githubusercontent.com/TDex-network/tdex-registry/master/registry.json`
        );
        listOfProviders = await result.json();
        liquidNetwork = 'liquid';
      }

      // async instantiation using the The Functional Options Pattern
      // https://betterprogramming.pub/how-to-write-an-async-class-constructor-in-typescript-javascript-7d7e8325c35e

      try {
        const tdexFetcher = new TdexFetcher(
          await TdexFetcher.WithTdexProviders(listOfProviders, liquidNetwork)
        );
        setFetcher(tdexFetcher);
      } catch (e) {
        console.error(e);
        return;
      }
    })();
  }, []);

  return fetcher;
}

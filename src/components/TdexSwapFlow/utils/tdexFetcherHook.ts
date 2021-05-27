import { useState, useEffect } from 'react';
import { RatesFetcher } from '../../../constants/rates';
import TdexFetcher from './tdexFetcher';

export default function useTdexFetcher(network: 'liquid' | 'regtest'): RatesFetcher | null {
  let [fetcher, setFetcher] = useState<RatesFetcher | null>(null);

  useEffect(() => {
    (async () => {
      // start a new Example rates fetcher
      // This is an example of stateful implementation with async
      // instantiation using the The Functional Options Pattern
      // https://betterprogramming.pub/how-to-write-an-async-class-constructor-in-typescript-javascript-7d7e8325c35e

      const tdexFetcher = new TdexFetcher(
        await TdexFetcher.WithTdexProviders([], network)
      );
      setFetcher(tdexFetcher);
    })();
  }, []);

  return fetcher;
}

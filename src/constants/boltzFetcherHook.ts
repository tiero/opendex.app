import { useState, useEffect } from 'react';
import { RatesFetcher } from './rates';
import BoltzFetcher from './boltzRates';

export default function useBoltzFetcher(): RatesFetcher | null {
  let [fetcher, setFetcher] = useState<RatesFetcher | null>(null);

  useEffect(() => {
    (async () => {
      const boltzFetcher = new BoltzFetcher(await BoltzFetcher.WithInterval());
      setFetcher(boltzFetcher);
      return () => boltzFetcher.clean();
    })();
  }, []);

  return fetcher;
}

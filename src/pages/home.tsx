import { Grid } from '@material-ui/core';
import { default as React } from 'react';
import ChooseTradingPair from '../components/ChooseTradingPair';
import SwapProvider from '../components/SwapProvider';
import Title from '../components/Title';
import { SwapProvider as Provider } from '../constants/swap';
import Layout from '../layout/main';
import { useAppSelector } from '../store/hooks';
import { isRatesLoaded } from '../store/swaps-slice';

export type HomePageProps = {};

const HomePage = (_props: HomePageProps) => {
  const ratesLoaded = useAppSelector(isRatesLoaded);

  return (
    <Layout>
      <Grid container direction="column" wrap="nowrap">
        <Title>CROSS-CHAIN DEX AGGREGATOR</Title>
        <Grid item container direction="column" wrap="nowrap">
          <ChooseTradingPair />
          {ratesLoaded && <SwapProvider provider={Provider.BOLTZ} />}
        </Grid>
      </Grid>
    </Layout>
  );
};

export default HomePage;

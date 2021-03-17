import { Grid } from '@material-ui/core';
import { default as React } from 'react';
import ChooseTradingPair from '../components/ChooseTradingPair';
import SwapProvider from '../components/SwapProvider';
import Title from '../components/Title';
import { CurrencyOptions, SwapProvider as Provider } from '../constants/swap';
import Layout from '../layout/main';

export type HomePageProps = {};

const HomePage = (_props: HomePageProps) => {
  return (
    <Layout>
      <Grid container direction="column" wrap="nowrap">
        <Title>CROSS-CHAIN DEX AGGREGATOR</Title>
        <Grid item container direction="column" wrap="nowrap">
          <ChooseTradingPair
            sendCurrencyType={CurrencyOptions[0]}
            receiveCurrencyType={CurrencyOptions[3]}
            sendCurrencyValue={1}
            receiveCurrencyValue={0}
            onSendCurrencyChange={() => {}}
            onSendAssetChange={() => {}}
            onReceiveCurrencyChange={() => {}}
            onReceiveAssetChange={() => {}}
            onNumberInputKeyPress={() => {}}
            handleSwapClick={() => {}}
          />
          <SwapProvider provider={Provider.BOLTZ} />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default HomePage;

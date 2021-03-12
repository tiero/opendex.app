import { Grid } from '@material-ui/core';
import { default as React } from 'react';
import ChooseTradingPair from '../components/ChooseTradingPair';
import Title from '../components/Title';
import { CurrencyOptions } from '../constants/swap';
import Layout from '../layout/main';

export type HomePageProps = {};

const HomePage = (_props: HomePageProps) => {
  return (
    <Layout>
      <Grid container direction="column">
        <Title>CROSS-CHAIN DEX AGGREGATOR</Title>
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
      </Grid>
    </Layout>
  );
};

export default HomePage;

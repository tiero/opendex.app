import React from 'react';
import { Networks } from 'boltz-core';
import { Network as NetworkConstants } from 'bitcoinjs-lib';
import CurrencyID from '../constants/currency';

enum Network {
  Mainnet = "MAINNET",
  Testnet = "TESTNET",
  Regtest = "REGTEST",
}

type BlockExplorerConfiguration = {
  address: string;
  transaction: string;
}

type BoltzConfiguration = {
  infuraId: string;
  apiEndpoint: string;

  bitcoinConstants: NetworkConstants,
  litecoinConstants: NetworkConstants,
}

type NetworkConfiguration = {
  explorers: Map<CurrencyID, BlockExplorerConfiguration>,
  boltz: BoltzConfiguration,
}

type NetworkContextData = {
  network: NetworkConfiguration,
  updateNetwork: (network: Network) => void,
}

const parseNetwork = (network: Network): NetworkConfiguration => {
  const explorers = new Map<CurrencyID, BlockExplorerConfiguration>();

  for (const currency of Object.keys(CurrencyID)) {
    const blockExplorer: BlockExplorerConfiguration = {
      address: process.env[`REACT_APP_${network}_EXPLORER_${currency}_ADDRESS`]!,
      transaction: process.env[`REACT_APP_${network}_EXPLORER_${currency}_TRANSACTION`]!,
    };

    if (blockExplorer.address !== undefined && blockExplorer.transaction !== undefined) {
      explorers.set(currency as CurrencyID, blockExplorer);
    }
  }

  // Boltz config parsing
  const capitalizeFirstLetter = (input: string) => {
    return input.charAt(0).toUpperCase() + input.slice(1);
  };
  
  const boltz: BoltzConfiguration = {
    apiEndpoint: process.env[`REACT_APP_BOLTZ_${network}_API`]!,
    infuraId: process.env[`REACT_APP_BOLTZ_${network}_INFURA_ID`]!,

    bitcoinConstants: Networks[`bitcoin${capitalizeFirstLetter(network.toLowerCase())}`],
    litecoinConstants: Networks[`litecoin${capitalizeFirstLetter(network.toLowerCase())}`],
  };

  return {
    boltz,
    explorers,
  }
};

// TODO: parse based on URL
const defaultNetwork = Network.Regtest;

const NetworkContext = React.createContext<NetworkContextData | null>(null);

const NetworkProvider = ({ children }) => {
  const [network, setNetwork] = React.useState<NetworkConfiguration>(parseNetwork(defaultNetwork));

  const updateNetwork = (network: Network) => {
    setNetwork(parseNetwork(network));
  };

  return (
    <NetworkContext.Provider
      value={{
        network,
        updateNetwork,
      }}
    >
      <>{children}</>
    </NetworkContext.Provider>
  );
};

export {
  Network,
  NetworkContext,
  NetworkProvider,
};

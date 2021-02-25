import Web3Modal from 'web3modal';
import { providers } from 'ethers';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { infuraId } from '../constants/environment';

export const connectWeb3Modal = async (ethereumNetwork) => {
    const providerOptions = {};

    // If the backend sets a network name, it is a public one on which WalletConnect can be used
    if (ethereumNetwork.name !== undefined) {
        providerOptions.walletconnect = {
            package: WalletConnectProvider,
            options: {
                infuraId,
            },
        };
    }

    const web3Modal = new Web3Modal({
        providerOptions,
        network: ethereumNetwork.name,
    });

    const provider = new providers.Web3Provider(await web3Modal.connect());
    return provider.getSigner();
};

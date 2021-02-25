import Send from '../views/submarine/send';
import Status from '../views/submarine/status';
import PickCrypto from '../views/submarine/pickCrypto';
import Destination from '../views/submarine/destination';
import getCurrencyLabel from '../utils/getCurrencyLabel';

export const SwapTypes = {
    Submarine: 'Submarine',
    ReverseSubmarine : 'ReverseSubmarine',
    ChainToChain: 'ChainToChain',
};

export const CurrencyTypes = {
    Ether: 'Ether',
    ERC20: 'ERC20',
    Lightning: 'Lightning',
    BitcoinLike: 'BitcoinLike',
};

// These CurrencyTypes are on the Ethereum chain
const EthereumCurrencyTypes = [
  CurrencyTypes.Ether,
  CurrencyTypes.ERC20,
];

export const isEthereumCurrencyType = (currencyType) => {
    return EthereumCurrencyTypes.includes(currencyType);
};

export const isLightningCurrencyType = (currencyType) => {
    return currencyType === CurrencyTypes.Lightning;
};

export const satConversionValue = 100000000;

export const SubmarineSteps = [
    {
        key: 0,
        label: 'Choose',
        component: PickCrypto
    },
    {
        key: 1,
        label: 'Destination',
        component: Destination
    },
    {
        key: 2,
        label: 'Send',
        component: Send
    },
    {
        key: 3,
        label: 'Status',
        component: Status
    }
];

export const getSelectedOption = (options, value) => {
    return options.filter((option) => option.id === value)[0];
}

export const CurrencyOptions = [
    {
        id: 'BTC',
        symbol: 'BTC',
        label: getCurrencyLabel('Bitcoin', 'Bitcoin'),
        swapValues: {
            label: 'Bitcoin',
            type: CurrencyTypes.BitcoinLike,
        },
    },
    {
        symbol: 'BTC',
        id: 'Lightning BTC',
        label: getCurrencyLabel('LN-BTC', 'LightningBitcoin'),
        swapValues: {
            label: 'Bitcoin Lightning',
            type: CurrencyTypes.Lightning,
        },
    },
    {
        symbol: 'USDT',
        id: 'USD Tether',
        label: getCurrencyLabel('USDT', 'Tether'),
        swapValues: {
            label: 'Tether',
            type: CurrencyTypes.ERC20,
        },
    },
    {
        symbol: 'ETH',
        id: 'ETH',
        label: getCurrencyLabel('Ether', 'Ether'),
        swapValues: {
            label: 'Ether',
            type: CurrencyTypes.Ether,
        },
    },
    {
        symbol: 'LTC',
        id: 'LTC',
        label: getCurrencyLabel('Litecoin', 'Litecoin'),
        swapValues: {
            label: 'Litecoin',
            type: CurrencyTypes.BitcoinLike,
        },
    },
    {
        symbol: 'LTC',
        id: 'Lightning LTC',
        label: getCurrencyLabel('LN-LTC', 'LightningLitecoin'),
        swapValues: {
            label: 'Litecoin Lightning',
            type: CurrencyTypes.Lightning,
        },
    },
];

export const fundTransferTypes = {
    BTC: [
        {
            id: 'Sats',
            value: '1',
        },
        {
            id: 'BTC',
            value: '2',
        },
    ],
    LTC: [
        {
            id: 'Litoshi',
            value: '1',
        },
        {
            id: 'LTC',
            value: '2',
        },
    ],
    ETH: [
        {
            id: 'Ether',
            value: '2',
        }
    ],
    USDT: [
        {
            id: 'USDT',
            value: '2'
        },
    ],
};

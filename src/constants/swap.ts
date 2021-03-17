import getCurrencyLabel from '../utils/getCurrencyLabel';

export enum CurrencyType {
  Ether = 'Ether',
  ERC20 = 'ERC20',
  Lightning = 'Lightning',
  BitcoinLike = 'BitcoinLike',
  Monero = 'Monero',
  Liquid = 'Liquid',
}

export type CurrencyOption = {
  id: string;
  symbol: string;
  label: ReturnType<typeof getCurrencyLabel>;
  swapValues: {
    label: string;
    type: CurrencyType;
  };
};

export const CurrencyOptions: CurrencyOption[] = [
  {
    id: 'BTC',
    symbol: 'BTC',
    label: getCurrencyLabel('Bitcoin', 'Bitcoin'),
    swapValues: {
      label: 'Bitcoin',
      type: CurrencyType.BitcoinLike,
    },
  },
  {
    symbol: 'BTC',
    id: 'Lightning BTC',
    label: getCurrencyLabel('LN-BTC', 'LightningBitcoin'),
    swapValues: {
      label: 'Bitcoin Lightning',
      type: CurrencyType.Lightning,
    },
  },
  {
    symbol: 'USDT',
    id: 'USD Tether',
    label: getCurrencyLabel('USDT', 'Tether'),
    swapValues: {
      label: 'Tether',
      type: CurrencyType.ERC20,
    },
  },
  {
    symbol: 'ETH',
    id: 'ETH',
    label: getCurrencyLabel('Ether', 'Ether'),
    swapValues: {
      label: 'Ether',
      type: CurrencyType.Ether,
    },
  },
  {
    symbol: 'LTC',
    id: 'LTC',
    label: getCurrencyLabel('Litecoin', 'Litecoin'),
    swapValues: {
      label: 'Litecoin',
      type: CurrencyType.BitcoinLike,
    },
  },
  {
    symbol: 'LTC',
    id: 'Lightning LTC',
    label: getCurrencyLabel('LN-LTC', 'LightningLitecoin'),
    swapValues: {
      label: 'Litecoin Lightning',
      type: CurrencyType.Lightning,
    },
  },
  {
    symbol: 'XMR',
    id: 'Monero',
    label: getCurrencyLabel('Monero', 'Monero'),
    swapValues: {
      label: 'Monero',
      type: CurrencyType.Monero,
    },
  },
];

export const getSelectedOption = (
  options: CurrencyOption[],
  value: CurrencyOption
) => {
  return options.filter(option => option.id === value.id)[0];
};

export enum SwapProvider {
  BOLTZ = 'Boltz',
  COMIT = 'Comit',
  TDEX = 'TDex',
}

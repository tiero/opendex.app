import getCurrencyLabel from '../utils/getCurrencyLabel';

export enum CurrencyType {
  Ether = 'Ether',
  ERC20 = 'ERC20',
  Lightning = 'Lightning',
  BitcoinLike = 'BitcoinLike',
  Monero = 'Monero',
  Liquid = 'Liquid',
}

export enum Currency {
  BTC = 'BTC',
  LIGHTNING_BTC = 'Lightning BTC',
  L_BTC = 'Liquid BTC',
  LTC = 'LTC',
  LIGHTNING_LTC = 'Lightning LTC',
  USD_TETHER = 'USD Tether',
  ETH = 'ETH',
  MONERO = 'Monero',
}

export type CurrencyOption = {
  id: Currency;
  symbol: string;
  label: ReturnType<typeof getCurrencyLabel>;
  swapValues: {
    label: string;
    type: CurrencyType;
  };
};

export const CurrencyOptions: CurrencyOption[] = [
  {
    id: Currency.BTC,
    symbol: 'BTC',
    label: getCurrencyLabel('Bitcoin', 'Bitcoin'),
    swapValues: {
      label: 'Bitcoin',
      type: CurrencyType.BitcoinLike,
    },
  },
  {
    id: Currency.LIGHTNING_BTC,
    symbol: 'BTC',
    label: getCurrencyLabel('LN-BTC', 'LightningBitcoin'),
    swapValues: {
      label: 'Bitcoin Lightning',
      type: CurrencyType.Lightning,
    },
  },
  {
    id: Currency.L_BTC,
    symbol: 'L-BTC',
    label: getCurrencyLabel('L-BTC', 'Bitcoin'),
    swapValues: {
      label: 'Bitcoin Liquid',
      type: CurrencyType.Liquid,
    },
  },
  {
    id: Currency.USD_TETHER,
    symbol: 'USDT',
    label: getCurrencyLabel('USDT', 'Tether'),
    swapValues: {
      label: 'Tether',
      type: CurrencyType.ERC20,
    },
  },
  {
    id: Currency.ETH,
    symbol: 'ETH',
    label: getCurrencyLabel('Ether', 'Ether'),
    swapValues: {
      label: 'Ether',
      type: CurrencyType.Ether,
    },
  },
  {
    id: Currency.LTC,
    symbol: 'LTC',
    label: getCurrencyLabel('Litecoin', 'Litecoin'),
    swapValues: {
      label: 'Litecoin',
      type: CurrencyType.BitcoinLike,
    },
  },
  {
    id: Currency.LIGHTNING_LTC,
    symbol: 'LTC',
    label: getCurrencyLabel('LN-LTC', 'LightningLitecoin'),
    swapValues: {
      label: 'Litecoin Lightning',
      type: CurrencyType.Lightning,
    },
  },
  {
    id: Currency.MONERO,
    symbol: 'XMR',
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

export const swapProviders = {
  [SwapProvider.BOLTZ]: [
    [Currency.BTC, Currency.LIGHTNING_BTC],
    [Currency.BTC, Currency.LIGHTNING_LTC],
    [Currency.ETH, Currency.LIGHTNING_BTC],
    [Currency.USD_TETHER, Currency.LIGHTNING_BTC],
    [Currency.LTC, Currency.LIGHTNING_BTC],
    [Currency.LTC, Currency.LIGHTNING_LTC],
  ],
  [SwapProvider.COMIT]: [[Currency.BTC, Currency.MONERO]],
  [SwapProvider.TDEX]: [[Currency.BTC, Currency.L_BTC]],
};

export enum SwapStep {
  CHOOSE_PAIR,
  SWAP_FLOW,
}

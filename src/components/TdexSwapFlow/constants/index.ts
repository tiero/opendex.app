import CurrencyID from "../../../constants/currency"

export const ExplorerByChain: Record<'liquid' | 'regtest', string> = {
  liquid: 'https://blockstream.info/liquid/api',
  regtest: 'http://localhost:3001'
}

export const ProviderByChain: Record<'liquid' | 'regtest', string[]> = {
  liquid: ['https://provider.tdex.network:9945'],
  regtest: ['http://localhost:9945']
}


type AssetByCurrency = Record<CurrencyID.LIQUID_BTC | CurrencyID.LIQUID_USDT, string>;

const LiquidAssetHashByCurrenyID: AssetByCurrency = {
  [CurrencyID.LIQUID_BTC]: '6f0279e9ed041c3d710a9f57d0c02928416460c4b722ae3457a11eec381c526d',
  [CurrencyID.LIQUID_USDT]: 'ce091c998b83c78bb71a632313ba3760f1763d9cfcffae02258ffa9865a37bd2'
}


const RegtestAssetHashByCurrenyID: AssetByCurrency = {
  [CurrencyID.LIQUID_BTC]: '5ac9f65c0efcc4775e0baec4ec03abdde22473cd3cf33c0419ca290e0751b225',
  [CurrencyID.LIQUID_USDT]: process.env.REACT_APP_LIQUID_USDT_REGTEST!,
}

export const CurrencyToAssetByChain: Record<'liquid' | 'regtest', AssetByCurrency> = {
  liquid: LiquidAssetHashByCurrenyID,
  regtest: RegtestAssetHashByCurrenyID
}
import axios from 'axios'

import { CoinGeckoUrl } from '../constants/tokens'

interface DataForNftProps {
  start: number
  limit?: number
  sort?: string
  desc?: boolean
  period?: number
}
// start:0,limit:10,ort:'volume',desc:true,period:1
export async function getDataForNft(obj: DataForNftProps) {
  return await axios.get('https://api.coinmarketcap.com/data-api/v3/nft/collections', {
    params: obj,
  })
}

export function getCoingeckoSimplePrice<T>(config: {
  ids: string
  vsCurrency?: string
  include24hChange?: boolean
}): Promise<T> {
  return axios
    .get<T>(`${CoinGeckoUrl}/simple/price`, {
      params: {
        ids: config.ids,
        vs_currencies: config.vsCurrency ?? 'usd',
        include_24hr_change: config.include24hChange ?? true,
      },
    })
    .then((response) => response.data)
}

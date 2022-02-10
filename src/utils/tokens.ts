import { Contract } from '@ethersproject/contracts'
import { Web3Provider } from '@ethersproject/providers'
import ERC20_ABI from 'abis/erc20.json'
import { Erc20 } from 'abis/types'
import { IToken, ITokenItem, TOKENS } from 'constants/tokens'
import { IMiniToken } from 'state/strategy/reducer'
import { getContract } from 'utils'

import { toLower } from './commons'
import { uniqueArr } from './uniqueArr'

// export function addressToId<T extends string | string[]>(tokenAddress: T): T {
//   const lowerTokenAddress = tolower(tokenAddress)
//   if (typeof lowerTokenAddress === 'string') {
//     return TOKENS[lowerTokenAddress].id as T
//   }
//   if (Array.isArray(lowerTokenAddress)) {
//     const aa = lowerTokenAddress.filter((x) => {
//       if (TOKENS[x]) return TOKENS[x].id as string
//       return false
//     })
//     // return aa
//   }
//   return tokenAddress
// }
/**
 *
 * @param tokens
 * @returns
 */
export function formatTokens(tokens: IToken) {
  const newTokens: IToken = {}
  for (const key in tokens) {
    if (Object.prototype.hasOwnProperty.call(tokens, key)) {
      const element = tokens[key]
      element.address = toLower(key)
      newTokens[toLower(key)] = element
    }
  }
  return newTokens
}

export function addressesToIds(tokenAddresses: string[]): string[] {
  const lowerTokenAddress = toLower(tokenAddresses)
  return lowerTokenAddress.map((x) => {
    if (TOKENS[x]) return TOKENS[x].id as string
    return ''
  })
}
function addressToId(address: string, tokens: IToken) {
  const lowerTokenAddress = toLower(address)
  return TOKENS[lowerTokenAddress].id ?? undefined
}

export function getTokenItemByAddress(address: string | string[], tokens: IToken) {
  const values = Object.values(tokens)

  if (Array.isArray(address)) {
    return address.map((item) => {
      return values.find((x) => toLower(x.address) === toLower(item))
    })
  }
  return values.find((x) => toLower(x.address) === toLower(address))
}

/**
 *
 * @param addresses
 * @param onUpdateTokenPrice
 */
export async function updateTokensByAddresses(
  addresses: string[],
  onUpdateTokenPrice: (tokenAddress: string, tokenItem: ITokenItem) => void
) {
  const tokenArr = uniqueArr(addresses)
  const tokenIds = addressesToIds(tokenArr).join(',')
}
export function addressToItem(addresses: string[], library: Web3Provider) {
  // if (!Array.isArray(addresses)) {
  //   const contract = getContract(addresses, ERC20_ABI, library) as Erc20
  //   const q = Promise.all([contract.symbol(), contract.decimals()])
  //   return [
  //     {
  //       address: addresses,
  //       symbol: await contract.symbol(),
  //       decimals: await contract.decimals(),
  //     },
  //   ]
  // }

  return addresses.map(async (item) => {
    const contract = getContract(item, ERC20_ABI, library) as Erc20
    return {
      address: item,
      symbol: await contract.symbol(),
      decimals: await contract.decimals(),
    }
  })
}
export function getERC20Balances(
  account: string,
  addresses: string[],
  library: Web3Provider,
  tokens: IToken
): Promise<IMiniToken>[] {
  return addresses.map(async (x) => {
    const contract = getContract(x, ERC20_ABI, library) as Erc20
    if (typeof contract?.balanceOf === 'function') {
      const underlyBalance = await contract.balanceOf(account)
      return { address: x, balance: underlyBalance.toString() }
    }
    return { address: x, balance: '0' }
  })
}

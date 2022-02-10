import { BaseQueryApi, BaseQueryFn } from '@reduxjs/toolkit/dist/query/baseQueryTypes'
import { createApi } from '@reduxjs/toolkit/query/react'
import { SupportedChainId } from 'constants/chains'
import { DocumentNode } from 'graphql'
import { ClientError, gql, GraphQLClient } from 'graphql-request'
import { AppState } from 'state'

// List of supported subgraphs. Note that the app currently only support one active subgraph at a time
const CHAIN_SUBGRAPH_URL: Record<number, string> = {
  [SupportedChainId.MAINNET]: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
  [SupportedChainId.RINKEBY]: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',

  [SupportedChainId.ARBITRUM_ONE]: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-arbitrum-one',

  [SupportedChainId.OPTIMISM]: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-optimism',
}

export const api = createApi({
  reducerPath: 'dataApi',
  baseQuery: graphqlRequestBaseQuery(),
  endpoints: (builder) => ({
    allV3Ticks: builder.query({
      query: ({ poolAddress, skip = 0 }) => ({
        document: gql`
          query allV3Ticks($poolAddress: String!, $skip: Int!) {
            ticks(first: 1000, skip: $skip, where: { poolAddress: $poolAddress }, orderBy: tickIdx) {
              tickIdx
              liquidityNet
              price0
              price1
            }
          }
        `,
        variables: {
          poolAddress,
          skip,
        },
      }),
    }),
    feeTierDistribution: builder.query({
      query: ({ token0, token1 }) => ({
        document: gql`
          query feeTierDistribution($token0: String!, $token1: String!) {
            _meta {
              block {
                number
              }
            }
            asToken0: pools(
              orderBy: totalValueLockedToken0
              orderDirection: desc
              where: { token0: $token0, token1: $token1 }
            ) {
              feeTier
              totalValueLockedToken0
              totalValueLockedToken1
            }
            asToken1: pools(
              orderBy: totalValueLockedToken0
              orderDirection: desc
              where: { token0: $token1, token1: $token0 }
            ) {
              feeTier
              totalValueLockedToken0
              totalValueLockedToken1
            }
          }
        `,
        variables: {
          token0,
          token1,
        },
      }),
    }),
    addressHistory: builder.query({
      query: ({ owner, first = 1000, skip = 0 }) => ({
        document: gql`
          query addressHistory($owner: Bytes!, $first: Int!, $skip: Int!) {
            positionSnapshots(
              first: $first
              skip: $skip
              where: { owner: $owner }
              orderBy: timestamp
              orderDirection: desc
            ) {
              id
              owner
              position {
                id
                tickLower {
                  tickIdx
                }
                tickUpper {
                  tickIdx
                }
              }
              transaction {
                mints {
                  owner
                  origin
                  id
                  timestamp
                  pool {
                    id
                    token0 {
                      id
                      symbol
                      decimals
                      name
                    }
                    token1 {
                      id
                      symbol
                      decimals
                      name
                    }
                    feeTier
                  }
                  amount
                  amount0
                  amount1
                  amountUSD
                  transaction {
                    id
                    blockNumber
                    timestamp
                    gasUsed
                    gasPrice
                  }
                }
                burns {
                  owner
                  origin
                  id
                  timestamp
                  pool {
                    id
                    token0 {
                      id
                      symbol
                      decimals
                      name
                    }
                    token1 {
                      id
                      symbol
                      decimals
                      name
                    }
                    feeTier
                  }
                  amount
                  amount0
                  amount1
                  amountUSD
                  transaction {
                    id
                    blockNumber
                    timestamp
                    gasUsed
                    gasPrice
                  }
                }
                swaps {
                  id
                  origin
                  sender
                  recipient
                  timestamp
                  pool {
                    id
                    token0 {
                      id
                      symbol
                      decimals
                      name
                    }
                    token1 {
                      id
                      symbol
                      decimals
                      name
                    }
                    feeTier
                  }
                  amount0
                  amount1
                  amountUSD
                  sqrtPriceX96
                  tick
                  transaction {
                    id
                    blockNumber
                    timestamp
                    gasUsed
                    gasPrice
                  }
                }
              }
            }
          }
        `,
        variables: {
          owner,
          first,
          skip,
        },
      }),
    }),
  }),
})

// Graphql query client wrapper that builds a dynamic url based on chain id
function graphqlRequestBaseQuery(): BaseQueryFn<
  { document: string | DocumentNode; variables?: any },
  unknown,
  Pick<ClientError, 'name' | 'message' | 'stack'>,
  Partial<Pick<ClientError, 'request' | 'response'>>
> {
  return async ({ document, variables }, { getState }: BaseQueryApi) => {
    try {
      const chainId = (getState() as AppState).application.chainId

      const subgraphUrl = chainId ? CHAIN_SUBGRAPH_URL[chainId] : undefined

      if (!subgraphUrl) {
        return {
          error: {
            name: 'UnsupportedChainId',
            message: `Subgraph queries against ChainId ${chainId} are not supported.`,
            stack: '',
          },
        }
      }

      return { data: await new GraphQLClient(subgraphUrl).request(document, variables), meta: {} }
    } catch (error) {
      if (error instanceof ClientError) {
        const { name, message, stack, request, response } = error
        return { error: { name, message, stack }, meta: { request, response } }
      }
      throw error
    }
  }
}

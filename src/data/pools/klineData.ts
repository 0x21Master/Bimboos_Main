import { client } from 'apollo/client'
import {
  GET_LAST_TIME_COLLECT_FEES_CHART,
  POOL_DAY_DATA_CHART,
  POOL_HOUR_DATA_CHART,
  TOP_POOL_POSITIONS_CHART,
} from 'data/GQLStatement'
import { PoolDayDataResult, PoolDayDataSchema, PoolHourDataResult, PoolHourDataSchema } from 'data/GRTResultSchema'

export async function fetchPoolHourDatas(poolAddress: string) {
  let data: PoolHourDataSchema[] = []
  const first = 1000
  let error = false
  let skip = 0
  let allFound = false
  if (poolAddress) {
    try {
      while (!allFound) {
        const {
          data: queryData,
          error,
          loading,
        } = await client.query<PoolHourDataResult>({
          query: POOL_HOUR_DATA_CHART,
          variables: {
            pool: poolAddress.toLowerCase(),
            first,
            skip,
            orderBy: 'periodStartUnix',
            orderDirection: 'desc',
          },
          fetchPolicy: 'cache-first',
        })
        if (!loading) {
          skip += first
          if (queryData.poolHourDatas.length < first || error) {
            allFound = true
          }
          if (queryData) {
            //   data = data.concat(txData.mints)
            data = [...data, ...queryData.poolHourDatas]
          }
        }
      }
    } catch (err) {
      error = true
    }
  }
  return data
}

export async function fetchPoolDayDatas(poolAddress: string) {
  let data: PoolDayDataSchema[] = []
  const first = 1000
  let error = false
  let skip = 0
  let allFound = false
  if (poolAddress) {
    try {
      while (!allFound) {
        const {
          data: queryData,
          error,
          loading,
        } = await client.query<PoolDayDataResult>({
          query: POOL_DAY_DATA_CHART,
          variables: {
            pool: poolAddress.toLowerCase(),
            first,
            skip,
            orderBy: 'date',
            orderDirection: 'desc',
          },
          fetchPolicy: 'cache-first',
        })
        if (!loading) {
          skip += first
          if (queryData.poolDayDatas.length < first || error) {
            allFound = true
          }
          if (queryData) {
            //   data = data.concat(txData.mints)
            data = [...data, ...queryData.poolDayDatas]
          }
        }
      }
    } catch (err) {
      error = true
    }
  }
  return data
}

export function fetchTest(origin: string, poolAddress: string, tickLower: number, tickUpper: number) {
  client
    .query({
      query: GET_LAST_TIME_COLLECT_FEES_CHART,
      variables: {
        origin: origin.toLowerCase(),
        pool: poolAddress.toLowerCase(),
        tickLower,
        tickUpper,
      },
      fetchPolicy: 'cache-first',
    })
    .then((result) => {
      // console.log('result:', result)
    })
}

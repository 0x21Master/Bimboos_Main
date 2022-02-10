import Moment from 'moment'

function isMilliSecond(time: number) {
  return String(time).length === 13
}
function isSecond(time: number) {
  return String(time).length === 10
}
export function formatTimestampToSecond(time: number) {
  if (isMilliSecond(time)) {
    time = parseInt((time / 1000).toFixed(0))
  }
  if (!isSecond(time)) return undefined
  return time
}

type TimeFormat = 'yyyy-MM-DD' | 'yyyy-MM-DD HH:mm' | 'yyyy-MM-DD hh:mm:ss' | 'yyyyMMDDhhmmss'
export function getFormattedTimeString(time: number, format: TimeFormat = 'yyyy-MM-DD') {
  if (String(time).length === 10) {
    return Moment(Number(time) * 1000).format(format)
  } else if (String(time).length === 13) {
    return Moment(Number(time)).format(format)
  } else {
    return ''
  }
}

type DateFormatType = 'day' | 'hour' | 'minute' | 'second' | undefined

export function getDateDiff(diffTimestamp: number) {
  const result: { dateNumber: number | undefined; dateFormat: DateFormatType } = {
    dateNumber: undefined,
    dateFormat: undefined,
  }
  if (diffTimestamp < 0) return result

  const minute = 60
  const hour = minute * 60
  const day = hour * 24
  const dayC = diffTimestamp / day
  const hourC = diffTimestamp / hour
  const minC = diffTimestamp / minute

  if (dayC >= 1) {
    result.dateNumber = parseInt(dayC.toString())
    result.dateFormat = 'day'
  } else if (hourC >= 1) {
    result.dateNumber = parseInt(hourC.toString())
    result.dateFormat = 'hour'
  } else if (minC >= 1) {
    result.dateNumber = parseInt(minC.toString())
    result.dateFormat = 'minute'
  } else {
    result.dateNumber = 0
    result.dateFormat = 'second'
  }
  return result
}

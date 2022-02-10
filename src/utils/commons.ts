export function setProps(obj: any, propsName: string, props: any) {
  const newObj = Object.assign({}, obj)
  newObj[toLower(propsName)] = props
  return newObj
}
export function getProps<R>(obj: any, propsName: string): R | undefined {
  if (toLower(propsName) in obj && Object.prototype.hasOwnProperty.call(obj, propsName)) {
    return obj[toLower(propsName)] as R
  }
  return undefined
}

export function toLower<T>(obj: T, method = 'toLowerCase'): T {
  if (typeof obj === 'string') {
    return obj.toLowerCase() as unknown as T
  } else if (Array.isArray(obj)) {
    return obj.map((x) => {
      if (hasOwnFunction(x, method)) {
        return x[method]()
      }
      return x
    }) as unknown as T
  }
  return obj
}

function hasOwnFunction(obj: any, funcName: string) {
  return typeof obj[funcName] === 'function'
}

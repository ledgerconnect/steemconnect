import {fromJS} from 'immutable'

/** Provide either a `value` or an `updater` function.
*/
export function updateIn(state, {key, value, notSetValue, updater}) {
  const keyPath = Array.isArray(key) ? key : [key]
  if(value !== undefined) {
    if(updater)
      throw new TypeError('Provide either a `value` or `updater` function.')

    updater = () => fromJS(value)
  } else if(!updater) {
    throw new TypeError('Provide either a `value` or `updater` function.')
  } else {
    const updaterParam = updater
    updater = (...args) => fromJS(updaterParam(...args))
  }
  return state.updateIn(keyPath, notSetValue, updater)
}

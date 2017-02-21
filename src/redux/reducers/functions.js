
/** Provide either a `value` or an `updater` function.  Caller must ensure Immutable data is provided.
*/
export function updateIn(state, {key, value, notSetValue, updater}) {
  const keyPath = Array.isArray(key) ? key : [key]
  if(value !== undefined) {
    if(updater)
      throw new TypeError('Provide either a `value` or `updater` function.')

    updater = () => value
  } else if(!updater) {
    throw new TypeError('Provide either a `value` or `updater` function.')
  }
  return state.updateIn(keyPath, notSetValue, updater)
}

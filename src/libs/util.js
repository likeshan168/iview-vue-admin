import store from '../store'

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
function find (list, f) {
  return list.filter(f)[0]
}

/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */
export function deepCopy (obj, cache = []) {
  // just return if obj is immutable value
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  // if obj is hit, it is in circular structure
  const hit = find(cache, c => c.original === obj)
  if (hit) {
    return hit.copy
  }

  const copy = Array.isArray(obj) ? [] : {}
  // put the copy into cache at first
  // because we want to refer it in recursive deepCopy
  cache.push({
    original: obj,
    copy
  })

  Object.keys(obj).forEach(key => {
    copy[key] = deepCopy(obj[key], cache)
  })

  return copy
}

/**
 * forEach for object
 */
export function forEachValue (obj, fn) {
  Object.keys(obj).forEach(key => fn(obj[key], key))
}

export function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

export function isPromise (val) {
  return val && typeof val.then === 'function'
}

export function assert (condition, msg) {
  if (!condition) throw new Error(`[vuex] ${msg}`)
}

let util = {}

util.title = function (title) {
  title = title ? title + ' - Home' : 'iView Admin'
  window.document.title = title
}
util.checkPermission = ( item) => {

  if(!item.meta || !item.meta.auth) return true;

  let userRoles = store.getters.roles
  console.log(userRoles)
  if(!(userRoles instanceof Array)  || userRoles.length === 0) return false;

  if (userRoles && userRoles.indexOf('ROLE_ADMIN') >= 0) return true // 管理员拥有所有权限
  if (item.meta && item.meta.auth) {
    if (item.meta.auth instanceof Array) {
      return userRoles && userRoles.some(role => item.meta.auth.indexOf(role) >= 0)
    } else {
      return userRoles && userRoles.indexOf(item.meta.auth) >= 0
    }
  } else {
    return true
  }
}
export default util

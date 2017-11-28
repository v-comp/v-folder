export default function createDispatchCenter (Vue) {
  const dispatchCenter = new Vue()

  Vue.prototype.$listen = function (type, callback) {
    const { uid } = this

    dispatchCenter.$on(`#${uid}@${type}`, e => {
      if (e && uid === e.uid) {
        callback && callback(e.data)
      }
    })
  }

  Vue.prototype.$announce = function (type, data) {
    const { uid } = this
    dispatchCenter.$emit(`#${uid}@${type}`, { data, uid })
  }

  Vue.prototype.$hangup = function (type, fn) {
    const { uid } = this

    if (type) {
      dispatchCenter.$off(`#${uid}@${type}`, fn)
    } else {
      const prefix = `#${uid}@`
      Object.keys(dispatchCenter._events)
        .filter(k => k.indexOf(prefix) === 0)
        .forEach(k => dispatchCenter.$off(k, fn))
    }
  }

  return dispatchCenter
}

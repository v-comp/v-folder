export const eventMix = function (Vue) {
  let hub = new Vue()
  let proto = Vue.prototype

  proto.___von = function (type, cb) {
    let uid = this.uid

    let fn = function (e) {
      if (uid === e.uid && cb) {
        cb(e.data)
      }
    }

    hub.$on(`#${uid}@${type}`, fn)
  }

  proto.___vemit = function (type, data) {
    let uid = this.uid
    hub.$emit(`#${uid}@${type}`, { data, uid })
  }

  proto.___voff = function (type, fn) {
    let uid = this.uid

    if (type) {
      hub.$off(`#${uid}@${type}`, fn)
    } else {
      uid = `#${uid}@`
      let types = Object.keys(hub._events)
      let match = types.filter(k => k.indexOf(uid) === 0)
      match.forEach(k => {
        hub.$off(k, fn)
      })
    }
  }
}

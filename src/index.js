import VFolderComp from './index.vue'
import createDispatchCenter from './utils/dispatchCenter'

VFolderComp.install = Vue => {
  const [major, minor, patch] = Vue.version.split('.')
  const versionOk = major > 2 || (+major === 2 && (minor > 1 || (+minor === 1 && patch >= 5)))

  if (!versionOk) {
    throw new Error('You should at least get Vue.js@2.1.5.')
  }

  createDispatchCenter(Vue)
  Vue.component(VFolderComp.name, VFolderComp)
}

if (typeof winodw !== 'undefined' && window.Vue) {
  window.Vue.use(VFolderComp)
}

export default VFolderComp

<template>
  <ul class="v-branch-body">
    <v-node :data="node" :uid="uid"></v-node>
    <v-branch
      v-show="node.open"
      v-for="branch in branches"
      :data="branch"
      :uid="uid"
      :key="uid"
    ></v-branch>
    <v-leaf
      v-show="node.open"
      v-for="leaf in leafs"
      :data="leaf"
      :uid="uid"
      :key="uid"
    ></v-leaf>
  </ul>
</template>

<script>
  import Store from './utils/store'
  import EventMixin from './utils/mixin'
  import VNode from './components/v-node.vue'
  import VLeaf from './components/v-leaf.vue'
  import VBranch from './components/v-branch.vue'
  import styles from './styles.css'

  let uid = 0

  export default {
    name: 'v-folder',
    mixins: [EventMixin],

    props: {
      data: Object,
      ajax: Object,
      conf: Object
    },

    components: {
      'v-node': VNode,
      'v-leaf': VLeaf,
      'v-branch': VBranch
    },

    watch: {
      data(newVal, oldVal) {
        let nameKey = this.conf && this.conf.node || 'name'
        if (newVal[nameKey] !== oldVal[nameKey]) {
          this.store = new Store(newVal, this.conf)
        }
      }
    },
    data() {
      return {
        uid: uid++,
        store: new Store(this.data, this.conf)
      }
    },

    computed: {
      root() {
        return this.store.dataStore
      },
      branches() {
        return this.root.branches
      },
      leafs() {
        return this.root.leafs
      },
      node() {
        return this.root.node
      }
    },
    
    methods: {
      resTransform(data, node) {
        let conf = this.conf || {}
        let dirKey  = conf['branch'] || 'dirs'
        let fileKey = conf['leaf'] || 'files'
        let nameKey = conf['node'] || 'name'

        data[nameKey] = node.name
        data[dirKey]  = data[dirKey].map(d => ({[nameKey]: d}))
        return data
      },

      getRequestConfig(node) {
        let config = this.ajax || {}
        let { url, method, data, params, pathAs, headers } = config

        if (method || method.toUpperCase() === 'GET') {
          config.params = (params || {})
          config.params[pathAs] = node.path
        } else {
          config.data = (data || {})
          config.data[pathAs] = node.path
        }

        config.method = method || 'GET'
        config.headers = headers || {}

        return config
      },

      request(node) {
        if (!this.ajax) {
          return Promise.reject('ajax:false')
        }

        let process = this.ajax.process || (res => res)

        return this.$http(this.getRequestConfig(node))
          .then(res => {
            let data = process(res.data)
            return this.resTransform(data, node)
          })
      }
    },

    created() {
      this.listen('change', node => {
        this.store
          .commit('change', node)
          .then(res => this.$emit('change', res))
      })

      this.listen('unfold', node => {
        if (node.open && node.canOpen) {
          node.open =! node.open
          return
        }

        this.store
          .commit('unfold', node)
          .then(() => {

            this.request(node)
              .then(data => {
                if (data) {
                  this.store.merge(data, node)
                } else {
                  throw 'empty'
                }
              })
              .catch(e => {
                node.status = 'empty'
                window.console && console.error(e)
              })
          })
          .catch(e => {
            node.status = 'done'
          })

      })
    },
    destroyed () {
      this.distroy()
    }
  }
</script>

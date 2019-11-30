import Vue from "vue"
import Vuex from "vuex"
import persist from "vuex-persist"
import qs from "qs"

Vue.use(Vuex)

export const state = () => ({
  token: null,
  cameras: null
})

export const mutations = {
  SET_USER(state, { token }) {
    state.token = token
  },

  UNSET_USER(state) {
    state.token = null
  },

  SET_CAMERAS(state, { cameras }) {
    state.cameras = cameras
  },

  UNSET_CAMERAS(state) {
    state.cameras = null
  }
}

export const actions = {
  LOGOUT({ commit }) {
    commit("UNSET_USER")
    commit("UNSET_CAMERAS")
    this.app.router.push("/login")
  },

  async LOGIN({ commit }, { form }) {
    try {
      const config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
      const data = await this.$axios.$post(
        process.env.API_URL + "auth/login",
        qs.stringify(form),
        config
      )

      this.$axios.setToken(data.token, "Bearer")
      const cameras_json = await this.$axios.$get(
        `${process.env.API_URL}cameras`
      )
      commit("SET_USER", data)
      commit("SET_CAMERAS", cameras_json)
      this.app.router.push("/cameras")
    } catch (err) {
      console.log(err)
    }
  },

  async CAMERAS({ commit }) {
    try {
      const data = await this.$axios.$get(`${process.env.API_URL}cameras`)
      commit("SET_CAMERAS", data)
    } catch (err) {
      console.log(err)
    }
  }
}

export const getters = {
  token: state => state.token,
  cameras: state => state.cameras,
  isAuthenticated: state => state.token !== null
}

export const plugins = [
  new persist({
    storage: window.localStorage,
    key: "state",
    restoreState: (key, storage) => {
      try {
        const state = JSON.parse(storage.getItem(key))
        return state
      } catch (err) {
        return undefined
      }
    }
  }).plugin
]

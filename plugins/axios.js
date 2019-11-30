export default function({ store, app: { $axios } }) {
  if (store.getters.token) {
    $axios.setToken(store.getters.token, "Bearer")
  }
}

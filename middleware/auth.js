export default ({ store, redirect }) => {
  if (store.getters.token == null) {
    redirect("/login")
  }
}

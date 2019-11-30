export default ({ store, redirect }) => {
  if (store.getters.token !== null) {
    redirect("/cameras")
  }
}

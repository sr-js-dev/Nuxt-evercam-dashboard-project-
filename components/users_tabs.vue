<template>
  <v-tabs>
    <v-tab :to="'/users/account'" nuxt>
      Account
    </v-tab>
    <v-tab :to="'/users/password'" nuxt>
      Password
    </v-tab>
    <v-tab :to="'/users/activities'" nuxt>
      Activities
    </v-tab>
    <v-tab :to="'/users/embedded-live-view'" nuxt>
      Live View Widget
    </v-tab>
    <v-tab :to="'/users/embedded-recordings'" nuxt>
      Recordings Widget
    </v-tab>
    <v-tab :to="'/users/api-call'" nuxt>
      API
    </v-tab>
  </v-tabs>
</template>

<script>
export default {
  name: "UserTabs",
  computed: {
    route() {
      return this.$route.params.id
    }
  }
}
</script>

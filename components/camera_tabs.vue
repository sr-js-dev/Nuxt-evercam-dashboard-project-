<template>
  <v-sheet class="tabs" elevation="6">
    <v-tabs>
      <v-tab :to="'/cameras/' + route" nuxt>
        Live View
      </v-tab>
      <v-tab :to="'/cameras/' + route + '/recordings'" nuxt>
        Recordings
      </v-tab>
      <v-tab :to="'/cameras/' + route + '/shares'" nuxt>
        Sharing
      </v-tab>
      <v-tab :to="'/cameras/' + route + '/details'" nuxt>
        Details
      </v-tab>
      <v-tab :to="'/cameras/' + route + '/logs'" nuxt>
        Logs
      </v-tab>
      <v-tab :to="'/cameras/' + route + '/archives'" nuxt>
        Archives
      </v-tab>
      <v-tab :to="'/cameras/' + route + '/compare'" nuxt>
        Compare
      </v-tab>
      <v-tab :to="'/cameras/' + route + '/local-recordings'" nuxt>
        Local Recordings
      </v-tab>
      <v-tab :to="'/cameras/' + route + '/creator'" nuxt>
        Time-lapse Creator
      </v-tab>
    </v-tabs>
  </v-sheet>
</template>

<style scoped>
.tabs {
  border-radius: 0 !important;
}
</style>

<script>
export default {
  name: "CameraTabs",
  computed: {
    route() {
      return this.$route.params.id
    }
  }
}
</script>

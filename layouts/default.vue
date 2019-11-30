<template>
  <v-app>
    <left />
    <v-content>
      <v-container>
        <CameraTabs v-show="camera" />
        <UsersTabs v-if="users == 'users'" />
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<style scoped>
.container {
  padding: 0px;
  max-width: 9999px;
  height: 100%;
}
</style>

<script>
import Left from "~/components/left.vue"
import CameraTabs from "~/components/camera_tabs.vue"
import UsersTabs from "~/components/users_tabs.vue"

export default {
  middleware: "auth",
  components: {
    Left,
    CameraTabs,
    UsersTabs
  },
  computed: {
    camera() {
      return this.$route.params.id
    },
    users() {
      return this.$route.fullPath.split("/")[1]
    }
  }
}
</script>

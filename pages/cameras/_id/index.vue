<template>
  <v-layout align-center justify-center style="">
    <v-progress-circular
      v-if="isLoading"
      :size="80"
      :width="7"
      color="primary"
      indeterminate
      class="loading"
    />
    <v-img
      v-else
      :src="url"
      :lazy-src="url"
      class="grey lighten-2"
      width="100%"
    />
    <div v-if="!isLoading" class="text-xs-center buttons">
      <v-btn
        v-if="!isPlaying"
        dark
        fab
        small
        color="rgba(0, 0, 0, 0.65)"
        @click="
          isPlaying = !isPlaying
          playJpegStream()
        "
      >
        <v-icon>fas fa-play</v-icon>
      </v-btn>
      <v-btn
        v-else
        dark
        fab
        small
        color="rgba(0, 0, 0, 0.65)"
        @click="
          isPlaying = !isPlaying
          stopJpegStream()
        "
      >
        <v-icon>fas fa-pause</v-icon>
      </v-btn>
      <v-btn dark fab small color="rgba(0, 0, 0, 0.65)">
        <v-icon>fas fa-search</v-icon>
      </v-btn>
      <v-btn dark fab small color="rgba(0, 0, 0, 0.65)">
        <v-icon>fas fa-download</v-icon>
      </v-btn>
      <v-btn dark fab small color="rgba(0, 0, 0, 0.65)">
        <v-icon>fas fa-pencil-alt</v-icon>
      </v-btn>
      <v-btn dark fab small color="rgba(0, 0, 0, 0.65)">
        <v-icon>fas fa-expand-arrows-alt</v-icon>
      </v-btn>
    </div>
  </v-layout>
</template>

<style scope>
.buttons {
  position: absolute;
}
.button {
  opacity: 0.5;
}
.loading {
  position: absolute;
  top: 50%;
}
</style>

<script>
import { Socket } from "phoenix-socket"
import { mapGetters } from "vuex"

export default {
  name: "Live",
  data: () => ({
    publicPath: process.env.BASE_URL,
    isPlaying: true,
    url: "",
    isLoading: true
  }),
  computed: {
    ...mapGetters(["token"])
  },
  watch: {
    $route() {
      if (this.channel) {
        this.isLoading = true
        this.channel.leave()
      }
      this.playJpegStream()
    }
  },
  created() {
    this.playJpegStream()
  },
  beforeDestroy() {
    //do something before destroying vue instance
    this.stopJpegStream()
  },
  methods: {
    async playJpegStream() {
      this.isPlaying = true
      let socket = new Socket(process.env.SOCKET_URL, {
        params: {
          token: this.token,
          ip: "1.1.1.1",
          source: "private_widget"
        }
      })
      socket.connect()
      this.channel = socket.channel("cameras:" + this.$route.params.id, {})
      this.channel.join()
      this.channel.on("snapshot-taken", data => {
        this.url = "data:image/jpeg;base64," + data.image
        this.isLoading = false
      })
    },
    stopJpegStream() {
      if (this.channel) {
        this.channel.leave()
      }
    }
  }
}
</script>

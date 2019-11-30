<template>
  <v-layout wrap>
    <v-flex v-for="item in items" :key="item.exid" xs12 md4 camera-container>
      <nuxt-link :to="item.to" class="camera-link">
        <v-img
          :id="item.exid"
          :src="item.thumbnail"
          :lazy-src="item.thumbnail"
          aspect-ratio="1"
          class="image-container"
        />
        <v-card class="camera-info">
          {{ item.title }}
          <v-icon v-if="item.status !== 'online'" x-small class="red--text">
            fa fa-unlink
          </v-icon>
        </v-card>
      </nuxt-link>
    </v-flex>
  </v-layout>
</template>

<style scoped>
.camera-container {
  overflow: hidden;
  height: 412px;
  margin-top: 0;
  padding-left: 0;
  padding-right: 0;
}

.camera-link {
  text-decoration: none;
}

.image-container {
  height: 412px;
  background-image: url(~static/evercam-loading-gif.gif);
  background-position: center center;
  background-size: 150px;
  background-color: #fff !important;
}

.camera-info {
  background-color: transparent !important;
  box-shadow: none;
  font-size: 12px;
  margin-top: -22px;
  margin-left: 5px;
  position: relative;
}
</style>

<script>
import { Socket } from "phoenix-socket"
import { mapGetters } from "vuex"

export default {
  components: {
    //
  },
  data: () => ({
    clipped: true,
    drawer: true,
    fixed: true,
    items: [],
    item_indexs: [],
    miniVariant: false,
    right: true,
    rightDrawer: false,
    title: "Evercam",
    clearThumbnailTimeOut: null,
    exids: ""
  }),
  computed: {
    ...mapGetters(["token", "cameras"])
  },
  watch: {
    $route() {
      if (this.channel) {
        this.channel.leave()
      }
    }
  },
  beforeDestroy() {
    this.clearTimer()
  },
  mounted() {
    this.getCameras()
  },
  methods: {
    async getCameras() {
      let myitems = []
      let camera_exids = []
      let array_indexes = []
      let socket = new Socket(process.env.SOCKET_URL, {
        params: {
          token: this.token,
          ip: "1.1.1.1",
          source: "Thumbnail render"
        }
      })
      socket.connect()
      let thumbnail_channel = socket.channel("thumbnail:render", {})
      thumbnail_channel.join()

      this.cameras.forEach(function(camera, index) {
        array_indexes[camera.id] = index
        camera_exids.push(camera.id)
        myitems.push({
          thumbnail: require("~/static/unavailable.jpg"),
          title: camera.name,
          exid: camera.id,
          status: camera.status,
          to: "/cameras/" + camera.id
        })
      })
      this.items = myitems
      this.exids = camera_exids
      this.item_indexs = array_indexes

      thumbnail_channel.on("thumbnail", data => {
        let item = this.items[this.item_indexs[data.camera_exid]]
        item.thumbnail = `data:image/jpeg;base64,${data.image}`
      })
      thumbnail_channel.push("thumbnail", {
        body: camera_exids.join()
      })

      this.channel = thumbnail_channel
      this.clearThumbnailTimeOut = setTimeout(this.refreshThumbnail, 300000)
    },

    refreshThumbnail() {
      this.channel
        .push("thumbnail", {
          body: this.exids.join()
        })
        .catch(function(error) {
          console.log(error)
        })
      this.clearThumbnailTimeOut = setTimeout(this.refreshThumbnail, 300000)
    },

    clearTimer() {
      clearTimeout(this.clearThumbnailTimeOut)
    }
  }
}
</script>

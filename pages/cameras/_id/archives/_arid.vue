<template>
  <v-layout>
    <v-snackbar
      v-model="snackbar"
      :bottom="y === 'bottom'"
      :color="color"
      :multi-line="mode === 'multi-line'"
      :timeout="timeout"
      :top="y === 'top'"
      :vertical="mode === 'vertical'"
    >
      {{ text }}
      <v-btn dark text @click="snackbar = false">
        <v-icon>fas fa-times</v-icon>
      </v-btn>
    </v-snackbar>
    <div id="video-player" class="pl-6 pr-6" style="width: 100%">
      <v-row>
        <v-col cols="12" sm="11">
          <v-btn
            text
            color="primary"
            nuxt
            :to="'/cameras/' + camera_id + '/archives'"
          >
            <v-icon small>
              fas fa-arrow-left
            </v-icon>
            &nbsp;&nbsp;Back
          </v-btn>
          <div />
        </v-col>
        <v-col v-if="has_edit_right" cols="12" sm="1" class="text-right">
          <v-btn icon color="primary" @click.stop="deleteDialog = true">
            <v-icon small>
              fas fa-trash
            </v-icon>
          </v-btn>
          <v-dialog v-model="deleteDialog" max-width="290">
            <v-card>
              <v-card-title class="headline">
                Are you sure?
              </v-card-title>

              <v-card-actions>
                <div class="flex-grow-1" />
                <v-btn color="primary" @click="deleteArchive">
                  Yes, remove
                </v-btn>
                <v-btn color="primary" text @click="deleteDialog = false">
                  CANCEL
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="12">
          <img
            v-if="archive.type == 'edit'"
            :src="playerOptions.sources[0].src"
            width="100%"
            title="this slowpoke moves"
          />
          <vimeo-player
            v-else-if="archive.type == 'url'"
            ref="player"
            class="embed-container"
            :options="{ responsive: true }"
            :video-id="playerOptions.sources[0].src"
          />
          <video-player
            v-else
            ref="videoPlayer"
            class="video-player-box"
            :options="playerOptions"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <div v-if="edit_title">
            <v-text-field
              v-model="title"
              outlined
              label="Title"
              class="float-left"
            />
            <v-btn
              text
              icon
              color="primary"
              class="ml-2"
              @click="
                changeTitle()
                edit_title = !edit_title
              "
            >
              <v-icon>fas fa-save</v-icon>
            </v-btn>
            <v-btn
              text
              icon
              color="primary"
              class="ml-2"
              @click="edit_title = !edit_title"
            >
              <v-icon>fas fa-times</v-icon>
            </v-btn>
          </div>
          <div v-else>
            <p class="text-left font-weight-black float-left" height="30px">
              {{ archive.title }}
            </p>
            <v-btn
              text
              icon
              color="primary"
              class="ml-2"
              @click="edit_title = !edit_title"
            >
              <v-icon>fas fa-pencil-alt</v-icon>
            </v-btn>
          </div>
        </v-col>
        <v-col cols="12" sm="6" class="text-right">
          <v-dialog
            v-if="show_share"
            v-model="dialog"
            persistent
            max-width="600"
          >
            <template v-slot:activator="{ on }">
              <v-btn text color="primary" v-on="on" @click="getShare">
                <v-icon small>
                  fas fa-share-alt
                </v-icon>
                &nbsp;&nbsp;Share
              </v-btn>
            </template>
            <v-card>
              <v-card-actions>
                <div class="flex-grow-1" />
                <v-btn color="primary" text @click="dialog = false">
                  <v-icon>fas fa-times</v-icon>
                </v-btn>
              </v-card-actions>
              <v-card-text>
                <v-row>
                  <v-col>
                    <VueCompareImage
                      v-if="archive.type == 'compare'"
                      :left-image="before_image"
                      :right-image="after_image"
                    />
                    <img
                      v-if="archive.type == 'edit'"
                      :src="playerOptions.sources[0].src"
                      width="100%"
                      title="this slowpoke moves"
                    />
                    <img
                      v-if="archive.type == 'clip'"
                      :src="archive.thumbnail_url"
                      width="100%"
                      title="this slowpoke moves"
                    />
                  </v-col>
                </v-row>
                <v-row v-if="archive.type == 'compare'">
                  <v-col sm="2">
                    Embed
                  </v-col>
                  <v-col>
                    <v-text-field :value="archive.embed_code" />
                  </v-col>
                </v-row>
                <v-row v-if="archive.type == 'compare'">
                  <v-col sm="2">
                    GIF
                  </v-col>
                  <v-col>
                    <v-text-field
                      :value="
                        playerOptions.sources[0].src.replace(/mp4.*/gi, 'gif')
                      "
                    />
                  </v-col>
                </v-row>
                <v-row v-if="archive.type == 'clip'">
                  <v-col sm="2">
                    Frames
                  </v-col>
                  <v-col>
                    <p>{{ archive.frames }}</p>
                  </v-col>
                </v-row>
                <v-row v-if="archive.type == 'clip'">
                  <v-col sm="2">
                    Duration
                  </v-col>
                  <v-col>
                    <p>{{ clip_duration }}</p>
                  </v-col>
                </v-row>
                <v-row
                  v-if="archive.type == 'compare' || archive.type == 'clip'"
                >
                  <v-col sm="2">
                    MP4
                  </v-col>
                  <v-col>
                    <v-text-field
                      :value="
                        playerOptions.sources[0].src.replace(/mp4.*/gi, 'mp4')
                      "
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col sm="2">
                    Share
                  </v-col>
                  <v-col sm="5">
                    <v-btn
                      :href="
                        'http://www.facebook.com/sharer.php?u=' + share_url
                      "
                      target="_blank"
                      width="100%"
                      color="#3B5998"
                      class="white--text"
                      @click="dialog = false"
                    >
                      <v-icon>fab fa-facebook-f</v-icon>
                      &nbsp;Share
                    </v-btn>
                  </v-col>
                  <v-col sm="5">
                    <v-btn
                      :href="
                        'http://www.linkedin.com/shareArticle?url=' +
                          share_url +
                          '&title=My photo&summary=This is a photo from evercam'
                      "
                      target="_blank"
                      width="100%"
                      color="#0077B5"
                      class="white--text"
                      @click="dialog = false"
                    >
                      <v-icon>fab fa-linkedin</v-icon>
                      &nbsp;Post
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col sm="2" />
                  <v-col sm="5">
                    <v-btn
                      :href="'https://web.whatsapp.com/send?text=' + share_url"
                      target="_blank"
                      width="100%"
                      color="#25D366"
                      class="white--text"
                      @click="dialog = false"
                    >
                      <v-icon>fab fa-whatsapp</v-icon>
                      &nbsp;Message
                    </v-btn>
                  </v-col>
                  <v-col sm="5">
                    <v-btn
                      :href="
                        'http://twitter.com/share?url=' +
                          share_url +
                          '&text=This is a photo from evercam&via=evrcm'
                      "
                      target="_blank"
                      width="100%"
                      color="#1DA1F2"
                      class="white--text"
                      @click="dialog = false"
                    >
                      <v-icon>fab fa-twitter</v-icon>
                      &nbsp;Tweet
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-btn
            v-if="show_download"
            text
            color="primary"
            @click.prevent="downloadItem(playerOptions.sources[0].src)"
          >
            <v-icon small>
              fas fa-download
            </v-icon>
            &nbsp;&nbsp;download
          </v-btn>
        </v-col>
      </v-row>
      <v-divider />
      <v-row>
        <v-col cols="12" sm="10">
          <p class="text-left">
            Created on
            {{ format_date(archive.created_at, "MMMM Do YYYY, h:mm:ss a") }} by
            {{ archive.requester_name }}
          </p>
          <p class="text-left">
            From {{ format_date(archive.from_date, "DD/MM/YYY h:mm") }} to
            {{ format_date(archive.to_date, "DD/MM/YYY h:mm") }}
          </p>
        </v-col>
        <v-col v-if="show_public" cols="12" sm="2" class="text-right">
          <v-switch
            v-model="is_public"
            label="Is public"
            @change="changePublic"
          />
        </v-col>
      </v-row>
    </div>
  </v-layout>
</template>

<script>
import "video.js/dist/video-js.css"
import { videoPlayer } from "vue-video-player"
import moment from "moment"
import VueCompareImage from "vue-compare-image"

export default {
  name: "Gallery",
  components: {
    videoPlayer,
    VueCompareImage
  },
  data() {
    return {
      show_download: false,
      show_share: false,
      show_public: false,
      is_public: false,
      has_edit_right: false,
      color: "",
      mode: "",
      snackbar: false,
      text: "",
      timeout: 3000,
      y: "top",
      share_url: "",
      clip_duration: null,
      before_image: "",
      after_image: "",
      dialog: false,
      deleteDialog: false,
      title: "",
      edit_title: false,
      is_mp4: null,
      image_url: "",
      camera_id: this.$route.params.id,
      api_id: "",
      api_key: ""
    }
  },
  computed: {
    playerOptions() {
      let url = ""
      switch (this.archive.type) {
        case "clip":
          url = `${process.env.API_URL}cameras/${this.$route.params.id}/archives/${this.$route.params.arid}.mp4?api_id=${this.keys.api_id}&api_key=${this.keys.api_key}`
          break
        case "compare":
          url = `${process.env.API_URL}cameras/${this.$route.params.id}/compares/${this.$route.params.arid}.mp4?api_id=${this.keys.api_id}&api_key=${this.keys.api_key}`
          break
        case "url":
          url = this.archive.media_url
          break
        case "edit":
          url = `${process.env.API_URL}cameras/${this.$route.params.id}/archives/${this.archive.file_name}?api_id=${this.keys.api_id}&api_key=${this.keys.api_key}`
          break
        case "file":
          url = `${process.env.API_URL}cameras/${this.$route.params.id}/archives/${this.archive.file_name}?api_id=${this.keys.api_id}&api_key=${this.keys.api_key}`
          break
        case "timelapse":
          url = `${process.env.API_URL}cameras/${this.$route.params.id}/timelapse/${this.$route.params.arid}/play?api_id=${this.keys.api_id}&api_key=${this.keys.api_key}`
          break
      }
      return {
        height: "360",
        muted: false,
        autoplay: true,
        loop: true,
        fluid: true,
        language: "en",
        sources: [
          {
            type: "video/mp4",
            src: url
          }
        ]
      }
    }
  },
  async asyncData({ params, $axios }) {
    const keys = await $axios.get(process.env.API_URL + "auth/credentials")
    const archive = await $axios.get(
      process.env.API_URL + "cameras/" + params.id + "/archives/" + params.arid
    )
    return { archive: archive.data.archives[0], keys: keys.data }
  },
  mounted() {
    if (this.archive.type == "file") {
      let image = ["jpg", "gif", "bmp", "png"]
      let format = this.archive.file_name.split(".")
      if (image.indexOf(format[1]) >= 0) {
        this.archive.type = "edit"
      }
    }
    this.title = this.archive.title
    this.is_public = this.archive.public
    this.show_public =
      this.archive.type == "compare" ||
      this.archive.type == "url" ||
      this.archive.type == "timelapse"
        ? false
        : true
    this.show_download = this.archive.type == "url" ? false : true
    this.show_share =
      !this.archive.public || this.archive.type == "url" ? false : true
    this.$axios
      .$get(`${process.env.API_URL}cameras/${this.$route.params.id}`)
      .then(response => {
        this.has_edit_right = response.cameras[0].rights
          .split(",")
          .includes("edit")
      })
  },
  methods: {
    changePublic() {
      var data = {
        public: this.is_public
      }
      this.$axios
        .$patch(
          `${process.env.API_URL}cameras/${this.$route.params.id}/archives/${this.archive.id}`,
          data
        )
        .then(() => {
          this.color = "success"
          this.text = "Archive modified successfully"
          this.snackbar = true
          this.archive.title = this.title
        })
        .catch(() => {
          this.color = "error"
          this.text = "We can not made this archive public"
          this.snackbar = true
        })
    },
    deleteArchive() {
      var controller = "archives"
      if (this.archive.type == "compare") {
        controller = "compares"
      }
      if (this.archive.type == "timelapse") {
        controller = "timelapses"
      }
      var data = {
        title: this.title,
        name: this.title
      }
      this.$axios
        .$delete(
          `${process.env.API_URL}cameras/${this.$route.params.id}/${controller}/${this.archive.id}`,
          data
        )
        .then(() => {
          this.color = "success"
          this.text = "Archive removed successfully"
          this.snackbar = true
          this.$router.push(`/cameras/${this.$route.params.id}/archives`)
        })
        .catch(() => {
          this.color = "error"
          this.text = "We can not remove the archive"
          this.snackbar = true
        })
        .finally(() => {
          this.deleteDialog = false
        })
    },
    changeTitle() {
      var controller = "archives"
      if (this.archive.type == "compare") {
        controller = "compares"
      }
      if (this.archive.type == "timelapse") {
        controller = "timelapses"
      }
      var data = {
        title: this.title,
        name: this.title
      }
      this.$axios
        .$patch(
          `${process.env.API_URL}cameras/${this.$route.params.id}/${controller}/${this.archive.id}`,
          data
        )
        .then(() => {
          this.color = "success"
          this.text = "Title changed successfuly"
          this.snackbar = true
          this.archive.title = this.title
        })
        .catch(() => {
          this.color = "error"
          this.text = "We can not change the title"
          this.snackbar = true
        })
    },
    getShare() {
      if (this.archive.type == "compare") {
        var params = this.archive.embed_code.split(" ")
        var bucket_url =
          "https://s3-eu-west-1.amazonaws.com/evercam-camera-assets/"
        this.before_image = `${bucket_url}${this.$route.params.id}/compares/${
          params[6]
        }/start-${params[4]}.jpg?${Math.random()}`
        this.after_image = `${bucket_url}${this.$route.params.id}/compares/${
          params[6]
        }/end-${params[5]}.jpg?${Math.random()}`
      }
      if (this.archive.type == "clip") {
        var first = new Date(this.archive.from_date)
        var last = new Date(this.archive.to_date)
        const diffTime = Math.abs(first.getTime() - last.getTime())
        const diffMinutes = Math.ceil(diffTime / (1000 * 60))
        this.clip_duration = diffMinutes
      }
      if (this.archive.type == "file" || this.archive.type == "edit") {
        this.share_url = `${process.env.API_URL}cameras/${this.$route.params.id}/archives/${this.archive.file_name}`
      } else {
        this.share_url = `${process.env.API_URL}cameras/${this.$route.params.id}/archives/${this.archive.id}/play`
      }
    },
    downloadItem(url) {
      this.$axios.$get(url, { responseType: "blob" }).then(({ data }) => {
        const blob = new Blob([data])
        let extension = ""
        let link = document.createElement("a")
        link.href = window.URL.createObjectURL(blob)
        if (this.archive.type == "edit") {
          extension = "png"
        } else {
          extension = "mp4"
        }
        link.download = this.archive.id + "." + extension
        link.click()
      })
    },
    format_date(date, style) {
      return moment(date).format(style)
    }
  }
}
</script>

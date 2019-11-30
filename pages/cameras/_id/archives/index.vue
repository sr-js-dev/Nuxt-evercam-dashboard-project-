<template>
  <v-layout wrap>
    <v-flex v-for="archive in to_show" :key="archive.id" xs12 md3>
      <v-card
        outlined
        nuxt
        elevation="10"
        class="ma-2"
        :to="'/cameras/' + archive.camera_id + '/archives/' + archive.id"
      >
        <v-icon
          v-if="archive.type == 'compare'"
          dark
          dense
          class="pa-2 archive-icon"
        >
          fas fa-compress-arrows-alt
        </v-icon>
        <v-icon
          v-else-if="archive.type == 'clip'"
          dark
          dense
          class="pa-2 archive-icon"
        >
          fas fa-video
        </v-icon>
        <v-icon
          v-else-if="archive.type == 'url'"
          dark
          dense
          class="pa-2 archive-icon"
        >
          fas fa-copy
        </v-icon>
        <v-icon
          v-else-if="archive.type == 'edit'"
          dark
          dense
          class="pa-2 archive-icon"
        >
          fas fa-images
        </v-icon>
        <v-icon v-else dark dense class="pa-2 archive-icon">
          fas fa-history
        </v-icon>
        <v-img
          :src="archive.thumbnail_url"
          class="white--text"
          height="200px"
          gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
        >
          <v-card-title
            class="fill-height align-end"
            v-text="archive.title"
          />
        </v-img>

        <v-card-text>
          <v-icon small>
            fas fa-calendar-alt
          </v-icon>
          {{ getDate(archive.from_date) }} - {{ getDate(archive.to_date) }}
        </v-card-text>
      </v-card>
    </v-flex>
    <div v-show="pagination" class="text-xs-center pl-2 pr-2 pt-2 pb-12" style="width: 100%">
      <v-btn dark width="100%" @click="loadMore">
        Load more...
      </v-btn>
    </div>
    <div class="custom_buttom">
      <v-menu v-model="fab" top fixed transition="slide-y-transition" offset-y>
        <template v-slot:activator="{ on }">
          <v-btn v-model="fab" color="blue darken-2" dark fab v-on="on">
            <v-icon v-if="fab">
              fas fa-times
            </v-icon>
            <v-icon v-else>
              fas fa-plus
            </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in op_create"
            :key="index"
            @click="
              optionArchive(item.type)
              new_archive = item.type
            "
          >
            <v-list-item-title>
              <v-icon small>
                {{ item.icon }}
              </v-icon>
              &nbsp;{{ item.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span v-if="new_archive == 'cloud'" class="headline">
            Create Cloud Recording Clip
          </span>
          <span v-else-if="new_archive == 'local'" class="headline">
            Create Local Recording Clip
          </span>
          <span v-else-if="new_archive == 'url'" class="headline">
            Media URL
          </span>
          <span v-else class="headline">
            Upload File
          </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="title" label="Title*" required />
              </v-col>
              <v-col
                v-if="new_archive == 'cloud' || new_archive == 'local'"
                cols="12"
                sm="6"
              >
                <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="date"
                      label="Start Date*"
                      readonly
                      v-on="on"
                    />
                  </template>
                  <v-date-picker v-model="date" @input="menu2 = false" />
                </v-menu>
              </v-col>
              <v-col
                v-if="new_archive == 'cloud' || new_archive == 'local'"
                cols="12"
                sm="6"
              >
                <v-menu
                  ref="menu"
                  v-model="menu3"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="time"
                  transition="scale-transition"
                  offset-y
                  full-width
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="time"
                      label="Start Time*"
                      readonly
                      v-on="on"
                    />
                  </template>
                  <v-time-picker
                    v-if="menu3"
                    v-model="time"
                    full-width
                    @click:minute="$refs.menu.save(time)"
                  />
                </v-menu>
              </v-col>
              <v-col
                v-if="new_archive == 'cloud' || new_archive == 'local'"
                cols="12"
                sm="2"
              >
                <v-text-field
                  v-model="duration"
                  type="number"
                  label="Duration*"
                />
              </v-col>
              <v-col
                v-if="new_archive == 'cloud' || new_archive == 'local'"
                cols="12"
                sm="10"
              >
                <p>Minutes (Max 1hr per clip)</p>
              </v-col>
              <v-col v-if="new_archive == 'url'" cols="12">
                <v-text-field v-model="url" label="URL*" />
              </v-col>
              <v-col v-if="new_archive == 'upload'" cols="12">
                <div class="dropbox">
                  <input
                    type="file"
                    :disabled="isSaving"
                    class="input-file"
                    @change="filesChange($event.target.files)"
                  />
                  <p v-if="isInitial">
                    Drag your video here to begin<br>
                    or click to browse
                  </p>
                  <p v-if="isSaving">Uploading {{ fileCount }} files...</p>
                  <p v-if="isSuccess">
                    {{ file.name }}
                  </p>
                  <p v-if="isFailed">
                    Failed, click here or drag your<br>video here to try again
                  </p>
                </div>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="createArchive">
            Save To Gallery
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<style scoped>
.dropbox {
  outline: 2px dashed grey;
  outline-offset: -10px;
  background: lightcyan;
  color: dimgray;
  padding: 10px 10px;
  min-height: 200px;
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0;
  width: 100%;
  height: 200px;
  position: absolute;
  cursor: pointer;
}

.dropbox:hover {
  background: lightblue;
}

.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 50px 0;
}
</style>

<script>
import moment from "moment"
const STATUS_INITIAL = 0,
  STATUS_SAVING = 1,
  STATUS_SUCCESS = 2,
  STATUS_FAILED = 3
import tus from "tus-js-client"

export default {
  data() {
    return {
      file_extension: null,
      file_url: null,
      url: null,
      duration: null,
      title: "",
      currentStatus: 0,
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      modal: false,
      menu2: false,
      menu3: false,
      time: new Date().getHours() + ":00",
      modal2: false,
      new_archive: "",
      dialog: false,
      fab: false,
      to_show: {},
      pagination: false,
      op_create: [
        { title: "Cloud Recording Clip", icon: "fas fa-cloud", type: "cloud" },
        { title: "Local Recording Clip", icon: "fas fa-video", type: "local" },
        {
          title: "Evercam Compare",
          icon: "fas fa-compress-arrows-alt",
          type: "compare"
        },
        { title: "URL (YouTube, Vimeo...)", icon: "fas fa-link", type: "url" },
        { title: "Upload File", icon: "fas fa-upload", type: "upload" },
        { title: "Timelpase", icon: "fas fa-history", type: "timelapse" }
      ]
    }
  },
  computed: {
    isInitial() {
      return this.currentStatus === STATUS_INITIAL
    },
    isSaving() {
      return this.currentStatus === STATUS_SAVING
    },
    isSuccess() {
      return this.currentStatus === STATUS_SUCCESS
    },
    isFailed() {
      return this.currentStatus === STATUS_FAILED
    }
  },
  asyncData({ params, error, $axios }) {
    return $axios
      .$get(`${process.env.API_URL}cameras/${params.id}/archives`)
      .then(res => {
        return { archives: res.archives }
      })
      .catch(() => {
        error({ statusCode: 404, message: "Post not found" })
      })
  },
  mounted() {
    if (this.archives.length < 14) {
      this.pagination = false
    } else {
      this.pagination = true
      this.to_show = this.archives.slice(0, 13)
      this.archives = this.archives.slice(13, this.archives.length)
    }
  },
  methods: {
    async filesChange(fileList) {
      this.currentStatus = STATUS_SUCCESS
      this.file = fileList[0]
      var vuethis = this

      var options = {
        endpoint: process.env.TUS_URL,
        resume: true,
        chunkSize: Infinity,
        retryDelays: [0, 1000, 3000, 5000],
        onError: function(error) {
          console.log("Failed because: " + error)
        },
        onProgress: function(bytesUploaded, bytesTotal) {
          var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)
          console.log(bytesUploaded, bytesTotal, percentage + "%")
        },
        onSuccess: function() {
          console.log("Download %s from %s", upload.file.name, upload.url)
          vuethis.file_url = upload.url
          vuethis.file_extension = upload.file.name.split(".")[1]
        }
      }
      var upload = new tus.Upload(this.file, options)

      upload.start()
    },
    optionArchive(type) {
      switch (type) {
        case "compare":
          this.$router.push(`/cameras/${this.$route.params.id}/compare`)
          break
        case "timelapse":
          this.$router.push(`/cameras/${this.$route.params.id}/creator`)
          break
        default:
          this.dialog = !this.dialog
      }
    },
    createArchive() {
      let formData = new FormData()
      let d = new Date()
      formData.append("from_date", d)
      formData.append("to_date", d)
      formData.append("title", this.title)
      if (this.file_url) {
        this.file_type = "file"
        formData.append("file_url", this.file_url)
        formData.append("file_extension", this.file_extension)
      } else if (this.url) {
        this.file_type = "url"
        formData.append("url", this.url)
      } else {
        var from = new Date(this.date + " " + this.time)
        var to = new Date(this.date + " " + this.time)
        let dur = this.duration * 60
        to.setSeconds(to.getSeconds() + dur)
        this.file_type = "clip"
        formData.append("from_date", from.toISOString())
        formData.append("to_date", to.toISOString())
        if (this.new_archive == "local") {
          formData.append("is_nvr_archive", true)
        } else {
          formData.append("is_nvr_archive", false)
        }
      }
      formData.append("type", this.file_type)

      this.$axios
        .$post(
          `${process.env.API_URL}cameras/${this.$route.params.id}/archives`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        )
        .then(function(response) {
          if (response.status != 201) {
            console.log("done")
          } else {
            console.log("done")
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    getDate(date) {
      return moment(date).format("MM/DD/YY HH:mm")
    },
    loadMore() {
      if (this.archives.length < 14) {
        this.to_show = this.to_show.concat(
          this.archives.slice(0, this.archives.length)
        )
        this.pagination = false
      } else {
        this.to_show = this.to_show.concat(this.archives.slice(0, 13))
        this.archives = this.archives.slice(14, this.archives.length)
      }
    }
  }
}
</script>

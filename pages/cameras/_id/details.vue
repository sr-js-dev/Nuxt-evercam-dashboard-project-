<template>
  <v-container>
    <v-row>
      <v-col col="auto" lg="6" md="6" sm="12" xs="12" class="left-col">
        <v-card class="card-style">
          <v-card-title class="subtitle-1">
            Camera Details
            <v-btn class="edit-link caption" text @click="openCameraUpdate">
              EDIT
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-simple-table class="cameras-details">
              <tbody>
                <tr>
                  <td class="col-4 cam-label caption">
                    ID:
                  </td>
                  <td class="col-8 caption">
                    {{ camera.id }}
                  </td>
                </tr>
                <tr>
                  <td class="caption">
                    Name:
                  </td>
                  <td class="caption">
                    {{ camera.name }}
                  </td>
                </tr>
                <tr>
                  <td class="caption">
                    Owner:
                  </td>
                  <td class="caption">
                    {{ camera.owner }}
                  </td>
                </tr>
                <tr>
                  <td class="caption">
                    Project:
                  </td>
                  <td v-if="camera.project" class="caption">
                    {{ camera.project.name }}
                  </td>
                  <td v-else class="grey--text caption">
                    Not Set
                  </td>
                </tr>
                <tr>
                  <td class="caption">
                    Vendor:
                  </td>
                  <td class="caption">
                    {{ camera.vendor_name }}
                  </td>
                </tr>
                <tr>
                  <td class="caption">
                    Model:
                  </td>
                  <td class="caption">
                    {{ camera.model_name }}
                  </td>
                </tr>
                <tr>
                  <td class="caption">
                    Created:
                  </td>
                  <td class="caption">
                    {{ camera.created_at }}
                  </td>
                </tr>
                <tr>
                  <td class="caption">
                    Status:
                  </td>
                  <td
                    v-if="camera.status == 'online'"
                    class="green--text caption"
                  >
                    Online
                  </td>
                  <td v-else class="red--text caption">
                    Offline
                  </td>
                </tr>
                <tr>
                  <td class="caption">
                    Timezone:
                  </td>
                  <td class="caption">
                    {{ camera.timezone }}
                  </td>
                </tr>
                <tr>
                  <td class="caption">
                    Sharing:
                  </td>
                  <td class="caption">
                    Is Public:
                    <span v-if="camera.is_public" class="bold--text">
                      [Yes]
                    </span>
                    <span v-else class="bold--text">
                      [No]
                    </span>
                    <span>& Is Discoverable:</span>
                    <span v-if="camera.discoverable" class="bold--text">
                      [Yes]
                    </span>
                    <span v-else class="bold--text">[No]</span>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>

          <v-card-title class="subtitle-1">
            URLs
            <v-btn class="edit-link caption" text @click="openCameraUpdate">
              EDIT
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-simple-table class="cameras-details">
              <tbody>
                <tr>
                  <td class="col-4 cam-label caption">
                    Username:
                  </td>
                  <td v-if="camera.cam_username" class="col-8 caption">
                    {{ camera.cam_username }}
                  </td>
                  <td v-else class="grey--text caption">
                    Not Set
                  </td>
                </tr>
                <tr>
                  <td class="caption">
                    Password:
                  </td>
                  <td v-if="camera.cam_password" class="caption">
                    {{ camera.cam_password }}
                  </td>
                  <td v-else class="grey--text caption">
                    Not Set
                  </td>
                </tr>
                <tr>
                  <td class="caption">
                    Snapshot URL:
                  </td>
                  <td class="caption break-word">
                    {{ snapshot_url }}
                  </td>
                </tr>
                <tr>
                  <td class="caption">
                    H264 URL:
                  </td>
                  <td v-if="camera.external.rtsp.h264" class="caption break-word">
                    {{
                      camera.external.rtsp.h264.replace(
                        `rtsp://${camera.external.host}:${camera.external.rtsp.port}/`,
                        ""
                      )
                    }}
                  </td>
                  <td v-else class="grey--text caption">
                    Not available
                  </td>
                </tr>
                <tr>
                  <td class="caption">
                    IP (or Domain):
                  </td>
                  <td v-if="camera.external" class="caption">
                    {{ camera.external.host }}
                  </td>
                  <td v-else class="grey--text caption">
                    Not Set
                  </td>
                </tr>
                <tr>
                  <td class="caption">
                    VH HTTP Port:
                  </td>
                  <td v-if="camera.external.http.port !== ''" class="caption">
                    {{ camera.external.http.port }}
                  </td>
                  <td v-else class="grey--text caption">
                    Not Set
                  </td>
                </tr>
                <tr>
                  <td class="caption">
                    NVR HTTP Port:
                  </td>
                  <td
                    v-if="camera.external.http.nvr_port !== ''"
                    class="caption"
                  >
                    {{ camera.external.http.nvr_port }}
                  </td>
                  <td v-else class="grey--text caption">
                    Not Set
                  </td>
                </tr>
                <tr>
                  <td class="caption">
                    RTSP Port:
                  </td>
                  <td v-if="camera.external.rtsp.port !== ''" class="caption">
                    {{ camera.external.rtsp.port }}
                  </td>
                  <td v-else class="grey--text caption">
                    Not Set
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>

          <v-card-title class="subtitle-1">
            Other
          </v-card-title>
          <v-card-text>
            <v-simple-table class="cameras-details">
              <tbody>
                <tr>
                  <td class="col-4 cam-label caption">
                    Notifications:
                  </td>
                  <td class="col-8 caption">
                    <v-checkbox
                      class="notify-checkbox caption"
                      hide-details
                      light
                    >
                      <template v-slot:label>
                        <span class="caption">
                          Send me a notification if this camera goes offline
                          (azhar@evercam.io)
                        </span>
                      </template>
                    </v-checkbox>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col col="auto" lg="6" md="6" sm="12" xs="12" class="right-col">
        <v-card class="card-style">
          <v-card-title class="label subtitle-1">
            Location
            <v-btn class="edit-link caption" text>
              EDIT
            </v-btn>
          </v-card-title>
          <v-card-text>
            <gmap-map :center="center" :map-type-id="mapTypeId" :zoom="14">
              <gmap-marker
                v-for="(item, index) in markers"
                :key="index"
                :position="item.position"
                @click="center = item.position"
              />
            </gmap-map>
          </v-card-text>

          <v-card-title class="label subtitle-1">
            Last Snapshot
          </v-card-title>
          <v-card-text>
            <v-img :src="thumbnail_url" aspect-ratio="2" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="subtitle-1">
            Cameras Details
          </span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container class="model-container">
            <v-row>
              <v-col col="auto" lg="7" md="7" sm="12" xs="12">
                <v-text-field
                  v-model="camera.name"
                  label="Name"
                  class="caption bottom-padding"
                  required
                />
                <v-select
                  v-model="selectedVendor"
                  :items="vendors"
                  item-value="id"
                  item-text="name"
                  label="Vendor"
                  class="caption"
                  return-object
                  @change="onSelectVendor"
                >
                  <template slot="item" slot-scope="data">
                    <v-list-item-content>
                      <v-list-item-title class="caption" v-text="data.item.name" />
                    </v-list-item-content>
                  </template>
                </v-select>
                <v-select
                  v-model="selectedModel"
                  :items="models"
                  item-value="id"
                  item-text="name"
                  label="Model"
                  class="caption"
                  return-object
                  @change="onSelectModel"
                >
                  <template slot="item" slot-scope="data">
                    <v-list-item-content>
                      <v-list-item-title class="caption" v-text="data.item.name" />
                    </v-list-item-content>
                  </template>
                </v-select>
                <v-text-field
                  v-model="camera.cam_username"
                  label="Username"
                  class="caption col-6 text-field-left width-half"
                  required
                />
                <v-text-field
                  v-model="camera.cam_password"
                  label="Password"
                  class="caption col-6 text-field-right width-half"
                  required
                />
                <v-text-field
                  v-model="snapshot_url"
                  label="Snapshot URL"
                  class="caption"
                  required
                />
                <v-text-field
                  v-model="rtsp_url"
                  label="RTSP URL"
                  class="caption"
                  required
                />
                <v-text-field
                  v-model="camera.external.host"
                  label="IP (or URL)"
                  class="caption"
                  required
                >
                  <template slot="prepend">
                    <span class="input-group-addon">http://</span>
                  </template>
                </v-text-field>
                <v-text-field
                  v-model="camera.external.http.port"
                  label="VH HTTP Port"
                  class="caption col-4 text-field-left width-quarter"
                  required
                />
                <v-text-field
                  v-model="camera.external.http.nvr_port"
                  label="NVR HTTP Port"
                  class="caption col-4 text-field-left width-quarter"
                  required
                />
                <v-text-field
                  v-model="camera.external.rtsp.port"
                  label="RTSP Port"
                  class="caption col-4 text-field-right width-quarter"
                  required
                />

                <v-select
                  v-model="selectedTimezone"
                  :items="timezones"
                  :item-value="timezones.value"
                  label="Timezone"
                  class="caption"
                  return-object
                >
                <template v-slot:item="data">
                  <v-list-item-content>
                    <v-list-item-title class="caption" v-text="data.item.text" />
                  </v-list-item-content>
                </template>
                </v-select>
              </v-col>
              <v-col col="auto" lg="5" md="5" sm="12" xs="12" class="col-paddings">
                <v-img :src="testSnapshot" aspect-ratio="2" class="test-img" />
                <v-btn color="blue darken-1" text @click="doTestSnapshot">
                  Test Snapshot
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="updateCamera">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.input-group-addon {
  padding: 8px 10px;
  line-height: 1;
  background-color: #eee;
  border-bottom: 1px solid #999;
}

.break-word {
  word-break: break-all;
}

.left-col {
  background-color: #fff;
  color: #000;
  padding-right: 0;
}

.right-col {
  background-color: #fff;
  color: #000;
  padding-right: 24px;
}

.width-half {
  max-width: 50% !important;
}

.width-quarter {
  max-width: 33.3333333333% !important;
}

.label {
  padding-bottom: 0;
}

.bold--text {
  font-weight: bold;
}

.card-style {
  border-radius: 0;
  box-shadow: none;
}

.cam-label {
  width: 30%;
}

.cameras-details td {
  border-bottom-width: 0 !important;
  height: auto;
  padding: 5px;
}

.vue-map-container {
  height: auto;
  max-width: 992px;
  width: 100%;
  padding-top: 56.2%;
}

.edit-link {
  color: #428bca;
  -webkit-transition: all 0.2s linear;
  transition: all 0.2s linear;
  background-color: #fff;
  border-radius: 30px !important;
  border: 1px solid #428bca;
  height: 28px !important;
  padding: 0 10px !important;
  margin-left: 25px;
  text-decoration: none;
}

.model-container {
  padding: 0 !important;
}

.notify-checkbox {
  margin-bottom: 0 !important;
  margin-top: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.col-paddings {
  padding-left: 0 !important;
  padding-right: 0 !important;
  margin-top: 15px !important;
  text-align: center !important;
}

.test-img {
  margin-bottom: 10px;
}

.text-field-left {
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  float: left;
}

.text-field-right {
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
}
</style>

<script>
import moment from "moment-timezone"
import { mapActions } from "vuex"

export default {
  name: "Details",
  data() {
    return {
      dialog: false,
      vendors: [],
      models: [],
      timezones: [],
      testSnapshot: "",
      mapTypeId: "terrain"
    }
  },
  async asyncData({ params, store, $axios }) {
    const { data } = await $axios.get(
      `${process.env.API_URL}cameras/${params.id}`
    )
    let c = data.cameras[0]
    return {
      camera: c,
      thumbnail_url: `${c.thumbnail_url}?authorization=${store.getters.token}`,
      snapshot_url: c.external.http.jpg.replace(
        `${c.external.http.camera}/`,
        ""
      ),
      rtsp_url: c.external.rtsp.h264.replace(
        `rtsp://${c.external.host}:${c.external.rtsp.port}/`,
        ""
      ),
      center: { lat: c.location.lat, lng: c.location.lng },
      markers: [{ position: { lat: c.location.lat, lng: c.location.lng } }],
      selectedVendor: { name: c.vendor_name, id: c.vendor_id },
      selectedModel: { name: c.model_name, id: c.model_id },
      selectedTimezone: { value: c.timezone, text: c.timezone }
    }
  },
  mounted() {
    this.loadVendors()
    this.loadModels("hikvision")
    this.bindTimezones()
  },
  methods: {
    ...mapActions({ cameras: "CAMERAS" }),
    async loadVendors() {
      const { data } = await this.$axios.get(`${process.env.API_URL}vendors`)
      this.vendors = this.sortByKey(data.vendors, "name")
    },
    async loadModels(vendor_id) {
      const { data } = await this.$axios.get(
        `${process.env.API_URL}models?vendor_id=${vendor_id}&limit=300`
      )
      this.models = this.sortByKey(data.models, "name")
    },
    async doTestSnapshot() {
      let data = {
        external_url: `http://${this.camera.external.host}:${this.camera.external.http.port}`,
        jpg_url: this.snapshot_url,
        cam_username: this.camera.cam_username,
        cam_password: this.camera.cam_password,
        vendor_id: "hikvision",
        camera_exid: this.camera.id
      }
      try {
        let response = await this.$axios.post(
          `${process.env.API_URL}cameras/test`,
          data
        )
        this.testSnapshot = response.data.data
      } catch (e) {
        console.log(e)
      }
    },
    bindTimezones() {
      // let zones = []
      // moment.tz.names()
      //   .filter(tz => {
      //     return timezones.includes(tz)
      //   })
      //   .reduce((memo, tz) => {
      //     memo.push({
      //       name: tz,
      //       offset: moment.tz(tz).utcOffset()
      //     })
          
      //     return memo
      //   }, [])
      //   .sort((a, b) => {
      //     return a.offset - b.offset
      //   })
      //   .reduce((memo, tz) => {
      //     const timezone = tz.offset ? moment.tz(tz.name).format('Z') : ''
      //     zones.push({
      //       text: `(GMT${timezone}) ${tz.name}`,
      //       value: tz.name
      //     })
      //   }, "")
      this.timezones = [
        { value: "Etc/GMT+12", text: "(GMT-12:00) International Date Line West" },
        { value: "Pacific/Pago_Pago", text: "(GMT-11:00) American Samoa" },
        { value: "Pacific/Midway", text: "(GMT-11:00) Midway Island" },
        { value: "Pacific/Honolulu", text: "(GMT-10:00) Hawaii" },
        { value: "America/Juneau", text: "(GMT-09:00) Alaska" },
        { value: "America/Los_Angeles", text: "(GMT-08:00) Pacific Time (US &amp; Canada)" },
        { value: "America/Tijuana", text: "(GMT-08:00) Tijuana" },
        { value: "America/Phoenix", text: "(GMT-07:00) Arizona" },
        { value: "America/Chihuahua", text: "(GMT-07:00) Chihuahua" },
        { value: "America/Mazatlan", text: "(GMT-07:00) Mazatlan" },
        { value: "America/Denver", text: "(GMT-07:00) Mountain Time (US &amp; Canada)" },
        { value: "America/Guatemala", text: "(GMT-06:00) Central America" },
        { value: "America/Chicago", text: "(GMT-06:00) Central Time (US &amp; Canada)" },
        { value: "America/Mexico_City", text: "(GMT-06:00) Guadalajara" },
        { value: "America/Mexico_City", text: "(GMT-06:00) Mexico City" },
        { value: "America/Monterrey", text: "(GMT-06:00) Monterrey" },
        { value: "America/Regina", text: "(GMT-06:00) Saskatchewan" },
        { value: "America/Bogota", text: "(GMT-05:00) Bogota" },
        { value: "America/New_York", text: "(GMT-05:00) Eastern Time (US &amp; Canada)" },
        { value: "America/Indiana/Indianapolis", text: "(GMT-05:00) Indiana (East)" },
        { value: "America/Lima", text: "(GMT-05:00) Lima" },
        { value: "America/Lima", text: "(GMT-05:00) Quito" },
        { value: "America/Halifax", text: "(GMT-04:00) Atlantic Time (Canada)" },
        { value: "America/Caracas", text: "(GMT-04:00) Caracas" },
        { value: "America/Guyana", text: "(GMT-04:00) Georgetown" },
        { value: "America/La_Paz", text: "(GMT-04:00) La Paz" },
        { value: "America/Puerto_Rico", text: "(GMT-04:00) Puerto Rico" },
        { value: "America/Santiago", text: "(GMT-04:00) Santiago" },
        { value: "America/Sao_Paulo", text: "(GMT-03:00) Brasilia" },
        { value: "America/Argentina/Buenos_Aires", text: "(GMT-03:00) Buenos Aires" },
        { value: "America/Godthab", text: "(GMT-03:00) Greenland" },
        { value: "America/Montevideo", text: "(GMT-03:00) Montevideo" },
        { value: "Atlantic/South_Georgia", text: "(GMT-02:00) Mid-Atlantic" },
        { value: "Atlantic/Azores", text: "(GMT-01:00) Azores" },
        { value: "Atlantic/Cape_Verde", text: "(GMT-01:00) Cape Verde Is." },
        { value: "Europe/London", text: "(GMT+00:00) Edinburgh" },
        { value: "Europe/Lisbon", text: "(GMT+00:00) Lisbon" },
        { value: "Europe/London", text: "(GMT+00:00) London" },
        { value: "Africa/Monrovia", text: "(GMT+00:00) Monrovia" },
        { value: "Etc/UTC", text: "(GMT+00:00) UTC" },
        { value: "Europe/Amsterdam", text: "(GMT+01:00) Amsterdam" },
        { value: "Europe/Belgrade", text: "(GMT+01:00) Belgrade" },
        { value: "Europe/Berlin", text: "(GMT+01:00) Berlin" },
        { value: "Europe/Zurich", text: "(GMT+01:00) Bern" },
        { value: "Europe/Bratislava", text: "(GMT+01:00) Bratislava" },
        { value: "Europe/Brussels", text: "(GMT+01:00) Brussels" },
        { value: "Europe/Budapest", text: "(GMT+01:00) Budapest" },
        { value: "Africa/Casablanca", text: "(GMT+01:00) Casablanca" },
        { value: "Europe/Copenhagen", text: "(GMT+01:00) Copenhagen" },
        { value: "Europe/Dublin", text: "(GMT+01:00) Dublin" },
        { value: "Europe/Ljubljana", text: "(GMT+01:00) Ljubljana" },
        { value: "Europe/Madrid", text: "(GMT+01:00) Madrid" },
        { value: "Europe/Paris", text: "(GMT+01:00) Paris" },
        { value: "Europe/Prague", text: "(GMT+01:00) Prague" },
        { value: "Europe/Rome", text: "(GMT+01:00) Rome" },
        { value: "Europe/Sarajevo", text: "(GMT+01:00) Sarajevo" },
        { value: "Europe/Skopje", text: "(GMT+01:00) Skopje" },
        { value: "Europe/Stockholm", text: "(GMT+01:00) Stockholm" },
        { value: "Europe/Vienna", text: "(GMT+01:00) Vienna" },
        { value: "Europe/Warsaw", text: "(GMT+01:00) Warsaw" },
        { value: "Africa/Algiers", text: "(GMT+01:00) West Central Africa" },
        { value: "Europe/Zagreb", text: "(GMT+01:00) Zagreb" },
        { value: "Europe/Zurich", text: "(GMT+01:00) Zurich" },
        { value: "Europe/Athens", text: "(GMT+02:00) Athens" },
        { value: "Europe/Bucharest", text: "(GMT+02:00) Bucharest" },
        { value: "Africa/Cairo", text: "(GMT+02:00) Cairo" },
        { value: "Africa/Harare", text: "(GMT+02:00) Harare" },
        { value: "Europe/Helsinki", text: "(GMT+02:00) Helsinki" },
        { value: "Asia/Jerusalem", text: "(GMT+02:00) Jerusalem" },
        { value: "Europe/Kaliningrad", text: "(GMT+02:00) Kaliningrad" },
        { value: "Europe/Kiev", text: "(GMT+02:00) Kyiv" },
        { value: "Africa/Johannesburg", text: "(GMT+02:00) Pretoria" },
        { value: "Europe/Riga", text: "(GMT+02:00) Riga" },
        { value: "Europe/Sofia", text: "(GMT+02:00) Sofia" },
        { value: "Europe/Tallinn", text: "(GMT+02:00) Tallinn" },
        { value: "Europe/Vilnius", text: "(GMT+02:00) Vilnius" },
        { value: "Asia/Baghdad", text: "(GMT+03:00) Baghdad" },
        { value: "Europe/Istanbul", text: "(GMT+03:00) Istanbul" },
        { value: "Asia/Kuwait", text: "(GMT+03:00) Kuwait" },
        { value: "Europe/Minsk", text: "(GMT+03:00) Minsk" },
        { value: "Europe/Moscow", text: "(GMT+03:00) Moscow" },
        { value: "Africa/Nairobi", text: "(GMT+03:00) Nairobi" },
        { value: "Asia/Riyadh", text: "(GMT+03:00) Riyadh" },
        { value: "Europe/Moscow", text: "(GMT+03:00) St. Petersburg" },
        { value: "Asia/Muscat", text: "(GMT+04:00) Abu Dhabi" },
        { value: "Asia/Baku", text: "(GMT+04:00) Baku" },
        { value: "Asia/Muscat", text: "(GMT+04:00) Muscat" },
        { value: "Europe/Samara", text: "(GMT+04:00) Samara" },
        { value: "Asia/Tbilisi", text: "(GMT+04:00) Tbilisi" },
        { value: "Europe/Volgograd", text: "(GMT+04:00) Volgograd" },
        { value: "Asia/Yerevan", text: "(GMT+04:00) Yerevan" },
        { value: "Asia/Yekaterinburg", text: "(GMT+05:00) Ekaterinburg" },
        { value: "Asia/Karachi", text: "(GMT+05:00) Islamabad" },
        { value: "Asia/Karachi", text: "(GMT+05:00) Karachi" },
        { value: "Asia/Tashkent", text: "(GMT+05:00) Tashkent" },
        { value: "Asia/Almaty", text: "(GMT+06:00) Almaty" },
        { value: "Asia/Dhaka", text: "(GMT+06:00) Astana" },
        { value: "Asia/Dhaka", text: "(GMT+06:00) Dhaka" },
        { value: "Asia/Urumqi", text: "(GMT+06:00) Urumqi" },
        { value: "Asia/Bangkok", text: "(GMT+07:00) Bangkok" },
        { value: "Asia/Bangkok", text: "(GMT+07:00) Hanoi" },
        { value: "Asia/Jakarta", text: "(GMT+07:00) Jakarta" },
        { value: "Asia/Krasnoyarsk", text: "(GMT+07:00) Krasnoyarsk" },
        { value: "Asia/Novosibirsk", text: "(GMT+07:00) Novosibirsk" },
        { value: "Asia/Shanghai", text: "(GMT+08:00) Beijing" },
        { value: "Asia/Chongqing", text: "(GMT+08:00) Chongqing" },
        { value: "Asia/Hong_Kong", text: "(GMT+08:00) Hong Kong" },
        { value: "Asia/Irkutsk", text: "(GMT+08:00) Irkutsk" },
        { value: "Asia/Kuala_Lumpur", text: "(GMT+08:00) Kuala Lumpur" },
        { value: "Australia/Perth", text: "(GMT+08:00) Perth" },
        { value: "Asia/Singapore", text: "(GMT+08:00) Singapore" },
        { value: "Asia/Taipei", text: "(GMT+08:00) Taipei" },
        { value: "Asia/Ulaanbaatar", text: "(GMT+08:00) Ulaanbaatar" },
        { value: "Asia/Tokyo", text: "(GMT+09:00) Osaka" },
        { value: "Asia/Tokyo", text: "(GMT+09:00) Sapporo" },
        { value: "Asia/Seoul", text: "(GMT+09:00) Seoul" },
        { value: "Asia/Tokyo", text: "(GMT+09:00) Tokyo" },
        { value: "Asia/Yakutsk", text: "(GMT+09:00) Yakutsk" },
        { value: "Australia/Brisbane", text: "(GMT+10:00) Brisbane" },
        { value: "Australia/Melbourne", text: "(GMT+10:00) Canberra" },
        { value: "Pacific/Guam", text: "(GMT+10:00) Guam" },
        { value: "Australia/Hobart", text: "(GMT+10:00) Hobart" },
        { value: "Australia/Melbourne", text: "(GMT+10:00) Melbourne" },
        { value: "Pacific/Port_Moresby", text: "(GMT+10:00) Port Moresby" },
        { value: "Australia/Sydney", text: "(GMT+10:00) Sydney" },
        { value: "Asia/Vladivostok", text: "(GMT+10:00) Vladivostok" },
        { value: "Asia/Magadan", text: "(GMT+11:00) Magadan" },
        { value: "Pacific/Noumea", text: "(GMT+11:00) New Caledonia" },
        { value: "Pacific/Guadalcanal", text: "(GMT+11:00) Solomon Is." },
        { value: "Asia/Srednekolymsk", text: "(GMT+11:00) Srednekolymsk" },
        { value: "Pacific/Auckland", text: "(GMT+12:00) Auckland" },
        { value: "Pacific/Fiji", text: "(GMT+12:00) Fiji" },
        { value: "Asia/Kamchatka", text: "(GMT+12:00) Kamchatka" },
        { value: "Pacific/Majuro", text: "(GMT+12:00) Marshall Is." },
        { value: "Pacific/Auckland", text: "(GMT+12:00) Wellington" },
        { value: "Pacific/Tongatapu", text: "(GMT+13:00) Nuku'alofa" },
        { value: "Pacific/Apia", text: "(GMT+13:00) Samoa" },
        { value: "Pacific/Fakaofo", text: "(GMT+13:00) Tokelau Is." },
      ]
    },
    openCameraUpdate() {
      this.dialog = !this.dialog
    },
    onSelectVendor(data) {
      console.log(data)
      this.loadModels(data)
    },
    onSelectModel(data) {
      this.snapshot_url = data.jpg_url
      this.rtsp_url = data.h264_url
    },
    async updateCamera() {
      let data = {
        name: this.camera.name,
        vendor: this.selectedVendor.id,
        model: this.selectedModel.id,
        cam_username: this.camera.cam_username,
        cam_password: this.camera.cam_password,
        jpg_url: this.snapshot_url,
        h264_url: this.rtsp_url,
        external_host: this.camera.external.host,
        external_http_port: this.camera.external.http.port,
        nvr_http_port: this.camera.external.http.nvr_port,
        external_rtsp_port: this.camera.external.rtsp.port,
        camera_timezone: this.selectedTimezone.value,
      }
      await this.$axios
        .$patch(`${process.env.API_URL}cameras/${this.camera.id}`, data)
        .then(function(response) {
          console.log("Settings updated successfully.")
        })
        .catch((jqXHR) => {
          console.log(jqXHR)
        })
      this.dialog = false
      this.cameras()
    },
    sortByKey(list, key) {
      return list.sort(function(a, b) {
        var x, y
        x = a[key]
        y = b[key]
        if (x < y) {
          return -1
        } else {
          if (x > y) {
            return 1
          } else {
            return 0
          }
        }
      })
    }
  }
}
</script>

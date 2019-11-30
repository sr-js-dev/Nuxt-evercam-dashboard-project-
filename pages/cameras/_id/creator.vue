<template>
  <v-layout class="pa-2" align-center justify-center>
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="snackbarTimeout"
      :top="true"
    >
      {{ snackbarText }}
      <v-btn dark text @click="snackbar = false">
        <v-icon>fas fa-times</v-icon>
      </v-btn>
    </v-snackbar>
    <div class="custom-loading" v-if="isLoading">
      <v-progress-circular
        :size="80"
        :width="7"
        color="primary"
        indeterminate
        class="spin-loading"
      />
    </div>
    <v-row style="height: 100%;width: 100%">
      <v-col cols="12" class="pt-0 pb-0" style="padding-left: 150px; padding-right: 150px">
        <v-row style="max-widht: 100%">
          <v-col cols="12" class="pb-0 stage-container">
            <vue-ctk-date-time-picker
              v-model="from_datetime2"
              class="datetime-picker pa-4"
              format="YYYY-MM-DD HH:mm"
              button-color="#68a2d5"
              color="#68a2d5"
              :disabled-dates="from_disabled_days"
              :disabled-hours="from_disabled_hours"
              :no-value-to-custom-elem="true"
              @validate="changeDate"
              no-button-now
              no-shortcuts
              no-header
              no-label
            >
              <v-btn color="primary">
                <v-icon>fas fa-calendar-alt</v-icon>&nbsp; First frame
              </v-btn>
            </vue-ctk-date-time-picker>
            <vue-ctk-date-time-picker
              v-model="to_datetime2"
              class="datetime-picker pa-4 float-right to_datetime2"
              format="YYYY-MM-DD HH:mm"
              button-color="#68a2d5"
              color="#68a2d5"
              :disabled-dates="to_disabled_days"
              :disabled-hours="to_disabled_hours"
              @validate="changeDate"
              no-button-now
              right
              :no-value-to-custom-elem="true"
              no-shortcuts
              no-header
              no-label
            >
              <v-btn color="primary" class="float-right">
                <v-icon>fas fa-calendar-alt</v-icon>&nbsp; Last frame
              </v-btn>
            </vue-ctk-date-time-picker>
            <v-stage ref="stage" :config="configKonva">
              <v-layer ref="layer">
                <v-image :config="configImage" />
              </v-layer>
              <v-layer ref="layer2">
                <v-image
                  @mousedown="handleStageMouseDown"
                  @dragstart="handleDragStart"
                  @dragend="handleDragEnd"
                  :config="configLogo"
                />
                <v-image
                  @mousedown="handleStageMouseDown"
                  @dragstart="handleDragStart"
                  @dragend="handleDragEnd"
                  :config="configWatermark"
                />
                <v-transformer :config="configTransformer" ref="transformer" />
              </v-layer>
            </v-stage>
          </v-col>
          <v-col cols="12" class="pt-0">
            <v-row class="pl-2 pr-1">
              <v-col
                cols="1.2"
                class="pr-1 pl-1"
                v-for="imageIndex in [0,1,2,3,4,5,6,7,8,9]"
                :key="imageIndex"
                @click="index = imageIndex; getSlides()">
                <img v-if="slides[imageIndex]" :src="slides[imageIndex]" :class="{highlight:imageIndex == index}" style="max-width: 100%" >
                <div
                  v-else
                  class="fill-height ma-0"
                  align="center"
                  justify="center"
                >
                  <v-progress-circular
                    :size="20"
                    :width="2"
                    color="primary"
                    indeterminate
                  />
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="5" class="pt-0">
            <ValidationProvider name="Title" rules="required">
              <v-text-field
                slot-scope="{ errors }"
                :error-messages="errors"
                label="Title"
                required
                v-model="title"
                type="text"/>
            </ValidationProvider>
          </v-col>
          <v-col cols="4" class="pt-0 float-right">
            <v-dialog
              v-model="dialog"
              width="500"
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  color="primary"
                  text
                  v-on="on"
                  class="float-right"
                >
                  <v-icon>fas fa-cogs</v-icon> &nbsp; Customize
                </v-btn>
              </template>

              <v-card>
                <v-card-text>
                  <v-tabs
                    slot="extension"
                    v-model="tabs"
                    class="elevation-2"
                    dark
                    :centered="true"
                    :grow="true"
                    :right="true"
                  >
                    <v-tab
                      v-for="item in ['Schedule', 'Advanced']"
                      :key="item"
                    >
                      {{ item }}
                    </v-tab>
                  </v-tabs>
                  <v-tabs-items v-model="tabs">
                    <v-tab-item>
                      <v-card flat tile height="699">
                        <v-card-text>
                          <v-row justify="space-around" no-gutters>
                            <v-col class="d-flex" cols="12" sm="12">
                              <v-select
                                v-model="schedule_type"
                                :items="op_schedule"
                                :item-value="op_schedule.value"
                                label="Restrict Hours Per Day"
                              />
                            </v-col>

                            <v-col class="d-flex" cols="12" sm="12">
                              <FullCalendar
                                ref="fullCalendar"
                                :plugins="plugins"
                                :axisFormat="axisFormat"
                                :defaultView="defaultView"
                                :allDaySlot="allDaySlot"
                                :slotDuration="slotDuration"
                                :columnFormat="columnFormat"
                                :columnHeaderFormat="columnHeaderFormat"
                                :defaultDate="defaultDate"
                                :dayNamesShort="dayNamesShort"
                                :eventLimit="eventLimit"
                                :eventOverlap="eventOverlap"
                                :eventColor="eventColor"
                                :firstDay="firstDay"
                                :height="height"
                                :selectHelper="selectHelper"
                                :selectable="selectable"
                                :timezone="timezone"
                                :header="header"
                                :editable="editable"
                                :events="events"
                                @select="selectCalendar"
                                @eventClick="clickCalendar"
                                @eventDrop="dropCalendar"
                                @eventResize="resizeCalendar"
                              />
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-tab-item>

                    <v-tab-item>
                      <v-card flat tile height="699">
                        <v-card-text>
                          <v-row justify="space-around" no-gutters>
                            <v-col class="d-flex" cols="12" sm="12">
                              <v-file-input v-model="watermark_logo" label="Logo" prepend-icon="mdi-camera" @change="addLogo" accept="image/*"/>
                            </v-col>

                            <v-col class="d-flex" cols="12" sm="12">
                              <v-select
                                v-model="format"
                                :items="op_format"
                                :item-value="op_format.value"
                                label="Format"
                              />
                            </v-col>

                            <v-col class="d-flex" cols="12" sm="12">
                              <v-select
                                v-model="duration"
                                :items="format == 'mp4' ? op_duration : op_duration_gif"
                                label="Duration"
                              />
                            </v-col>
                            <v-col class="d-flex" cols="12" sm="12">
                              <v-text-field
                                v-if="duration === '0'"
                                v-model="custom_duration"
                                label="Custom Duration"
                                type="number"
                              />
                              <span v-if="duration === '0'" class="strong font-weight-normal">
                                &nbsp;&nbsp;seconds, {{ custom_duration * 24 }} Frames
                                playing at 24 FPS.
                              </span>
                              <span
                                v-else
                                class="strong font-weight-normal"
                              >&nbsp;&nbsp;{{ duration * 24 }} Frames playing at 24 FPS.</span>
                              <span
                                v-if="headers"
                                class="strong font-weight-normal"
                              >&nbsp;&nbsp;(+ 4 seconds intro + 6 seconds outro)</span>
                            </v-col>

                            <v-col class="d-flex" cols="12" sm="12">
                              <v-select
                                v-model="rm_date"
                                :items="op_rm_date"
                                :item-value="op_rm_date.value"
                                label="Remove date"
                              />
                            </v-col>
                            <v-col class="d-flex" cols="10" sm="10" />

                            <v-col class="d-flex" cols="12" sm="12">
                              <v-checkbox v-model="watermark" label="Add watermark" @change="addWatermark" />
                            </v-col>

                            <v-col class="d-flex" cols="12" sm="12">
                              <v-checkbox v-model="headers" label="Add headers" />
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-tab-item>
                  </v-tabs-items>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <div class="flex-grow-1"></div>
                  <v-btn
                    color="primary"
                    text
                    @click="dialog = false"
                  >
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
          <v-col cols="3" class="pt-0 float-right">
            <v-btn width="100%" color="primary" dark @click="checkForm">Create Time-lapse</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-layout>
</template>

<style lang="scss" scoped>
.v-tabs-items {
  height: 90%;
}
.custom-loading {
  background-color: rgba(0, 0, 0, 0.7);
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
  top: 0;
}
.spin-loading {
  top: 50%;
  left: 50%;
}
.vue-slider {
  width: 100% !important;
}
.item {
  display: flex;
  align-items: center;
}
.item-name {
  font-size: 18px;
}
.item-domain {
  color: grey;
}
.logo {
  max-width: 60px;
  margin-right: 10px;
  border: 1px solid #eaecf0;
}

.cool-class {
  padding: 0px !important;
  width: 100%;
}
.menu-left {
  margin-right: 0px;
  width: 25%;
  height: calc(100vh - 55px);
  right: 0;
  position: fixed;
  z-index: 2;
  color: #2f353a;
  background: #fff;
}
.viewer-content {
  border: 1px solid #eaecf0;
}
.my-swiper {
  width: 100%;
  .swiper-slide {
    text-align: center;
    background-color: #eee;
    display: flex;
    align-items: center;
    height: 100%;
  }
  .swiper-pagination {
    > .swiper-pagination-bullet {
      background-color: red;
    }
  }
}
.highlight {
  border: 5px solid #1976d2;
}

.date-time-picker {
  z-index: 1 !important;
  position: absolute !important;
  padding: 15px !important;
  width: 265px;
}

.to_datetime2 {
  right: 5px;
}

.stage-container {
  position: relative;
  z-index: 0;
}
</style>

<script>
import moment from "moment";
import VueKonva from "vue-konva";
import "vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css";
import VueCtkDateTimePicker from "vue-ctk-date-time-picker";
import "fullcalendar/dist/fullcalendar.css";
import FullCalendar from '@fullcalendar/vue'
import { Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import momentPlugin from '@fullcalendar/moment';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { mapGetters } from "vuex"
import { Socket } from "phoenix-socket"
import { ValidationObserver, ValidationProvider, withValidation } from "vee-validate";

const width = window.innerWidth - 256 - 300;
const height = window.innerHeight - 272;

export default {
  name: "Timelapse",
  components: {
    swiper,
    swiperSlide,
    FullCalendar,
    VueCtkDateTimePicker,
    VueKonva,
    ValidationProvider,
    ValidationObserver
  },
  data: function() {
    return {
      dialog: false,
      index: 0,
      value: "",
      snackbarColor: "",
      snackbar: false,
      snackbarText: "",
      snackbarTimeout: 3000,
      schedule_type: "on_schedule",
      schedule: JSON.stringify({
        "Monday": ["08:00-18:00"],
        "Tuesday": ["08:00-18:00"],
        "Wednesday": ["08:00-18:00"],
        "Thursday": ["08:00-18:00"],
        "Friday": ["08:00-18:00"],
        "Saturday": [],
        "Sunday": []
      }),
      plugins: [ interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, momentPlugin],
      axisFormat: 'HH',
      defaultView: 'timeGridWeek',
      allDaySlot: false,
      slotDuration: '00:60:00',
      columnFormat: 'dddd',
      columnHeaderFormat: { weekday: 'short' },
      defaultDate: '1970-01-01',
      dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      eventLimit: true,
      eventOverlap: false,
      eventColor: '#458CC7',
      firstDay: 1,
      height: 'auto',
      selectHelper: true,
      selectable: true,
      timezone: 'UTC',
      header: {
        left: '',
        center: '',
        right: '',
      },
      editable: true,
      events: null,
      tabs: null,
      isLoading: true,
      from_disabled_days: [],
      to_disabled_days: [],
      from_disabled_hours: [],
      to_disabled_hours: [],
      slides: [],
      configKonva: {
        width: width,
        height: height,
        keepRatio: true
      },
      configLogo: {
        x: 20,
        y: 20,
        draggable: true,
        image: new Image(),
        name: "logo"
      },
      configWatermark: {
        x: width - 120,
        y: height - 120,
        width: 100,
        height: 100,
        draggable: true,
        image: new Image(),
        name: "watermark"
      },
      configImage: {
        x: 0,
        y: 0,
        height: height,
        width: width,
        draggable: false,
        image: new Image(),
        name: "image"
      },
      configTransformer: {
        keepRatio: true,
        enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
      },
      isDragging: false,
      from_datetime2: moment()
        .subtract(7, "days")
        .format("YYYY-MM-DD hh:mm"),
      to_datetime2: moment().format("YYYY-MM-DD hh:mm"),
      title: "",
      duration: "15",
      custom_duration: 3,
      format: "mp4",
      headers: false,
      watermark: false,
      watermark_logo: null,
      rm_date: false,
      op_rm_date: [{ text: "Yes", value: true }, { text: "No", value: false }],
      op_schedule: [
        { text: "Continuous", value: "continuous" },
        { text: "Working Hours", value: "working_hours" },
        { text: "Custom", value: "on_schedule" }
      ],
      op_duration: [
        { text: "15 sec", value: "15" },
        { text: "30 sec", value: "30" },
        { text: "45 sec", value: "45" },
        { text: "1 min", value: "60" },
        { text: "1 min 30 sec", value: "90" },
        { text: "2 min", value: "120" },
        { text: "2 min 30 sec", value: "150" },
        { text: "3 min", value: "180" },
        { text: "5 min", value: "300" },
        { text: "Custom", value: "0" }
      ],
      op_duration_gif: [
        { text: "3 sec", value: "3" },
        { text: "4 sec", value: "4" },
        { text: "5 sec", value: "5" }
      ],
      op_format: [{ text: "MP4", value: "mp4" }, { text: "GIF", value: "gif" }],
    };
  },
  watch: {
		$route() {
      if (this.channel) {
        this.channel.leave()
      }
    },
    schedule_type: function() {
      if (this.$refs.fullCalendar) {
        if (this.schedule_type === "continuous"){
        let schedule = {
          "Monday": ["00:00-23:59"],
          "Tuesday": ["00:00-23:59"],
          "Wednesday": ["00:00-23:59"],
          "Thursday": ["00:00-23:59"],
          "Friday": ["00:00-23:59"],
          "Saturday": ["00:00-23:59"],
          "Sunday": ["00:00-23:59"]
        }
        this.schedule = JSON.stringify(schedule);
        this.clearCalendar();
        this.renderEvents()
      } else if (this.schedule_type === "working_hours"){
        let schedule = {
          "Monday": ["08:00-18:00"],
          "Tuesday": ["08:00-18:00"],
          "Wednesday": ["08:00-18:00"],
          "Thursday": ["08:00-18:00"],
          "Friday": ["08:00-18:00"],
          "Saturday": [],
          "Sunday": []
        }
        this.schedule = JSON.stringify(schedule);
        this.clearCalendar();
        this.renderEvents()
      } else if (this.schedule_type === "on_schedule") {
        this.clearCalendar();
      }
      } else {
        this.schedule_type = "on_schedule"
      }
    },
    from_datetime2: function() {
      this.from_disabled_days = this.get_disable_dates(this.from_datetime2);
      this.from_disabled_hours = this.get_disable_hours(this.from_datetime2);
    },

    to_datetime2: function() {
      this.to_disabled_days = this.get_disable_dates(this.to_datetime2);
      this.to_disabled_hours = this.get_disable_hours(this.to_datetime2);
    }
  },

  computed: {
    ...mapGetters(["token"]),
    selected_camera: function() {
      return this.$store.state.cameras.find(
        o => o.id === this.$route.params.id
      );
    }
  },

  mounted() {
    this.title = this.selected_camera.name +
        " - " +
        moment(this.from_datetime2).format("YYYY-MM-DD HH:mm") +
        " - " +
        moment(this.to_datetime2).format("YYYY-MM-DD HH:mm") +
        " (" +
        this.format.toUpperCase() +
        " " +
        this.duration +
        " sec.)";
    this.from_disabled_days = this.get_disable_dates(this.from_datetime2);
    this.from_disabled_hours = this.get_disable_hours(this.from_datetime2);
    this.to_disabled_days = this.get_disable_dates(this.to_datetime2);
    this.to_disabled_hours = this.get_disable_hours(this.to_datetime2);
    if (this.channel) {
      this.channel.leave()
    }
		this.getSnapshots()
  },

  methods: {
    changeDate() {
      this.isLoading = true
      this.index = 0
      this.configImage.image = new Image()
      if (this.selected_camera.id) {
        this.slides = []
        if (this.channel) {
          this.channel.leave()
        }
        this.getSnapshots()
        this.to_disabled_days = this.get_disable_dates(this.to_datetime2);
        this.to_disabled_hours = this.get_disable_hours(this.to_datetime2);
        this.from_disabled_days = this.get_disable_dates(this.from_datetime2);
        this.from_disabled_hours = this.get_disable_hours(this.from_datetime2);
      }
    },
    selectCalendar(event) {
      let api = this.$refs.fullCalendar.getApi()
      api.addEvent(event)
      this.schedule = JSON.stringify(this.parseCalendar());
    },
    clickCalendar(event) {
      if (window.confirm("Are you sure you want to delete this event?")) {
        let api = this.$refs.fullCalendar.getApi()
        let findingID = null
        if (event.event.id === "") {
          findingID = event.el
        } else {
          findingID = event.event.id
        }
        let removeEvent = api.getEventById( findingID )
        removeEvent.remove()
      }
      this.schedule = JSON.stringify(this.parseCalendar())
    },
    dropCalendar(event) {
      this.schedule = JSON.stringify(this.parseCalendar())
    },
    resizeCalendar(event) {
      this.schedule = JSON.stringify(this.parseCalendar())
    },
		async getSnapshots() {
      let session_id = Math.random().toString(36).substring(7)
      let socket = new Socket(process.env.SOCKET_URL, {
        params: {
          token: this.token,
          ip: "1.1.1.1",
          source: "Timelapse render"
        }
      })
      socket.connect()
      let thumbnail_channel = socket.channel("timelapse:" + session_id , {})
      thumbnail_channel.join()

      thumbnail_channel.on("preview-thumbnail", data => {
        this.slides.push(data.image)
        if (!this.configImage.image.src) {
          this.getSlides();
        }
      })
      thumbnail_channel.push("get-thumbnail", {
				id: this.selected_camera.id,
				to: moment(this.to_datetime2).format(),
				from: moment(this.from_datetime2).format(),
        session_id: session_id
      })

			this.channel = thumbnail_channel
			
    },
    getSlides() {
      var img = new Image();
      img.src = this.slides[this.index];
      this.configImage.image = img;
      img.onload = () => {
        this.configKonva.height = img.height * width / img.width
        this.configImage.height = img.height * width / img.width
        this.$refs.stage.getStage().drawScene();
        this.isLoading = false;
      };
    },
    arrayDiff(a1, a2) {
      var o1 = {},
        o2 = {},
        diff = [],
        i,
        len,
        k;
      for (i = 0, len = a1.length; i < len; i++) {
        o1[a1[i]] = true;
      }
      for (i = 0, len = a2.length; i < len; i++) {
        o2[a2[i]] = true;
      }
      for (k in o1) {
        if (!(k in o2)) {
          diff.push(k);
        }
      }
      for (k in o2) {
        if (!(k in o1)) {
          diff.push(k);
        }
      }
      return diff;
    },

    get_disable_dates(date) {
      let last_day = moment(date)
        .endOf("month")
        .format("DD");
      let year = moment(date).format("YYYY");
      let month = moment(date).format("MM");

      let month_all_days = [];
      for (let i = 1; i <= last_day; i++) {
        month_all_days.push(i);
      }

      let availible_days;
      let disabled_days_value = [];
      this.$axios
        .$get(
          process.env.API_URL +
            "cameras/" +
            this.selected_camera.id +
            "/recordings/snapshots/" +
            year +
            "/" +
            month +
            "/days"
        )
        .then(response => {
          availible_days = response.days;
          let days_diff = this.arrayDiff(month_all_days, availible_days);
          days_diff.forEach(function(day) {
            let month_val = ("0" + month).slice(-2);
            let day_val = ("0" + day).slice(-2);
            let complete_date = year + "-" + month_val + "-" + day_val;
            disabled_days_value.push(complete_date);
          });
        });
      return disabled_days_value;
    },

    get_disable_hours(date) {
      let first_day = moment(date).format("DD");
      let year = moment(date).format("YYYY");
      let month = moment(date).format("MM");

      let availible_hours;
      let disabled_hours_value = [];
      this.$axios
        .$get(
          process.env.API_URL +
            "cameras/" +
            this.selected_camera.id +
            "/recordings/snapshots/" +
            year +
            "/" +
            month +
            "/" +
            first_day +
            "/hours"
        )
        .then(response => {
          availible_hours = response.hours;
          for (let i = 0; i <= 23; i++) {
            if (!availible_hours.includes(i)) {
              let hour_val = ("0" + i).slice(-2);
              disabled_hours_value.push(hour_val);
            }
          }
        });
      return disabled_hours_value;
    },

    clearCalendar () {
      let api = this.$refs.fullCalendar.getApi()
      let events = api.getEvents()
      events.forEach((event) => {
        event.remove();
      });
    },

    renderEvents() {
      let api = this.$refs.fullCalendar.getApi()
      let schedule = JSON.parse(this.schedule)
      let calendarWeek = this.currentCalendarWeek()
      let days = Object.keys(schedule)
      days.forEach((weekDay) => {
        let day  = schedule[weekDay]
        if (day.length != 0) {
          day.forEach((event) => {
            let start = event.split("-")[0]
            let end = event.split("-")[1]
            let addEvent = {
              id: this.generate_random_string(4),
              start: moment(`${calendarWeek[weekDay]} ${start}`, "YYYY-MM-DD HH:mm")._i,
              end: moment(`${calendarWeek[weekDay]} ${end}`, "YYYY-MM-DD HH:mm")._i
            }
            api.addEvent(addEvent);
          });
        }
      });
    },

    currentCalendarWeek() {
      let calendarWeek = {}
      let weekStart = moment(this.$refs.fullCalendar.getApi().view.currentStart)
      let weekEnd = moment(this.$refs.fullCalendar.getApi().view.currentEnd)
      while (weekStart.isBefore(weekEnd)) {
        let weekDay = weekStart.format("dddd")
        calendarWeek[weekDay] = weekStart.format('YYYY-MM-DD')
        weekStart.add(1, "days")
      }
      return calendarWeek;
    },

    generate_random_string(string_length) {
      let random_string = '';
      let random_ascii;
      for(let i = 0; i < string_length; i++) {
          random_ascii = Math.floor((Math.random() * 25) + 97);
          random_string += String.fromCharCode(random_ascii)
      }
      return random_string
    },

    checkForm() {
      if (moment(this.to_datetime2).isBefore(this.from_datetime2) || moment(this.to_datetime2).isSame(this.from_datetime2)) {
        this.snackbarColor = "error"
        this.snackbarText = "Sorry, we can not process your request"
        this.snackbar = true
      } else {
        let formData = new FormData();
        let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        formData.append("camera", this.selected_camera.id);
        formData.append("from_datetime", moment(this.from_datetime2).format());
        formData.append("to_datetime", moment(this.to_datetime2).format());
        formData.append("title", this.title);
        formData.append("analyze", this.analyze);
        formData.append("headers", this.headers);
        formData.append("watermark", this.watermark);
        formData.append("schedule", this.schedule);
        formData.append("format", this.format);
        formData.append("rm_date", this.rm_date);
        formData.append("timezone", timezone);
        
        if (this.duration === "0") {
          formData.append("duration", this.custom_duration);
        } else {
          formData.append("duration", this.duration);
        }
        if (this.watermark_logo) {
          formData.append("watermark_position", this.watermark_position);
          formData.append("watermark_logo", this.watermark_logo);
        }

        this.$axios
          .$post(process.env.API_URL + "timelapse", formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then(() => {
            this.snackbarColor = "success"
            this.snackbarText = "Your request has been processed. We are preparing your time-lapse"
            this.snackbar = true
          })
          .catch(() => {
            this.snackbarColor = "error"
            this.snackbarText = "Sorry, we can not process your request"
            this.snackbar = true
          });
      }
    },

    parseCalendar() {
      var events = this.$refs.fullCalendar.getApi().getEvents()
      var schedule = {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
      };
      events.map(function(event) {
        var days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ];
        var startTime = moment(event.start).get("hours");
        var endTime = moment(event.end).get("hours");
        var day = moment(event.start).get("day");
        schedule[days[day]] = schedule[days[day]].concat(
          startTime + "-" + endTime
        );
      });
      return schedule;
    },
    handleStageMouseDown(e) {
      if (e.target === e.target.getStage()) {
        this.selectedShapeName = "";
        this.updateTransformer();
        return;
      }

      const clickedOnTransformer =
        e.target.getParent().className === "Transformer";
      if (clickedOnTransformer) {
        return;
      }

      const name = e.target.name();
      const rect = this.configLogo;
      if (rect) {
        this.selectedShapeName = name;
      } else {
        this.selectedShapeName = "";
      }
      this.updateTransformer();
    },
    updateTransformer() {
      const transformerNode = this.$refs.transformer.getStage();
      const stage = transformerNode.getStage();
      const { selectedShapeName } = this;

      const selectedNode = stage.findOne("." + selectedShapeName);
      if (selectedNode === transformerNode.node()) {
        return;
      }

      if (selectedNode) {
        transformerNode.attachTo(selectedNode);
      } else {
        transformerNode.detach();
      }
      transformerNode.getLayer().batchDraw();
    },
    handleDragStart() {
      this.isDragging = true;
    },
    handleDragEnd() {
      this.isDragging = false;
    },
    addWatermark() {
      if (this.watermark) {
        let watermark_image = new Image();
        watermark_image.src = require("~/static/watermark.png");
        watermark_image.onload = () => {
          this.configWatermark.image = watermark_image;
        };
      } else {
        this.configWatermark.image = new Image();
      }
    },
    addLogo() {
      if (this.watermark_logo) {
        let reader = new FileReader();
        reader.onload = () => {
          let dataURL = reader.result;
          let logo = new Image()
          logo.src = dataURL
          logo.onload = () => {
            this.configLogo.image = logo;
          }
        };
        reader.readAsDataURL(this.watermark_logo);
      } else {
        this.configLogo.image = new Image();
      }
    }
  }
};
</script>

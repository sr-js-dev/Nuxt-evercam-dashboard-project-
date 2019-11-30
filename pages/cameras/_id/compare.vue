<template>
  <div>
    <v-layout>
      <VueCompareImage
        :left-image="require('~/static/favicon.png')"
        :right-image="require('~/static/favicon.png')"
      />
      <DatePicker />
    </v-layout>
  </div>
</template>

<script>
import VueCompareImage from "vue-compare-image"
import DatePicker from "~/components/date_picker.vue"

export default {
  components: {
    VueCompareImage,
    DatePicker
  }
}
</script>

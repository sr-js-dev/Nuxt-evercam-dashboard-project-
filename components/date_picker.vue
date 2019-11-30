<template>
  <div>
    <span class="timer" data-from="25" data-to="75" />
    <div class="inner" />
    <p>Date: <input id="datepicker" type="text" ></p>
  </div>
</template>

<script>
import $ from "jquery"
import "jquery-ui/ui/widgets/datepicker"
import "jquery-ui/themes/base/datepicker.css"
import "jquery-ui/themes/base/theme.css"

export default {
  name: "DatePicker",
  mounted() {
    //do something after mounting vue instance
    //$(".timer").countTo()
    $(".inner").append("<h2>Compare component</h2>")
    $("#datepicker").datepicker()
  }
}
</script>

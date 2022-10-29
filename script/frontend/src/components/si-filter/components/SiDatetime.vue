<template>
  <div>
    <div>
      <label for class="vs-input--label">{{label}}</label>
    </div>
    <flat-pickr
      :config="configdateTimePicker"
      @input="onInput"
      v-model="newValue"
      :placeholder="options.hint"
      :class="options.inputclass"
      :type="options.inputType"
      :label="options.label"
      :icon-pack="options.iconPack"
      :icon="options.icon"
      :icon-after="options.iconAfter"
      :required="validate.required"
    />
  </div>
</template>

<script>
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";

export default {
  data() {
    return {
      newValue: Date.now("d-m-Y H:i"),
      configdateTimePicker: {
        enableTime: true,
        dateFormat: "d-m-Y H:i"
      }
    };
  },
  props: {

    options:{required:true},
    value: String,
    values: String,
    validate: { type: String, default: "" },
  },
  components: {
    flatPickr
  },
  methods: {
    onInput() {
      this.$emit("onInput", this.newValue);
    }
  }
};
</script>
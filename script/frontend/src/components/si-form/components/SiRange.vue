<template>
  <div>
    <label>{{label}}</label>
    <div v-if="options.multiple">
      <vs-slider
        :icon="options.icon"
        onclick="return false;"
        :min="values[0]"
        :max="values[1]"
        :step="options.step"
        :ticks="options.ticks"
        @change="onInputMultiple"
        :text-fixed="options.textFixed"
        v-model="twoValue"
      />
    </div>
    <div v-else-if="!options.multiple">
      <vs-slider
        :icon="options.icon"
        onclick="return false;"
        :min="values[0]"
        :max="values[1]"
        :step="options.step"
        :ticks="options.ticks"
        :text-fixed="options.textFixed"
        @change="onInput"
        v-model="newValue"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "si-input",
  props: {
    options:{required:true},
    value: "",
    values: Array,
    validate: { type: String, default: "" },
  },
  data() {
    return {
      newValue: this.value,
      twoValue: [this.value[0], this.value[1]]
    };
  },
  methods: {
    onInput() {
      this.$emit("onInput", this.newValue);
    },
    onInputMultiple() {
      this.$emit("onInput", this.twoValue);
    }
  }
};
</script>

<style>
</style>
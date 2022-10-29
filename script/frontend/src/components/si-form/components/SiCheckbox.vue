<template>
  <div>
    <div v-if="options.inputType=='checkbox'">
      <label>{{options.checkboxlabel.top}}</label>
      <vs-checkbox
        :class="options.inputclass"
        :required="validate.required"
        @change="onInput"
        v-model="newValue"
      >{{options.checkboxlabel.horizontal}}</vs-checkbox>
    </div>
    <div v-if="options.inputType=='switch'">
      <label>{{label}}</label>
      <vs-switch :label="options.label" :required="validate.required" @change="onInput" v-model="newValue" />
    </div>
  </div>
</template>

<script>
export default {
  name: "Si-checkbox",
  props: {
    options:{required:true},
    value: "",
    values: String,
    validate: { type: String, default: "" },
  },
  data() {
    return {
      newValue: this.value
    };
  },
  methods: {
    onInput() {
      this.$emit("onInput", this.newValue);
    }
  }
};
</script>

<style scoped>
</style>
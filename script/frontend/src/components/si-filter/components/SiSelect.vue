<template>
  <div>
    <!--Start multiple select -->
    <div v-if="options.inputType=='select'">
      <label for="selectCmp" class="vs-select--label">{{ options.label | t }}</label>
      <v-select id="selectCmp" 
        :multiple="options.multiple" label="name" :clearable="options.clearable" :placeholder="options.hint | t" :options="values" @input="onChange" class="w-full"
        v-model="newValue" :reduce="opt => opt.id">
      </v-select>
    </div>
    <!--end multiple select -->
  </div>
</template>
<script>
  import vSelect from "vue-select";
  export default {
    name: "si-select",
    components: {
      "v-select": vSelect
    },
    props: {
      options:{required:true},
      value: [String, Boolean, Array],
      values: Array,
      validate: { type: String, default: "" },
    },
    data() {
      return {
        newValue: this.value
      };
    },
    mounted() {
      if (!this.newValue && this.values && this.values[0]) {
        this.newValue = this.values[0].value;
        this.onInput();
      }
    },
    methods: {
      onInput() {
        this.$emit("onInput", this.newValue);
      },
      onChange() {
        this.$emit("onInput", this.newValue);
      }
    }
  };
</script>
<style>
  .con-select{
    width: 100% !important;
  }
</style>
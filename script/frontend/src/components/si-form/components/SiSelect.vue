<template>
  <div>
    <div v-if="options.inputType=='select'">
      <vs-select :class="options.inputclass" :label="options.label" :icon-pack="options.iconPack" :icon="options.icon" :icon-after="options.iconAfter"
        :required="validate.required" @change="onInput" v-model="newValue">
        <vs-select-item v-for="(item,key) in values" :key="key" :value="item.value" :text="item.text" />
      </vs-select>
    </div>
    <!--Start input type range -->
    <div v-if="options.inputType == 'radio'">
      <label>{{label}}</label>
      <div>
        <vs-radio v-for="(item,key) in values" :key="key" :class="options.inputclass" :required="validate.required"
          @change="onInput" :vs-value="item.value" v-model="newValue">{{item.text}}</vs-radio>
      </div>
    </div>
    <!--end input type range -->
    <!--Start multiple select -->
    <div v-if="options.inputType=='multipleselect'">
      <label for="collections" class="vs-select--label">{{ label }}</label>
      <v-select id="collections" taggable :icon-pack="options.iconPack" :icon="options.icon" :push-tags="options.pushTags" push-collections
        :multiple="options.multiple" label="name" code="_id" :options="values" @input="onChange" class="w-full"
        v-model="newValue"></v-select>
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
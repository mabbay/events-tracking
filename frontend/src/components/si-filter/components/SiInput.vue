<template>
  <div id="filterInput">
    <vs-input :class="options.inputclass" :type="options.inputType" :label="options.label | t" :icon-pack="options.iconPack" :icon="options.icon"
        :icon-after="options.iconAfter" :required="validate.required" :placeholder="options.hint | t" v-model="newValue" />
  </div>
</template>
<script>
  export default {
    name: "si-input",
    props: {
      options:{required:true},
      value: String,
      values: Array,
      validate: { type: String, default: "" }
    },
    data() {
      return {
        newValue: this.value
      };
    },
    watch: {
      newValue: function (val) {
          this.$emit('onInput',val);
      },
    },
  };
</script>
<style >
  #filterInput .vs-input--icon{
        top: auto !important;
  }
  .styleinputcolor {
    width: 0;
    height: 0;
    display: block;
    visibility: hidden;
  }

  .stylelabelcolor {
    border: 1px solid #cccccc;
    width: 100%;
    display: block;
    padding: 5px;
    border-radius: 5px;
  }

  .icon-color {
    /* display: block; */
    margin: 2px;
    color: #cccccc;
    /* background-color: blue; */
  }

  .line {
    border-left: 1px solid #cccccc;
    margin-left: 8px;
    /* margin-bottom: 12px; */
    height: 20px;
  }
</style>
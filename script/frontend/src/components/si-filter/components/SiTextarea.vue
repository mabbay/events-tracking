<template>
  <vs-textarea
    :class="options.inputclass"
    :type="options.inputType"
    :label="options.label"
    :icon-pack="options.iconPack"
    :icon="options.icon"
    :icon-after="options.iconAfter"
    :required="validate.required"
    :placeholder="options.hint"
    v-model="newValue"
  />
</template>
<script>
export default {
  name: "si-textarea",
  props: {
    options:{required:true},
    value: String,
    values: Array,
    validate: { type: String, default: "" },
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
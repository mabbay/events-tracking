<template>
  <div>
    <label for class="vs-input--label">{{label}}</label>
    <quill-editor
      :class="options.inputclass"
      :type="options.inputType"
      :label="options.label"
      :icon-pack="options.iconPack"
      :icon="options.icon"
      :icon-after="options.iconAfter"
      :required="validate.required"
      :placeholder="options.hint"
      @input="onInput"
      v-model="newValue"
    />
  </div>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  name: "si-text-editor",
  props: {

    options:{required:true},
    value: String,
    validate: { type: String, default: "" },
  },
  data() {
    return {
      newValue: this.value
    };
  },
  components: {
    quillEditor
  },
  methods: {
    onInput() {
      this.$emit("onInput", this.newValue);
    }
  }
};
</script>   
<template>
  <div class="mb-3" :class="element.options.groupClass">

    <div class="vx-row" v-if="inputStyle == 'horizontal'">
      <div class="vx-col sm:w-1/3 w-full">
        <span>{{ element.label }}</span>
      </div>
      <div class="vx-col sm:w-2/3 w-full">
        <component
          @onInput="onInput"
          :options="element.options"
          :value="element.value"
          v-model="element.value"
          :values="element.values"
          :is="`si-${element.type}`"
        ></component>
      </div>
    </div>
    <vx-input-group v-else>
      <template v-if="inputStyle == 'prepend'" slot="prepend">
        <div class="prepend-text bg-primary">
          <span>{{ element.label }}</span>
        </div>
      </template>
      <component
        @onInput="onInput"
        :options="element.options"
        :value="element.value"
        v-model="element.value"
        :values="element.values"
        :is="`si-${element.type}`"
      ></component>
    </vx-input-group>
    <span class="text-danger text-sm" v-show="element.validate.error">{{ element.validate.error }}</span>
  </div>
</template>
<script>
import SiInput from "./SiInput";
import SiSelect from "./SiSelect";
import SiCheckbox from "./SiCheckbox";
import SiTextarea from "./SiTextarea";
import SiTextEditor from "./SiTextEditor";
import SiDatetime from "./SiDatetime";
import SiRange from "./SiRange";
import SiStartEndDate from "./SiStartEndDate";

export default {
  name: "si-from-group",
  components: {
    SiInput,
    SiSelect,
    SiCheckbox,
    SiTextarea,
    SiTextEditor,
    SiDatetime,
    SiRange,
    SiStartEndDate
  },
  props: {
    inputStyle:{required:true},
    field:{required:true},
    element: { type: Object, required: true }
  },
  methods: {
    onInput(value) {
      this.$emit("onChange", this.field, value);
    }
  }
};
</script>
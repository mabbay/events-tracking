<template>
  <div @click="clicked">
    <vx-tooltip v-if="config.tooltip" :text="config.tooltip">
      <feather-icon
        :icon="config.icon"
        :svgClasses="['h-4 w-4', config.style]"
      />
    </vx-tooltip>
    <feather-icon
      v-else
      :icon="config.icon"
      :svgClasses="['h-4 w-4', config.style]"
    />
  </div>
</template>
<script>
export default {
  props: {
    dataField: { required: true },
    options: { required: false },
  },
  data() {
    return {};
  },
  computed: {
    config: {
      get() {
        if (typeof this.options == "object") return this.options;
        else if (typeof this.options == "function")
          return this.options(this.dataField.item);
      },
      set() {},
    },
  },
  mounted() {
    // this.init();
  },
  methods: {
    init() {
      if (typeof this.options == "object") this.config = this.options;
      else if (typeof this.options == "function")
        this.config = this.options(this.dataField);
    },
    generateIconClass(color) {
      return `text-${color}`;
    },
    clicked() {
      console.log("clicked", this.dataField.item.trackId);
      // this.$emit("copyClicked", this.dataField.item.trackId);
      let input = document.createElement("input");
      input.setAttribute("type", "text");
      input.setAttribute(
        "value",
        `data-track-id="${this.dataField.item.trackId}"`
      );
      document.getElementsByTagName("body")[0].appendChild(input);
      input.select();
      document.execCommand("copy");
      console.log(input.value);
      //   input.setAttribute("type", "hidden");
      document.getElementsByTagName("body")[0].removeChild(input);
      this.$vs.notify({
        title: this.$t("success"),
        text: this.$t("copied successfuly"),
        color: "success",
        position: "bottom-center",
        iconPack: "feather",
        icon: "icon-check",
      });
    },
  },
};
</script>
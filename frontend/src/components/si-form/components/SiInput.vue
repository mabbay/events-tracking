<template>
  <div>
    <div v-if="options.inputType=='color'">
      <label class="vs-input--label">{{label}}</label>
      <div>
        <label class="stylelabelcolor" :style="'background:'+newValue" for="color">
          <div class="icon-color">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="15" height="15" viewBox="0 0 172 172"
              style=" fill:#000000;">
              <g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt"
                stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray stroke-dashoffset="0" font-family="none"
                font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal">
                <path d="M0,172v-172h172v172z" fill="none" />
                <g>
                  <g>
                    <path d="M85.5,0c0,0 -55.5,86 -55.5,116.2161c0.06357,30.82737 24.89316,55.78397 55.5,55.7839z"
                      fill="#cccccc" />
                    <path d="M85.5,0c0,0 55.5,86 55.5,116.2161c-0.06357,30.82737 -24.89316,55.78397 -55.5,55.7839z"
                      fill="#546e7a" />
                  </g>
                </g>
              </g>
            </svg>
            <label class="line"></label>
          </div>
        </label>
        <input id="color" :class="options.inputclass + ' styleinputcolor'" :type="options.inputType" :label="options.label"
          :icon-pack="options.iconPack" :icon="options.icon" :icon-after="options.iconAfter" :required="validate.required" :placeholder="options.hint"
          v-model="newValue" />
      </div>
    </div>
    <div v-else>
      <vs-input :class="options.inputclass" :type="options.inputType" :label="options.label" :icon-pack="options.iconPack" :icon="options.icon"
        :icon-after="options.iconAfter" :required="validate.required" :placeholder="options.hint" v-model="newValue" />
    </div>
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
<style scoped>
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
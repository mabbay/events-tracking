<template>
  <div id="supp_form">
    <si-progress-bar v-if="loading.page" />
    <div v-if="!loading.page" class="container">
      <div class="vx-row">
        <div class="vx-col m-0 w-full mb-base">
          <vx-card>
            <div class="flex flex-wrap w-full">
              <div class="flex flex-wrap w-full">
              <!-- website -->
                <div class="md:w-1/2 mb-3 p-0 md:p-1 w-full">
                  <vs-select label="Element Website" v-model="element.website">
                    <vs-select-item
                      v-for="website in websites"
                      :key="website._id"
                      :value="website._id"
                      :text="website.domain"
                    />
                  </vs-select>
                  <small class="text-danger">{{ errors.website }}</small>
                </div>
                <!-- label -->
                <div class="md:w-1/2 mb-3 p-0 md:p-1 w-full">
                  <vs-input
                    v-model="element.label"
                    :label="'Element Label' | t"
                    :placeholder="'label of the new element' | t"
                    class="w-full"
                  />
                  <small class="text-danger">{{ errors.label }}</small>
                </div>
                <!-- select an element -->
                <div class="w-full mb-2">
                  <p>
                    Select Element <br />
                    (this option will launch your website so you can select an
                    element by clicking on it).
                  </p>
                  <div class="flex flex-row items-center space-x-5">
                    <vs-button
                      @click="onSelectElement"
                      :disabled="!this.element.website"
                      >select element</vs-button
                    >
                    <p v-if="!!this.element.path">
                      path to the selected element:
                      <span class="font-semibold">{{ this.element.path }}</span>
                    </p>
                    <small class="text-danger">{{ errors.path }}</small>
                  </div>
                </div>
                <div class="mb-3 p-0 md:p-1 w-full">
                  <p>{{ "Events" | t }}</p>
                  <!-- events -->
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <vs-checkbox
                      v-for="event in events"
                      :key="event"
                      v-model="element.events"
                      :vs-value="event"
                      >{{ event }}</vs-checkbox
                    >
                  </div>
                </div>
              </div>
            </div>
          </vx-card>
        </div>
      </div>
    </div>
    <!-- actions -->
    <si-form-bar v-if="!loading.page">
      <template v-slot:content>
        <div class="flex flex-nowrap justify-between items-center">
          <h5 class="text-secondary">{{ "save_change" | t }}</h5>
          <vs-button
            :disabled="loading.page"
            color="primary"
            type="filled"
            @click="onSubmit"
          >
            {{ "confirm" | t }}
          </vs-button>
        </div>
      </template>
    </si-form-bar>
    <!-- {{ element }} -->
  </div>
</template>

<script>
import events from "./events";

export default {
  props: {
    // received when updating an element
    elementId: { type: String, required: false },
  },
  data() {
    return {
      element: {
        label: null,
        website: null,
        events: [],
        path: null,
      },
      events: events,
      loading: {
        page: true,
        submit: false,
      },
      errors: {}, // validation errors
      trackAttrCopied: false,
      selectionWindow: null,
    };
  },
  computed: {
    websites() {
      return this.$store.getters["websites/list"];
    },
    isUpdate() {
      return !!this.elementId;
    },
    trackAttr() {
      return `data-track-id="${this.element.trackId}"`;
    },
  },
  watch: {
    "element.label": function () {
      this.validateLabel();
    },
    "element.website": function () {
      this.validateWebsite();
    },
    "element.path": function () {
      this.validatePath();
    },
  },
  created() {
    this.init();
  },
  mounted() {
    window.addEventListener("message", this.onMessage);
    // send source
  },
  beforeDestroy() {
    window.removeEventListener("message", this.onMessage);
  },
  methods: {
    async init() {
      try {
        this.loading.page = true;
        await this.$store.dispatch("websites/getAll");
        this.getElement();
      } catch (err) {
        console.log(err);
      } finally {
        this.loading.page = false;
      }
    },
    // get element in case of an update
    async getElement() {
      if (!this.elementId) return;
      try {
        const response = await this.$http.get("/api/elements/get", {
          params: { id: this.elementId },
        });
        this.element = response.data;
      } catch (err) {
        console.log(err);
        //TODO notify in case of an error
      }
    },
    async onSubmit() {
      if (!this.validate()) return; // if element data not valid return
      console.log("ele--sub", this.element);
      this.loading.submit = true;
      const url = this.elementId
        ? `/api/elements/update/?id=${this.elementId}`
        : `/api/elements/create`;
      // const action = this.elementId ? "elements/update" : "elements/create";
      // const payload = { body: this.element };
      // if (this.elementId) payload.id = this.elementId;
      try {
        const response = await this.$http.post(url, this.element); //!wtf
        // const response = await this.$store.dispatch(action, payload);
        console.log("ele-res", response);
        const sucessMess = this.elementId
          ? "updating successfuly"
          : "creating successfuly";
        this.$vs.notify({
          title: this.$t("success"),
          text: this.$t(sucessMess),
          color: "success",
          position: "bottom-center",
          iconPack: "feather",
          icon: "icon-check",
        });
        // navigate to update if we created an element
        if (!this.elementId)
          this.$router.push({
            name: "elements-update",
            params: { elementId: response.data._id },
          });
      } catch (error) {
        console.log(error);
        let message_error = this.elementId
          ? "error_updating"
          : "error_creating";
        if (typeof error.response.data.errors == "object") {
          let errors = error.response.data.errors;
          let key = Object.keys(errors)[0];
          message_error = `${key}_${errors[key]}`;
        }
        this.$vs.notify({
          title: this.$t("error"),
          text: this.$t(message_error),
          color: "danger",
          position: "bottom-center",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
      } finally {
        this.loading.submit = false;
      }
    },
    // validate inserted data before creating/updating
    validate() {
      this.errors = {};
      this.validateLabel();
      this.validateWebsite();
      this.validatePath();
      console.log("keys", Object.keys(this.errors).length);
      return Object.keys(this.errors).length === 0; // true: data valid, false: data not valid
    },
    validateWebsite() {
      delete this.errors.website;
      if (!this.element.website || this.element.website === "") {
        this.errors.website = "website is required";
      }
    },
    validateLabel() {
      delete this.errors.label;
      if (!this.element.label || this.element.label === "") {
        this.errors.label = "label is required";
      }
    },
    validatePath() {
      delete this.errors.path;
      if (!this.element.path || this.element.path === "") {
        this.errors.path = "you need to select an element";
      }
    },
    copyTrackAttr() {
      const trackAttr = this.$refs.trackAttr;
      trackAttr.setAttribute("type", "text");
      trackAttr.select();
      document.execCommand("copy");
      trackAttr.setAttribute("type", "hidden");
      this.trackAttrCopied = true;
      setTimeout(() => {
        this.trackAttrCopied = false;
      }, 2000);
    },
    // open the selected website
    onSelectElement() {
      // get the domain of the selected website
      const { domain } = this.websites.find(w => w._id === this.element.website);
      console.log('--domain', domain);
      const newWin = window.open(
        `http://${domain}?x-selection-mode=true`,
        "selection-window"
      );
      this.selectionWindow = newWin;
      setInterval(this.sendTargetWindow, 1000);
    },
    onMessage(e) {
      if (typeof e.data !== "string") return;
      const data = JSON.parse(e.data);
      console.log("--data", data);
      if (data.path) {
        // an element is clicked
        this.element.path = data.path;
        e.source.close();
      } 
      // else if (data.url) {
      //   // a url is clicked
      //   setIn(this.sendTargetWindow, 1000);
      // }
    },
    // inform the opened window (where the user's website is displayed) about the target window
    sendTargetWindow() {
      this.selectionWindow.postMessage(JSON.stringify({ target: true }), "*");
    },
  },
};
</script>
<style>
#supp_form .style-chooser .vs__dropdown-menu {
  max-height: 120px !important;
  overflow-x: hidden;
  text-overflow: ellipsis;
  /* white-space: normal; */
}
#supp_form .style-chooser .vs__selected-options {
  overflow-x: hidden;
}
#supp_form .style-chooser .vs__selected {
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
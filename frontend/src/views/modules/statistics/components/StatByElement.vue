<template>
  <div id="div-with-loading">
    <vx-card>
      <div
        class="
          grid grid-cols-1
          md:grid-cols-2
          content-center
          items-center
          gap-5
        "
      >
        <!-- website -->
        <div>
          <vs-select label="Websites" v-model="selected.websiteId">
            <vs-select-item
              v-for="website in websites"
              :key="website._id"
              :value="website._id"
              :text="website.domain"
            />
          </vs-select>
        </div>
        <!-- elements -->
        <div v-if="!!selected.websiteId">
          <vs-select
            label="Elements"
            v-model="selected.elementId"
            :autocomplete="true"
          >
            <vs-select-item
              v-for="element in eles"
              :key="element._id"
              :value="element._id"
              :text="element.label"
            />
          </vs-select>
        </div>
        <!-- events -->
        <div v-if="!!selected.elementId">
          <vs-select
            label="Event"
            v-model="selected.events"
            :max-selected="maxSelectedEvents"
            multiple
          >
            <vs-select-item
              v-for="(event, index) in eventsList"
              :key="index"
              :value="event"
              :text="event"
            />
          </vs-select>
        </div>
        <!--time -->
        <div v-if="!!selected.events.length">
          <vs-select label="Time" v-model="selected.timeOption">
            <vs-select-item
              v-for="(timeOption, index) in timeOptions"
              :key="index"
              :value="timeOption"
              :text="timeOption"
            />
          </vs-select>
        </div>
        <!-- show statistics -->
        <div v-show="!!selected.events.length">
          <vs-button @click="showStat">Show Statistics</vs-button>
        </div>
      </div>
    </vx-card>
    <!-- bar chart -->
    <vx-card class="mt-4" v-if="!!tracking.data">
      <stat-by-ele-chart
        :trackingData="tracking.data"
        :timeOption="selected.timeOption"
        :from="tracking.from"
        :to="tracking.to"
        :element="selectedElement"
        :events="selectedEvents"
        :colors="colors"
      />
    </vx-card>
    <!-- totals table -->
    <vx-card class="mt-4" v-if="dataExists">
      <stat-by-ele-total
        :data="tracking.data"
        :element="selectedElement"
        :events="selectedEvents"
        :colors="colors"
        :timeOption="selected.timeOption"
      />
    </vx-card>
    <!-- per-page data -->
    <vx-card class="mt-4" v-if="dataExists">
      <stat-by-ele-page
        :trackingData="tracking.data"
        :element="selectedElement"
        :events="selectedEvents"
        :colors="colors"
        :timeOption="selected.timeOption"
        :to="tracking.to"
        :from="tracking.from"
      />
    </vx-card>
  </div>
</template>
<script>
import colorsList from "./colors";
import VxCard from "@/components/vx-card/VxCard.vue";
import StatByEleChart from "./StatByEleChart.vue";
import StatByEleTotal from "./StatByEleTotal.vue";
import StatByElePage from "./StatByElePage.vue";


export default {
  components: { VxCard, StatByEleChart, StatByEleTotal, StatByElePage },
  data: () => ({
    selected: {
      websiteId: null, // id of the selected website
      elementId: null, // id of the selected element
      events: [], // selected events
      timeOption: "today", // by default
    },
    websites: null, // websites list
    eles: null, // elements of the selected website
    // tracking.data is a map: event name => array of actions
    tracking: { data: null, from: null, to: null },
    loading: false,
    timeOptions: [
      "today",
      "yesterday",
      "this week",
      "last week",
      "this month",
      "last month",
      "this year",
      "last year",
    ],
  }),
  computed: {
    dataExists() {
      return this.tracking.data && this.tracking.data.size > 0;
    },
    selectedElement() {
      const index = this.eles.findIndex(
        (ele) => ele._id === this.selected.elementId
      );
      return this.eles[index];
    },
    eventsList() {
      const events = new Array(...this.selectedElement.events);
      if (events.length > 0) events.unshift("all events");
      return events;
    },
    selectedEvents() {
      if (this.selected.events.includes("all events"))
        return this.selectedElement.events;
      return this.selected.events;
    },
    maxSelectedEvents() {
      if (this.selected.events.includes("all events")) return 1;
      return 3;
    },
    updateSelectedElementLink() { //!
      return {
        name: "elements-update",
        params: { elementId: this.selected.elementId },
      };
    },
    colors() {
      const colors = new Map();
      this.selectedEvents.forEach((event, index) => {
        colors.set(event, colorsList[index % colorsList.length]);
      });
      return colors;
    },
  },
  watch: {
    loading(val) {
      if (val) {
        this.$vs.loading({
          container: "#div-with-loading",
          scale: 0.6,
        });
      } else {
        this.$vs.loading.close("#div-with-loading > .con-vs-loading");
      }
    },
    "selected.websiteId": function () {
      this.selected.elementId = null;
      this.selected.events = [];
      this.tracking.data = null;
      // get elements of the selected website
      if (this.selected.websiteId) this.getEles();
    },
    "selected.elementId": function () {
      this.selected.events = [];
    },
    "selected.events": function () {
      this.tracking.data = null;
      if (
        this.selected.events.includes("all events") &&
        this.selected.events.length > 1
      )
        this.selected.events = ["all events"];
    },
  },
  created() {
    this.getWebsites();
  },
  methods: {
    // convert selected timeOption to (from, to) dates
    toDates(timeOption) {
      let from, to;
      if (timeOption === "today") {
        from = to = this.$moment.utc();
      } else if (timeOption === "yesterday") {
        from = to = this.$moment.utc().hour(-24);
      } else if (timeOption === "this week") {
        from = this.$moment.utc().isoWeekday(1);
        to = this.$moment.utc();
      } else if (timeOption === "last week") {
        from = this.$moment().utc().isoWeekday(1).isoWeekday(-6);
        to = this.$moment(from).isoWeekday(7);
      } else if (timeOption === "this month") {
        from = this.$moment().utc().date(1);
        to = this.$moment().utc();
      } else if (timeOption === "last month") {
        to = this.$moment().utc().date(1).hour(-24);
        from = this.$moment(to).date(1);
      } else if (timeOption === "this year") {
        from = this.$moment().utc().dayOfYear(1);
        to = this.$moment().utc();
      } else if (timeOption === "last year") {
        to = this.$moment().utc().dayOfYear(1).hour(-24);
        from = this.$moment(to).dayOfYear(1);
      }
      from = from.format("YYYY-MM-DD");
      to = to.format("YYYY-MM-DD");

      return { from, to };
    },
    async getWebsites() {
      try {
        this.loading = true;
        const data = await this.$store.dispatch("websites/getAll");
        this.websites = data.results;
      } catch (err) {
        console.log("get-websites", err);
        this.$vs.notify({
          title: this.$t("error"),
          text: this.$t("unknow error please try again"),
          color: "danger",
          position: "bottom-center",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
      } finally {
        this.loading = false;
      }
    },
    showStat() {
      this.getTrackingData();
      // once data are avaliable, we will pass it to tracking-chart cmp
    },
    async getTrackingData() {
      try {
        this.loading = true;
        const { from, to } = this.toDates(this.selected.timeOption);
        this.tracking.from = from;
        this.tracking.to = to;
        const params = {
          element: this.selected.elementId,
          event: this.selectedEvents,
          "date-from": from,
          "date-to": to + "T23:59:59.999Z",
          sort: "date",
        };
        const data = await this.$store.dispatch("actions/getAll", params);
        this.tracking.data = this.groupTrackingData(data.results);
      } catch (err) {
        console.log("--err", err);
        this.$vs.notify({
          title: this.$t("error"),
          text: this.$t("unknow error please try again"),
          color: "danger",
          position: "bottom-center",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
      } finally {
        this.loading = false;
      }
    },
    // group tracking-data by event name
    groupTrackingData(data) {
      const map = new Map(); // key: event name, value: array of actions
      if (data.length === 0) return map;
      const selectedEvents = this.selectedEvents;
      // if multiple events are selected
      if (selectedEvents.length > 1) {
        for (const action of data) {
          const key = action.event;
          const value = map.get(key);
          if (value) value.push(action);
          else map.set(key, [action]);
        }
      } else {
        // one event is selected
        map.set(selectedEvents[0], data);
      }
      return map;
    },
    // get elements of the selected website
    async getEles() {
      try {
        this.loading = true;
        const data = await this.$store.dispatch("elements/getAll", {
          website: this.selected.websiteId,
          populate: "website",
        });
        this.eles = data.results;
      } catch (err) {
      } finally {
        this.loading = false;
      }
    },
    // TODO: define a number of colors and use them (closure)
    generateColor() {
      const r = Math.random;
      const max = 255;
      return `rgb(${r() * max}, ${r() * max}, ${r() * max})`;
    },
  },
};
</script>

<style>
</style>
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
          <vs-select
            label="Websites"
            v-model="selected.websitesIds"
            :max-selected="maxSelectedWebsites"
            multiple
          >
            <vs-select-item
              v-for="website in websites"
              :key="website._id"
              :value="website._id"
              :text="website.domain"
            />
          </vs-select>
        </div>
        <!-- event -->
        <div v-if="!!selected.websitesIds.length">
          <vs-select label="Event" v-model="selected.event">
            <vs-select-item
              v-for="(event, index) in evs"
              :key="index"
              :value="event"
              :text="event"
            />
          </vs-select>
        </div>
        <!-- elements -->
        <div v-if="!!selected.event">
          <vs-select
            label="Elements"
            v-model="selected.elementsIds"
            :autocomplete="true"
            :max-selected="maxSelectedElements"
            multiple
          >
            <vs-select-item
              v-for="element in elesList"
              :key="element._id"
              :value="element._id"
              :text="getElementText(element)"
            />
          </vs-select>
        </div>
        <!--time -->
        <div v-if="!!selected.elementsIds.length">
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
        <div v-show="!!selected.elementsIds.length">
          <vs-button @click="showStat">Show Statistics</vs-button>
        </div>
      </div>
    </vx-card>
    <!-- bar chart -->
    <vx-card class="mt-4" v-if="!!tracking.data">
      <stat-by-event-chart
        :trackingData="tracking.data"
        :timeOption="selected.timeOption"
        :from="tracking.from"
        :to="tracking.to"
        :elements="selectedEles"
        :selectedElesIds="selectedElementsIds"
        :event="selected.event"
        :colors="colors"
      />
    </vx-card>
    <!-- totals table -->
    <vx-card class="mt-4" v-if="dataExists">
      <stat-by-event-total
        :data="tracking.data"
        :elements="selectedEles"
        :selectedElesIds="selectedElementsIds"
        :event="selected.event"
        :colors="colors"
        :timeOption="selected.timeOption"
      />
    </vx-card>
    <vx-card class="mt-4" v-if="dataExists">
      <stat-by-event-page
        :trackingData="tracking.data"
        :elements="selectedEles"
        :selectedElesIds="selectedElementsIds"
        :event="selected.event"
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
import StatByEventChart from "./StatByEventChart.vue";
import StatByEventTotal from "./StatByEventTotal.vue";
import StatByEventPage from './StatByEventPage.vue';

export default {
  components: { StatByEventChart, StatByEventTotal, VxCard, StatByEventPage },
  data: () => ({
    selected: {
      websitesIds: [], // ids of selected websites
      elementsIds: [], // ids of selected elements
      event: null,
      timeOption: "today", // by default
    },
    websites: null,
    eles: null, // elements of the selected websites, it's a map: website-id => array of it's elements
    // tracking.data is a map: element-id => it's tracking data
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
    evs() {
      // eles: website-id => it's elements
      if (!this.eles) return [];
      let set = new Set();
      for (const elements of this.eles.values()) {
        const events = elements.reduce(
          (events, ele) => new Set([...events.values(), ...ele.events]),
          new Set() // events initial value
        );
        set = new Set([...set.values(), ...events.values()]);
      }
      return Array.from(set.values());
    },
    //! in case of a website without elements
    elesList() {
      if (!this.eles) return [];
      let elesList = [{ _id: "all", label: "all elements" }];
      for (const elements of this.eles.values()) {
        const filtredElements = elements.filter((ele) =>
          ele.events.includes(this.selected.event)
        );
        elesList = [...elesList, ...filtredElements];
      }
      return elesList;
    },
    // ids of all the elements in the list
    elesListIds() {
      return this.elesList.reduce((ids, ele) => {
        if (ele._id !== "all") return [...ids, ele._id];
        return ids;
      }, []);
    },
    selectedElementsIds() {
      const ids = this.selected.elementsIds.includes("all")
        ? this.elesListIds
        : this.selected.elementsIds;
      return ids;
    },
    // it's a map: websiteId => array of elements
    selectedEles() {
      const map = new Map();
      const ids = this.selectedElementsIds;
      ids.forEach((id) => {
        const eleIndex = this.elesList.findIndex((ele) => ele._id === id);
        const element = this.elesList[eleIndex];
        const key =
          typeof element.website === "object"
            ? element.website._id
            : element.website;
        const selectedElements = map.get(key);
        if (!selectedElements) map.set(key, [element]);
        else selectedElements.push(element);
      });
      return map;
    },
    maxSelectedElements() {
      if (this.selected.elementsIds.includes("all")) return 1;
      return 3;
    },
    maxSelectedWebsites() {
      return 2;
    },
    updateSelectedElementLink() {
      return {
        name: "elements-update",
        params: { elementId: this.selected.elementId },
      };
    },
    // the color used for each element, this way we can use them accros different charts
    colors() {
      const colors = new Map();
      this.selectedElementsIds.forEach((eleId, index) => {
        colors.set(eleId, colorsList[index % colorsList.length]);
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
    "selected.websitesIds": function () {
      this.tracking.data = null;
      this.selected.event = null;
      // get elements of the selected websiteS
      if (this.selected.websitesIds.length > 0) this.getEles();
    },
    "selected.event": function () {
      this.tracking.data = null;
      this.selected.elementsIds = [];
    },
    "selected.elementsIds": function () {
      this.tracking.data = null;
      // if we select 'all elements' option we ignore previously selected options
      if (
        this.selected.elementsIds.includes("all") &&
        this.selected.elementsIds.length > 1
      )
        this.selected.elementsIds = ["all"];
    },
  },
  created() {
    this.getWebsites();
  },
  methods: {
    // return the text to display in select for an element
    getElementText(element) {
      const text = `${element.label}`;
      // if multiple websites are selected
      if (
        this.selected.websitesIds.length > 1 &&
        element.website &&
        typeof element.website === "object"
      )
        return `${text} (${element.website.domain})`;
      return text; // if one website is selected
    },
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
      // to += "T23:59:59.999Z";
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
          event: this.selected.event,
          "date-from": from,
          "date-to": to + "T23:59:59.999Z",
          sort: "date",
        };
        const elementsIds = this.selected.elementsIds;
        // 'all elements' option is selected
        if (elementsIds.includes("all")) {
          params.element = this.elesListIds;
        } else {
          // 1 or more element(s) is/are selected
          params.element = elementsIds;
        }
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
    // group tracking-data by element-id
    // used in case we selected more than one element
    groupTrackingData(data) {
      const map = new Map(); // key: element id, value: array of actions
      if (data.length === 0) return map;
      const elementsIds = this.selected.elementsIds;
      if (elementsIds.length > 1 || elementsIds.includes("all")) {
        for (const action of data) {
          const value = map.get(action.element);
          if (value) value.push(action);
          else map.set(action.element, [action]);
        }
      } else {
        // one element is selected
        map.set(elementsIds[0], data);
      }
      return map;
    },
    // get elements of the selected websiteS
    async getEles() {
      try {
        this.loading = true;
        const data = await this.$store.dispatch("elements/getAll", {
          website: this.selected.websitesIds,
          populate: "website",
        });
        this.eles = this.groupElements(data.results);
      } catch (err) {
      } finally {
        this.loading = false;
      }
    },
    // group elements by website-id
    groupElements(elements) {
      const map = new Map(); // key: website-id, value: array of elements
      if (elements.length === 0) return map;
      const websitesIds = this.selected.websitesIds;
      // multiple websites are selected
      if (websitesIds.length > 1) {
        for (const ele of elements) {
          const key =
            typeof ele.website === "object" ? ele.website._id : ele.website;
          const value = map.get(key);
          if (value) value.push(ele);
          else map.set(key, [ele]);
        }
      } else {
        // one website is selected
        map.set(websitesIds[0], elements);
      }
      return map;
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
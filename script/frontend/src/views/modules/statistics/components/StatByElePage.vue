<template>
  <div>
    <div class="bg-white rounded-lg shadow p-4">
      <div class="p-4">
        <h5 class="text-secondary font-semibold uppercase truncate">
          {{ title }}
        </h5>
      </div>
      <div class="vs-component vs-con-table vs-table-primary stripe">
        <div class="w-full">
          <div class="vs-con-tbody vs-table--tbody">
            <table class="vs-table vs-table--tbody-table">
              <thead class="vs-table--thead">
                <tr>
                  <th>Event</th>
                  <!-- pages -->
                  <th v-for="(page, index) in pages" :key="index">
                    <div class="flex flex-col">
                      <span>{{ page }}</span>
                      <vs-chip class="text-sm whitespace-no-wrap shadow w-32">
                        <span>views: {{ pageViews.get(page) || 0 }} - {{ pageViewsPercentage.get(page) || 0}}%</span>
                      </vs-chip>
                    </div>
                  </th>
                </tr>
              </thead>
              <tr
                class="tr-values vs-table--tr tr-table-state-null"
                v-for="event in sortedEvents"
                :key="event"
              >
                <!-- event -->
                <td class="td vs-table--td py-3">
                  <span class="text-primary font-semibold whitespace-no-wrap">{{
                    event
                  }}</span>
                </td>
                <!-- total per page for an event -->
                <td
                  v-for="(page, index) in pages"
                  :key="index"
                  class="td vs-table--td py-3 font-semibold"
                >
                  <div class="flex flex-wrap">
                    <vs-chip
                      :color="colors.get(event)"
                      class="text-sm whitespace-no-wrap shadow w-32"
                    >
                      <span>{{ data.get(event).get(page) || 0 }}</span>
                    </vs-chip>
                    <vs-chip
                      :color="colors.get(event)"
                      class="text-sm whitespace-no-wrap shadow w-32"
                    >
                      <span
                        >{{ pourcentages.get(event).get(page) || 0 }} %</span
                      >
                    </vs-chip>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    element: { required: true, type: Object },
    trackingData: { required: true, type: Map }, // tracking data, map: event name => array of actions
    events: { required: true, type: Array }, // selected events
    colors: { required: false, type: Map }, // map: event name => color
    timeOption: { required: false, type: String },
    from: { required: true, type: String },
    to: { required: true, type: String },
  },
  data: () => ({
    pagesReady: false,
    // maps: page => total views
    pageViews: new Map(),
  }),
  computed: {
    // map: event => (page => total)
    data() {
      const map = new Map();
      this.events.forEach((event) => {
        const actions = this.trackingData.get(event);
        // actionsByPage, map: page => total
        const totalsByPage = this.groupTotalByPage(actions);
        map.set(event, totalsByPage);
      });
      return map;
    },
    totals() {
      // map: event name => total
      const totals = new Map();
      this.events.forEach((event) => {
        const totalByPage = this.data.get(event);
        const total = Array.from(totalByPage.values()).reduce(
          (cum, curr) => cum + curr,
          0
        );
        totals.set(event, total);
      });
      return totals;
    },
    pourcentages() {
      // map: event => (page => %)
      const map = new Map();
      this.events.forEach((event) => {
        // total for all pages
        const total = this.totals.get(event);
        const pourcentages = new Map();
        const totalByPage = this.data.get(event);
        Array.from(totalByPage.keys()).forEach((page) => {
          const pourcentage = Math.floor((totalByPage.get(page) / total) * 100);
          pourcentages.set(page, pourcentage);
        });
        map.set(event, pourcentages);
      });
      return map;
    },
    // selected events sorted by total
    sortedEvents() {
      const events = new Array(...this.events);
      events.sort((evA, evB) => this.totals.get(evB) - this.totals.get(evA));
      return events;
    },
    pages() {
      console.log("--pages");
      let set = new Set();
      Array.from(this.data.values()).forEach((totalByPage) => {
        const pages = Array.from(totalByPage.keys());
        set = new Set([...set.values(), ...pages]);
      });
      this.pagesReady = true;
      return Array.from(set.values()).sort();
    },
    title() {
      return `totals per page / element: ${this.element.label} / period: ${this.timeOption}`;
    },
    pageViewsPercentage() {
      console.log("--pvs", this.pageViews);
      const sumOfTotals = Array.from(this.pageViews.values()).reduce(
        (cum, curr) => cum + curr,
        0
      );
      const map = new Map();
      Array.from(this.pageViews.keys()).forEach((page) => {
        const percentage = Math.round(
          (this.pageViews.get(page) / sumOfTotals) * 100
        );
        map.set(page, percentage);
      });
      return map;
    },
  },
  watch: {
    pagesReady() {
      if (!this.pagesReady) return;
      this.getPageViews();
      this.pagesReady = false;
    },
  },
  methods: {
    // group actions by page
    groupTotalByPage(data) {
      // map: page => array of actions
      const map = new Map();
      if (!data || data.length === 0) return map;

      data.forEach((action) => {
        const key = action.page;
        const value = map.get(key);
        if (!value) map.set(key, action.frequency);
        else map.set(key, value + action.frequency);
      });

      return map;
    },
    async getPageViews({
      pages = this.pages,
      to = this.to,
      from = this.from,
    } = {}) {
      try {
        const data = await this.$store.dispatch("pageViews/getAll", {
          pagePath: pages, // page = domain + ..., so using page as a filter is enough
          "date-from": from,
          "date-to": to + "T23:59:59.999Z",
        });
        this.pageViews = this.groupPageViews(data);
      } catch (err) {
        console.log("--getPV", err);
        this.$vs.notify({
          title: this.$t("error"),
          text: this.$t("unknow error please try again"),
          color: "danger",
          position: "bottom-center",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
      }
    },
    // group page views by page, returns a map: page => total views
    groupPageViews(data) {
      const map = new Map();
      if (!data || data.length === 0) return map;

      data.results.forEach((pageView) => {
        const key = pageView.pagePath;
        const value = map.get(key);
        if (!value) map.set(key, pageView.views);
        else map.set(key, value + pageView.views);
      });

      return map;
    },
  },
};
</script>

<style>
</style>
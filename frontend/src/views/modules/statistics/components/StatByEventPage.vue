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
                  <th>Element</th>
                  <!-- pages -->
                  <th v-for="(page, index) in pages" :key="index">
                    <div class="flex flex-col">
                      <span>{{ page }}</span>
                      <vs-chip class="text-sm whitespace-no-wrap shadow w-32">
                        <span
                          >views: {{ pageViews.get(page) || 0 }} -
                          {{ pageViewsPercentage.get(page) || 0 }}%</span
                        >
                      </vs-chip>
                    </div>
                  </th>
                </tr>
              </thead>
              <template v-for="websiteId in sortedElements.keys()">
                <tr
                  class="tr-values vs-table--tr tr-table-state-null"
                  v-for="elt in sortedElements.get(websiteId)"
                  :key="elt._id"
                >
                  <td class="td vs-table--td py-3">
                    <div class="flex flex-col">
                      <span
                        class="text-primary font-semibold whitespace-no-wrap"
                        >{{ elt.label }}</span
                      >
                      <span class="text-secondary font-semibold text-sm">{{
                        elt.website.domain
                      }}</span>
                    </div>
                  </td>
                  <td
                    v-for="(page, index) in pages"
                    :key="index"
                    class="td vs-table--td py-3 font-semibold"
                  >
                    <div class="flex flex-wrap">
                      <vs-chip
                        :color="colors.get(elt._id)"
                        class="text-sm whitespace-no-wrap shadow w-32"
                      >
                        <span v-if="!!data.get(elt._id)">{{
                          data.get(elt._id).get(page) || 0
                        }}</span>
                        <span v-else>0</span>
                      </vs-chip>
                      <vs-chip
                        :color="colors.get(elt._id)"
                        class="text-sm whitespace-no-wrap shadow w-32"
                      >
                        <span v-if="!!percentages.get(elt._id)"
                          >{{ percentages.get(elt._id).get(page) || 0 }}%</span
                        >
                        <span v-else>0%</span>
                      </vs-chip>
                    </div>
                  </td>
                </tr>
              </template>
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
    // map: eleId => array of actions
    trackingData: { required: true, type: Map },
    elements: { required: true, type: Map }, //selected elements, map: websiteId => array of element
    selectedElesIds: { required: true, type: Array },
    event: { required: false, type: String },
    colors: { required: false, type: Map },
    timeOption: { required: false, type: String },
    from: { required: true, type: String },
    to: { required: true, type: String },
  },
  data: () => ({
    pagesReady: false,
    pageViews: new Map(),
  }),
  computed: {
    data() {
      const dataPerPage = new Map();
      this.trackingData.forEach((actions, eleId) => {
        const dataPerPageMap = new Map();
        actions.forEach(({ page, frequency }) => {
          if (dataPerPageMap.has(page)) {
            dataPerPageMap.set(page, dataPerPageMap.get(page) + frequency);
          } else {
            dataPerPageMap.set(page, frequency);
          }
        });
        dataPerPage.set(eleId, dataPerPageMap);
      });
      return dataPerPage;
    },
    pages() {
      let set = new Set();
      Array.from(this.data.values()).forEach((totalByPage) => {
        const pages = Array.from(totalByPage.keys());
        set = new Set([...set.values(), ...pages]);
      });
      this.pagesReady = true;
      console.log(Array.from(set.values()).sort());
      return Array.from(set.values()).sort();
    },
    totals() {
      // map: eleId => total
      const totals = new Map();
      this.data.forEach((actions, elementId) => {
        let total = !actions
          ? 0
          : Array.from(actions.values()).reduce((acc, curr) => acc + curr, 0);
        totals.set(elementId, total);
      });
      return totals;
    },
    percentages() {
      const map = new Map();
      this.data.forEach((totalByPage, eleId) => {
        const percentageByPage = new Map();
        totalByPage.forEach((pageTotal, page) => {
          const percentage = Math.floor(
            (pageTotal / this.totals.get(eleId)) * 100
          );
          percentageByPage.set(page, percentage);
        });
        map.set(eleId, percentageByPage);
      });
      return map;
    },
    // seltcted events sorted by total
    sortedElements() {
      // elements of a website
      for (const elements of this.elements.values()) {
        elements.sort(
          (eltA, eltB) => this.totals.get(eltB._id) - this.totals.get(eltA._id)
        );
      }
      return this.elements;
    },
    title() {
      return `totals per page / event: ${this.event} / period: ${this.timeOption}`;
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
    async getPageViews({
      pages = this.pages,
      to = this.to,
      from = this.from,
    } = {}) {
      console.log("pages", pages);
      try {
        const data = await this.$store.dispatch("pageViews/getAll", {
          pagePath: pages, // page = domain + ..., so using page as a filter is enough
          "date-from": from,
          "date-to": to + "T23:59:59.999Z",
        });
        console.log("res", data);
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
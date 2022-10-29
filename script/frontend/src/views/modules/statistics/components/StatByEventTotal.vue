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
                  <!-- websites should span multiple rows -->
                  <!-- <th>Website</th> -->
                  <th>Label</th>
                  <th>Total</th>
                  <th>Pourcentage %</th>
                </tr>
              </thead>
              <template v-for="websiteId in sortedElements.keys()">
                <tr
                  class="tr-values vs-table--tr tr-table-state-null"
                  v-for="ele in elements.get(websiteId)"
                  :key="ele._id"
                >
                  <!-- website -->
                  <!-- <td v-if="eleIndex < 1" class="td vs-table--td py-3" :rowspan="elements.get(websiteId).length">
                    <span
                      class="text-primary font-semibold whitespace-no-wrap"
                      >{{ ele.website.domain }}</span
                    >
                  </td> -->
                  <!-- label -->
                  <td class="td vs-table--td py-3">
                    <div class="flex flex-col">
                      <span
                        class="text-primary font-semibold whitespace-no-wrap"
                        >{{ ele.label }}</span
                      >
                      <span class="text-secondary font-semibold text-sm">{{
                        ele.website.domain
                      }}</span>
                    </div>
                  </td>
                  <!-- total -->
                  <td class="td vs-table--td py-3 font-semibold">
                    <vs-chip
                      :color="colors.get(ele._id)"
                      class="text-sm whitespace-no-wrap shadow w-32"
                    >
                      <span>{{ totals.get(ele._id) }}</span>
                    </vs-chip>
                  </td>
                  <!-- pourcentage -->
                  <td class="td vs-table--td py-3 font-semibold">
                    <vs-chip
                      :color="colors.get(ele._id)"
                      class="text-sm whitespace-no-wrap shadow w-32"
                    >
                      <span>{{ pourcentages.get(ele._id) }}%</span>
                    </vs-chip>
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
    elements: { required: true, type: Map }, //selected elements, map: websiteId => array of element
    selectedElesIds: { required: true, type: Array },
    data: { required: true, type: Map }, // tracking data, map: elementId => array of actions
    event: { required: false, type: String },
    colors: { required: false, type: Map },
    timeOption: { required: false, type: String }
  },
  computed: {
    // sorted version of elements based on total
    sortedElements() {
      for (const elements of this.elements.values()) {
        elements.sort(
          (eleA, eleB) => this.totals.get(eleB._id) - this.totals.get(eleA._id)
        );
      }
      return this.elements;
    },
    // map: eleId => total
    totals() {
      const totals = new Map();
      this.selectedElesIds.forEach(eleId => {
        const actions = this.data.get(eleId);
        const total = !actions ? 0 : actions.reduce((cum, curr) => cum + curr.frequency, 0);
        totals.set(eleId, total);
      });
      return totals;
    },
    totalsSum() {
      return Array.from(this.totals.values()).reduce((cum, curr) => cum + curr);
    },
    // map: eleId => total
    pourcentages() {
      const pourcentages = new Map();
      this.selectedElesIds.forEach((eleId) => {
        const total = this.totals.get(eleId);
        const pourcentage = Math.floor((total / this.totalsSum) * 100);
        pourcentages.set(eleId, pourcentage);
      });
      return pourcentages;
    },
    title() {
      return `totals / event: ${this.event} / periode: ${this.timeOption}`;
    },
  },
};
</script>

<style>
</style>
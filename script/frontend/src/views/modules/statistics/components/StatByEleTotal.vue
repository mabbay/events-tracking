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
                  <th>Total</th>
                  <th>Pourcentage %</th>
                </tr>
              </thead>
              <tr
                class="tr-values vs-table--tr tr-table-state-null"
                v-for="event in sortedEvents"
                :key="event"
              >
                <!-- event -->
                <td class="td vs-table--td py-3">
                  <div class="flex flex-col">
                    <span
                      class="text-primary font-semibold whitespace-no-wrap"
                      >{{ event }}</span
                    >
                  </div>
                </td>
                <!-- total -->
                <td class="td vs-table--td py-3 font-semibold">
                  <vs-chip
                    :color="colors.get(event)"
                    class="text-sm whitespace-no-wrap shadow w-32"
                  >
                    <span>{{ totals.get(event) }}</span>
                  </vs-chip>
                </td>
                <!-- pourcentage -->
                <td class="td vs-table--td py-3 font-semibold">
                  <vs-chip
                    :color="colors.get(event)"
                    class="text-sm whitespace-no-wrap shadow w-32"
                  >
                    <span>{{ pourcentages.get(event) + "%" }}</span>
                  </vs-chip>
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
    data: { required: true, type: Map }, // tracking data, map: event name => array of actions
    events: { required: true, type: Array },
    colors: { required: false, type: Map }, // map: event name => color
    timeOption: { required: false, type: String }
  },
  computed: {
    dataExists() {
      return this.data.size > 0;
    },
    totals() {
      const totals = new Map();
      this.events.forEach((event) => {
        const actions = this.data.get(event);
        const total = !actions
          ? 0
          : actions.reduce((cum, curr) => cum + curr.frequency, 0);
        totals.set(event, total);
      });
      return totals;
    },
    // events list sorted by total
    sortedEvents() {
      const events = new Array(...this.events);
      events.sort((evA, evB) => this.totals.get(evB) - this.totals.get(evA));
      return events;
    },
    totalsSum() {
      return Array.from(this.totals.values()).reduce((cum, curr) => cum + curr);
    },
    pourcentages() {
      const pourcentages = new Map();
      this.events.forEach((event) => {
        const total = this.totals.get(event);
        const pourcentage = Math.floor((total / this.totalsSum) * 100);
        pourcentages.set(event, pourcentage);
      });
      return pourcentages;
    },
    title() {
       return `totals / element: ${this.element.label} / period: ${this.timeOption}`;
    },
  },
};
</script>

<style>
</style>
<template>
  <div>
    <p v-if="noTrackingData" class="text-lg text-center">
      No tracking data avaliable for now
    </p>
    <p v-else-if="tooManyEvents" class="text-lg text-center">
      the graph will be displayed only if the number of events is less than or equal to
      {{ eventsLimit }}
    </p>
    <div v-show="!noTrackingData && !tooManyEvents">
      <canvas ref="chart"></canvas>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js/auto";

export default {
  props: {
    // tracking-data, it's a map: event name => array of actions
    trackingData: { required: true, type: Map },
    from: { required: true, type: String },
    to: { required: true, type: String },
    // selected element
    element: { required: true, type: Object },
    // selected events
    events: { required: true, type: Array },
    timeOption: { required: true, type: String },
    // map: event name => color
    colors: { required: false, type: Map },
  },
  data: () => ({
    chart: null,
    eventsLimit: 3,
  }),
  computed: {
    noTrackingData() {
      return this.trackingData.size === 0;
    },
    // show/hide bar chart based on the number of selected events
    tooManyEvents() {
      return this.data.size > 3;
    },
    // based on the value of timeOption returns an object that contains useful informations needed when creating axes
    parsingParams() {
      const to = this.to;
      const params = {};
      if (this.timeOption === "today" || this.timeOption === "yesterday") {
        params.limit = () => {
          return this.timeOption === "today"
            ? this.$moment().utc()
            : this.$moment(to).endOf("day");
        };
        params.startValue = 0;
        params.momentMethod = "hour";
        params.format = "HH";
      } else if (
        this.timeOption === "this week" ||
        this.timeOption === "last week"
      ) {
        params.limit = () => this.$moment(to).endOf("day");
        params.startValue = 1;
        params.momentMethod = "isoWeekday";
        params.format = "YYYY-MM-DD";
      } else if (
        this.timeOption === "this month" ||
        this.timeOption === "last month"
      ) {
        params.limit = () => this.$moment(to).endOf("day");
        params.startValue = 1;
        params.momentMethod = "date";
        params.format = "YYYY-MM-DD";
      } else if (
        this.timeOption === "this year" ||
        this.timeOption === "last year"
      ) {
        params.limit = () => this.$moment(to).endOf("day");
        params.startValue = 0;
        params.momentMethod = "month";
        params.format = "YYYY-MM";
      }
      return params;
    },
    xAxes() {
      const params = this.parsingParams;
      const from = this.from;
      const xAxes = [];
      let date;
      let { startValue: i } = params;
      while (
        (date = this.$moment(from)[params.momentMethod](i)) <= params.limit()
      ) {
        xAxes.push(this.$moment(date).format(params.format));
        i++;
      }
      return xAxes;
    },
    // computed from tracking-data
    // to make sure all selected events are are shown on the chart
    data() {
      const data = new Map([...this.trackingData.entries()]);
      // if all events are included
      if (this.trackingData.size === this.events.length) return data;
      this.events.forEach((event) => {
        if (!data.has(event)) data.set(event, []);
      });
      return data;
    },
  },
  watch: {
    data() {
      this.plot();
    },
  },
  mounted() {
    this.plot();
  },
  methods: {
    plot() {
      if (this.noTrackingData || this.tooManyEvents) return;

      const datasets = [];
      this.events.forEach((event) => {
        const actions = this.data.get(event);
        const yAxes = this.createYAxes(actions);
        datasets.push({
          label: event,
          data: yAxes,
          backgroundColor: this.colors.get(event),
        });
      });

      const config = this.getConfig({ xAxes: this.xAxes, datasets });
      if (this.chart) this.chart.destroy();
      this.chart = new Chart(this.$refs.chart, config);
    },
    // get cofig object of the chart to plot
    getConfig({ xAxes, datasets }) {
      return {
        type: "bar",
        data: {
          labels: xAxes,
          datasets: datasets,
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true, //? is working
                  min: 0,
                },
              },
            ],
          },
        },
      };
    },
    createYAxes(data) {
      const yAxes = [];
      const params = this.parsingParams;
      for (let i = 0; i < this.xAxes.length; i++) yAxes[i] = 0;
      const getIndex = (action) =>
        this.$moment(action.date)[params.momentMethod]() - params.startValue;
      for (const action of data) {
        const index = getIndex(action);
        yAxes[index]
          ? (yAxes[index] = yAxes[index] + action.frequency)
          : (yAxes[index] = action.frequency);
      }
      return yAxes;
    },
  },
};
</script>

<style>
</style>
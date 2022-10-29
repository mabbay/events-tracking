<template>
  <div>
    <p v-if="noTrackingData" class="text-lg text-center">
      No tracking data avaliable for now
    </p>
    <p v-else-if="tooManyElements" class="text-lg text-center">
      the graph will be displayed only if the number of elements is less than or equal to
      {{ elementsLimit }}
    </p>
    <div v-show="!noTrackingData && !tooManyElements">
      <canvas ref="chart"></canvas>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js/auto";

export default {
  props: {
    // tracking-data, it's a map: element-id => it's actions
    trackingData: { required: true, type: Map },
    from: { required: true, type: String },
    to: { required: true, type: String },
    // selected elements, map: website-id => array of elements
    elements: { required: true, type: Map },
    selectedElesIds: { required: true, type: Array },
    event: { required: false, type: String },
    timeOption: { required: true, type: String },
    // map: eleId => color
    colors: { required: false, type: Map },
  },
  data: () => ({
    chart: null,
    elementsLimit: 3,
  }),
  computed: {
    noTrackingData() {
      return this.trackingData.size == 0;
    },
    // show/hide bar chart based on the number of selected elements
    //TODO: based on timeOption define the limit
    tooManyElements() {
      return this.data.size > this.elementsLimit;
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
    data() {
      // to make sure all selected elements are shown on the chart even they have no tracking data
      const data = new Map([...this.trackingData.entries()]);
      this.selectedElesIds.forEach((eleId) => {
        if (!data.has(eleId)) data.set(eleId, []);
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
      if (this.noTrackingData || this.tooManyElements) return;

      const datasets = [];
      Array.from(this.elements.values()).forEach((elements) => {
        elements.forEach((ele) => {
          const yAxes = this.createYAxes(this.data.get(ele._id));
          datasets.push({
            label: this.getDatasetLabel({ element: ele }),
            data: yAxes,
            backgroundColor: this.colors.get(ele._id),
            borderColor: this.colors.get(ele._id),
          });
        });
      });

      const config = this.getConfig({ xAxes: this.xAxes, datasets });
      if (this.chart) this.chart.destroy();
      this.chart = new Chart(this.$refs.chart, config);
    },
    // get label of a dataset
    getDatasetLabel({ element }) {
      return `${element.website.domain} / ${element.label}`;
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
          responsive: true,
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
          plugins: {
            title: {
              display: true,
              text: `event: ${this.event} / period: ${this.timeOption}`,
            },
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
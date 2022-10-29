<template>
  <div>
    <div>
      <small>{{ options.label | t }}</small>
    </div>
    <div class="date-time">
      <flat-pickr class="datepicker w-full md:w-1/2"  :config="configFromdateTimePicker" v-model="fromDate" :placeholder="options.hint.from | t" @on-change="onFromChange"  />
      <label class="line"></label>
      <flat-pickr class="datepicker w-full md:w-1/2"  :config="configTodateTimePicker" v-model="toDate" :placeholder="options.hint.to | t" @on-change="onToChange" />
    </div>
  </div>
</template>

<script>
  import flatPickr from "vue-flatpickr-component";
  import "flatpickr/dist/flatpickr.css";
  export default {
    name: "si-start-end-date",
    props: {
      options:{required:true},
      value: {
        type: Object,
        default: function () {
          return { from: null, to: null };
        }
      },
      validate: { type: String, default: "" },
    },
    data() {
      return {
        fromDate: this.value.from,
        toDate: this.value.to,
        newValue: { from: null, to: null },
        configFromdateTimePicker: {
          // minDate: new Date(),
          maxDate: null
        },
        configTodateTimePicker: {
          minDate: null
          // minDate: new Date(),
        }
      };
    },
    methods: {
      onFromChange(selectedDates, dateStr, instance) {
        this.$set(this.configTodateTimePicker, "minDate", dateStr);
        this.newValue.from = this.$moment(dateStr).startOf('day').format();
        console.log(this.newValue.from);
        this.$emit("onInput", this.newValue);
      },
      onToChange(selectedDates, dateStr, instance) {
          this.$set(this.configFromdateTimePicker, "maxDate", dateStr);
        this.newValue.to = this.$moment(dateStr).endOf('day').format();
        console.log(this.newValue.to);
        this.$emit("onInput", this.newValue);
      },
    },
    components: {
      flatPickr
    }
  };
</script>
<style scoped>
  .no-border {
    border: none;
  }

  .date-time {
    display: flex;
    align-items: center;
    width: 100%;
    border: 1px solid #cccccc;
    flex-wrap: nowrap;
    border-radius: 5px;
  }

  .line {
    border-left: 1px solid #cccccc;
    height: 20px;
  }

  .labeltext {
    text-align: center;
  }
  .date-time .datepicker{
    border: none !important;
  }
  @media screen and (max-width: 96) {
    .Svghidden {
      visibility: hidden;
      display: none;
    }
    .date-time .datepicker{
      border: 1px solid gray !important;
    }
  }

  @media screen and (max-width: 840px) {
    .date-time {
      display: flex;
      align-items: center;
      width: 100%;
      border: none;
      flex-wrap: wrap;
      border-radius: 5px;
    }

    .labeltext {
      display: none;
    }

    .line {
      border-top: none;
      height: 4px;
      width: 0%;
    }

  }
</style>
<template>
  <div>
    <div>
      <label>{{label}}</label>
    </div>
    <div class="dat-time">
      <div>
        <svg class="ml-3 mr-2 Svghidden" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18" height="18"
          viewBox="0 0 172 172" style=" fill:#000000;">
          <g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt"
            stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray stroke-dashoffset="0" font-family="none"
            font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal">
            <path d="M0,172v-172h172v172z" fill="none" />
            <g>
              <path
                d="M17.91667,139.75v-86h136.16667v86c0,7.91558 -6.41775,14.33333 -14.33333,14.33333h-107.5c-7.91558,0 -14.33333,-6.41775 -14.33333,-14.33333"
                fill="#cccccc" />
              <path
                d="M154.08333,39.41667v21.5h-136.16667v-21.5c0,-7.91558 6.41775,-14.33333 14.33333,-14.33333h107.5c7.91558,0 14.33333,6.41775 14.33333,14.33333"
                fill="#000000" />
              <path
                d="M129,39.41667c0,5.93758 -4.81242,10.75 -10.75,10.75c-5.93758,0 -10.75,-4.81242 -10.75,-10.75c0,-5.93758 4.81242,-10.75 10.75,-10.75c5.93758,0 10.75,4.81242 10.75,10.75M64.5,39.41667c0,5.93758 -4.81242,10.75 -10.75,10.75c-5.93758,0 -10.75,-4.81242 -10.75,-10.75c0,-5.93758 4.81242,-10.75 10.75,-10.75c5.93758,0 10.75,4.81242 10.75,10.75"
                fill="#cccccc" />
              <path
                d="M118.25,14.33333c-3.956,0 -7.16667,3.21067 -7.16667,7.16667v17.91667c0,3.956 3.21067,7.16667 7.16667,7.16667c3.956,0 7.16667,-3.21067 7.16667,-7.16667v-17.91667c0,-3.956 -3.21067,-7.16667 -7.16667,-7.16667M53.75,14.33333c-3.956,0 -7.16667,3.21067 -7.16667,7.16667v17.91667c0,3.956 3.21067,7.16667 7.16667,7.16667c3.956,0 7.16667,-3.21067 7.16667,-7.16667v-17.91667c0,-3.956 -3.21067,-7.16667 -7.16667,-7.16667"
                fill="#b0bec5" />
              <g fill="#cccccc">
                <path
                  d="M96.6855,129h-10.6855v-34.42508l-10.75,3.10317v-8.1915l20.44292,-7.06992h0.99258zM107.5,111.96483c0,-5.13133 1.18967,-9.17692 3.569,-12.12958c2.37933,-2.94908 5.70467,-4.429 9.96525,-4.429c3.10675,0 5.84442,1.1395 7.96575,3.41492v-16.4045h10.75v45.98492h-9.74308l-0.54467,-3.47583c-2.22883,2.71617 -5.05967,4.07425 -8.48892,4.07425c-4.13517,0 -7.4175,-1.47633 -9.83983,-4.429c-2.42233,-2.95267 -3.6335,-7.15233 -3.6335,-12.60617zM118.33242,112.59192c0,5.74767 1.79883,8.62508 5.40367,8.62508c2.40083,0 4.11367,-0.946 5.14567,-2.8165v-12.32667c-0.98542,-1.91708 -2.68033,-2.87742 -5.08117,-2.87742c-3.34683,0 -5.15283,2.51192 -5.43233,7.54292zM32.25,103.91667h28.66667v7.16667h-28.66667z" />
              </g>
            </g>
          </g>
        </svg>
      </div>
      <label class="line labeltext"></label>
      <small class="sm:w-1/4 labeltext">{{options.hint.from}}:</small>
      <flat-pickr class="vx-col sm:w-1/4 w-full no-border" :config="configFromdateTimePicker" v-model="fromDate"
        @on-change="onFromChange" />
      <label class="line"></label>
      <small class="sm:w-1/4 labeltext">{{options.hint.to}}:</small>
      <flat-pickr class="vx-col sm:w-1/4 w-full no-border" :config="configTodateTimePicker" v-model="toDate"
        :placeholder="options.hint.to" @on-change="onToChange" />
    </div>
  </div>
</template>

<script>
  import flatPickr from "vue-flatpickr-component";
  import "flatpickr/dist/flatpickr.css";
  export default {
    props: {
      options:{required:true},
      value: {
        type: Object,
        default: function () {
          return { from: "", to: "" };
        }
      },
      validate: { type: String, default: "" },
    },
    data() {
      return {
        fromDate: this.value.from,
        toDate: this.value.to,
        newValue: { from: "", to: "" },
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
        //   this.$set(this.configTodateTimePicker, "minDate", dateStr);
        this.newValue.from = dateStr;
        this.$emit("onInput", this.newValue);
      },
      onToChange(selectedDates, dateStr, instance) {
        //   this.$set(this.configFromdateTimePicker, "maxDate", dateStr);
        this.newValue.to = dateStr;
        this.$emit("onInput", this.newValue);
      }
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

  .dat-time {
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

  @media screen and (max-width: 640px) {
    .Svghidden {
      visibility: hidden;
      display: none;
    }
  }

  @media screen and (max-width: 840px) {
    .dat-time {
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
<template>
  <!-- NOTIFICATIONS -->
  <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">
    <feather-icon
      icon="BellIcon"
      class="cursor-pointer mt-1 sm:mr-6 mr-2"
      :badge="unreadNotifications.length"
    />

    <vs-dropdown-menu class="notification-dropdown dropdown-custom vx-navbar-dropdown">
      <div class="notification-top text-center p-5 bg-primary text-white">
        <h3 class="text-white">{{ unreadNotifications.length }} New</h3>
      </div>

      <component
        :is="scrollbarTag"
        ref="mainSidebarPs"
        class="scroll-area--nofications-dropdown p-0 mb-10"
        :settings="settings"
        :key="$vs.rtl"
      >
        <ul class="bordered-items">
          <li
            v-for="ntf in unreadNotifications"
            :key="ntf.index"
            class="flex justify-between px-4 py-4 notification cursor-pointer"
          >
            <div class="flex items-start">
              <feather-icon
                :icon="ntf.icon"
                :svgClasses="[`text-${ntf.category}`, 'stroke-current mr-1 h-6 w-6']"
              ></feather-icon>
              <div class="mx-2">
                <span
                  class="font-medium block notification-title"
                  :class="[`text-${ntf.category}`]"
                >{{ ntf.title }}</span>
                <small>{{ ntf.msg }}</small>
              </div>
            </div>
            <small class="mt-1 whitespace-no-wrap">{{ elapsedTime(ntf.time) }}</small>
          </li>
        </ul>
      </component>

      <div
        class="checkout-footer fixed bottom-0 rounded-b-lg text-primary w-full p-2 font-semibold text-center border border-b-0 border-l-0 border-r-0 border-solid d-theme-border-grey-light cursor-pointer"
      >
        <span>View All Notifications</span>
      </div>
    </vs-dropdown-menu>
  </vs-dropdown>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
  components: {
    VuePerfectScrollbar
  },
  data() {
    return {
      // unreadNotifications: [
      //   {
      //     index: 0,
      //     title: "New Message",
      //     msg: "Are your going to meet me tonight?",
      //     icon: "MessageSquareIcon",
      //     time: this.randomDate({ sec: 10 }),
      //     category: "primary",
      //     to:"order"
      //   },
      // ],
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.6
      }
    };
  },
  computed: {
    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    },
    unreadNotifications(){
      let notifarray = [];
      // let arraynotify  = localStorage.getItem('messenges-notify');
      // console.log("LocalStorage");
      // console.log(arraynotify);
      // if (arraynotify) {
      //   notifarray = JSON.parse(arraynotify); 
      // }
      return notifarray;
      return [
        {
          index: 0,
          title: "New Message",
          msg: "Are your going to meet me tonight?",
          icon: "MessageSquareIcon",
          time: this.randomDate({ sec: 10 }),
          category: "primary",
          to:"order"
        },
      ];
    }
  },
  methods: {
    elapsedTime(startTime) {
      let x = new Date(startTime);
      let now = new Date();
      var timeDiff = now - x;
      timeDiff /= 1000;

      var seconds = Math.round(timeDiff);
      timeDiff = Math.floor(timeDiff / 60);

      var minutes = Math.round(timeDiff % 60);
      timeDiff = Math.floor(timeDiff / 60);

      var hours = Math.round(timeDiff % 24);
      timeDiff = Math.floor(timeDiff / 24);

      var days = Math.round(timeDiff % 365);
      timeDiff = Math.floor(timeDiff / 365);

      var years = timeDiff;

      if (years > 0) {
        return years + (years > 1 ? " Years " : " Year ") + "ago";
      } else if (days > 0) {
        return days + (days > 1 ? " Days " : " Day ") + "ago";
      } else if (hours > 0) {
        return hours + (hours > 1 ? " Hrs " : " Hour ") + "ago";
      } else if (minutes > 0) {
        return minutes + (minutes > 1 ? " Mins " : " Min ") + "ago";
      } else if (seconds > 0) {
        return seconds + (seconds > 1 ? " sec ago" : "just now");
      }

      return "Just Now";
    },
    // Method for creating dummy notification time
    randomDate({ hr, min, sec }) {
      let date = new Date();

      if (hr) date.setHours(date.getHours() - hr);
      if (min) date.setMinutes(date.getMinutes() - min);
      if (sec) date.setSeconds(date.getSeconds() - sec);

      return date;
    }
  }
};
</script>


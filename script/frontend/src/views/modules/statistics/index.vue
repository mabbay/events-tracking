<template>
  <div>
    <vs-tabs v-model="tabIndex">
      <vs-tab label="By Event">
      </vs-tab>
      <vs-tab label="By Element">
      </vs-tab>
    </vs-tabs>

    <keep-alive>
      <component :is="cmp" />
    </keep-alive>
  </div>
</template>

<script>
import StatByElement from "./components/StatByElement.vue";
import StatByEvent from "./components/StatByEvent.vue";

export default {
  components: { StatByEvent, StatByElement },
  data: () => ({
    tabIndex: 0,
    tabs: ["stat-by-event", "stat-by-element"],
  }),
  computed: {
    cmp() {
      return this.tabs[this.tabIndex];
    },
  },
  watch: {},
};
</script>

<style>
</style>
<template>
  <div>
    <div class="container p-2 mb-10">
      <div class="flex justify-between">
        <h6 class="text-secondary">{{ "users" | t }}</h6>
        <router-link target="_blank" to="/users/create">{{ "add_user" | t }}</router-link>
      </div>
      <ul class="py-2 border-t-2">
        <li v-for="item in items" :key="item._id" class="mb-2">
          <div
            class="flex flex-no-wrap justify-between items-center p-3 border border-solid border-grey-light">
            <vs-radio v-model="selectedItem" :vs-value="item"></vs-radio>
            <div class="container flex flex-col items-start">
              <h6 class="text-primary w-full p-2 mx-2">{{ item.name }}</h6>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="popup-footer flex bg-white w-full p-2 justify-end">
      <div class="p-1">
        <vs-button :disabled="selectedItem == null" @click="selected">{{
          "confirm" | t
        }}</vs-button>
      </div>
      <div class="p-1">
        <vs-button @click="$emit('onClose')" type="flat" color="secondary">{{
          "cancel" | t
        }}</vs-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [],
      selectedItem: null,
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async selected() {
      this.$emit("onSelect", this.selectedItem);
    },
    async getData() {
      try {
        this.loadingData = true;
        const response = await this.$http.get("/api/users/search", {
          params: this.params,
        });
        this.items = response.data.results;
      } catch (error) {
        this.loadingData = false;
        let message_error = "Error Getting Items";
        this.$vs.notify({
          title: "Error",
          text: message_error,
          color: "danger",
          position: "bottom-center",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
      }
    },
  },
};
</script>

<style>
</style>
<template>
  <div>
    <div class="container">
      <div class="vx-row">
        <div class="vx-col w-full mb-base">
          <div
            class="
              mb-4
              pb-8
              flex flex-col
              bg-white
              font-medium
              text-black
              py-4
              shadow-xl
              rounded-t-sm
              text-xl
            "
          >
            <div class="pl-6">Websites</div>
            <vs-select
              label=""
              v-model="param.website"
              @change="getElements"
              class="w-72 self-center"
            >
              <vs-select-item
                v-for="site in websites"
                :key="site._id"
                :value="site._id"
                :text="site.domain"
              />
            </vs-select>
          </div>
          <si-table
            :config="configList"
            :data="elements"
            :pagination="pagination"
            :queryparam="param"
            :loading="loading"
            @selected="bindselected"
            @changeSizePage="changeSizePage"
            @actions="action"
            @paginate="paginate"
            @onFilter="onFilter"
          ></si-table>
          <p v-if="noElements" class="text-center font-semibold text-lg mt-10">
            No element found ! consider
            <router-link to="elements/create">create new element</router-link>
          </p>
          <!-- <p v-else class="text-center font-semibold text-lg">
            No element found on this website !<br /> consider <router-link to="elements/create">create new element</router-link>
          </p> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from "./config";
import vSelect from "vue-select";

export default {
  components: {
    "v-select": vSelect,
  },
  data() {
    return {
      elements: null,
      pagination: {},
      configList: config.list,
      configFilter: config.list.filters,
      selected: [],
      loading: false,
      param: {
        limit: config.list.options.defaultPageSize,
        page: 1,
        website: null,
        sort: "-creationDate"
      },
      elements: null,
      pagination: {},
    };
  },
  computed: {
    websites() {
      return this.$store.getters["websites/list"];
    },
    noElements() {
      return this.pagination.total === 0;
    },
  },
  created() {
    this.getWebsites();
  },
  methods: {
    async getWebsites() {
      //get all websites
      try {
        this.loading = true;
        await this.$store.dispatch("websites/getAll");
      } catch (error) {
        console.log(error.response);
        this.$vs.notify({
          title: this.$t("error"),
          text: this.$t("unknow error please try again"),
          color: "danger",
          position: "bottom-center",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
      } finally {
        this.loading = false;
      }
    },
    async getElements() {
      //all elements of the current website
      console.log("params", this.param);
      if (!this.param.website) return;
      try {
        this.loading = true;
        const data = await this.$store.dispatch("elements/search", this.param);
        this.elements = data.results;
        // this.elements = data.results;
        delete data.results;
        this.pagination = data;
      } catch (error) {
        console.log(error.response);
        this.$vs.notify({
          title: this.$t("error"),
          text: this.$t("unknow error please try again"),
          color: "danger",
          position: "bottom-center",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
      } finally {
        this.loading = false;
      }
    },
    action(method, callback) {
      if (typeof this[method.action] == "function") {
        callback(true);
        this[method.action](method.obj);
      } else callback(false);
    },
    bindselected(selected) {
      this.selected = selected;
    },
    // view(obj) {
    //   this.$router.push({ name: "users-view", params: { id: obj._id } });
    // },
    edit(obj) {
      this.$router.push({
        name: "elements-update",
        params: { elementId: obj._id },
      });
    },
    add() {
      this.$router.push({ name: "elements-create" });
    },
    async delete(obj, options = { confirmed: false }) {
      if (!options.confirmed) {
        this.$vs.dialog({
          type: "confirm",
          color: "danger",
          title: this.$t("confirm_delete"),
          text: this.$t("confirm_delete_item"),
          accept: () => {
            this.delete(obj, { confirmed: true });
          },
        });
      } else {
        console.log("delete click", obj);
        let url = `/api/elements/delete?id=${obj._id}`;
        try {
          const response = await this.$http.post(url);
          console.log(response);
          this.$vs.notify({
            title: this.$t("success"),
            text: this.$t("deleted_successfuly"),
            color: "success",
            position: "bottom-center",
            iconPack: "feather",
            icon: "icon-check",
          });
          this.getElements();
        } catch (error) {
          console.log(error.response);
          let message_error = "error_deleting";
          if (typeof error.response.data == "string")
            message_error = error.response.data;
          this.$vs.notify({
            title: this.$t("error"),
            text: this.$t(message_error),
            color: "danger",
            position: "bottom-center",
            iconPack: "feather",
            icon: "icon-alert-circle",
          });
        }
      }
    },
    refresh() {
      this.getElements();
    },
    paginate(page) {
      this.param.page = page;
      this.getElements();
    },
    changeSizePage(limit) {
      this.param.limit = limit;
      if (this.param.page == 1) this.getElements();
      else this.param.page = 1;
    },
    onFilter(obj) {
      // get elements tha have at least one of the selected events
      if (obj.events) this.param["events-in"] = obj.events.split(",");
      else delete this.param["events-in"];
      if (obj.label) this.param["label-contains"] = obj.label;
      else delete this.param["label-contains"];
      this.param.page = 1;
      this.getElements();
    },
  },
};
</script>
<style>
.vs-popup {
  position: relative;
}
.popup-footer {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
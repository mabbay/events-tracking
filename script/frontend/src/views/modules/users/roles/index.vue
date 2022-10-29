<template>
  <div>
    <div class="container">
      <div class="vx-row">
        <div class="vx-col w-full mb-base">
          <si-table
            :config="configList"
            :data="roles"
            :pagination="pagination"
            :loading="loading"
            @selected="bindselected"
            @changeSizePage="changeSizePage"
            @actions="action"
            @paginate="paginate"
          ></si-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// TODO: create role --> update role --> list --> role & user --> permission
import config from "./config";
import vSelect from "vue-select";

export default {
  components: {
    "v-select": vSelect,
  },
  data() {
    return {
      configList: config.list,
      configFilter: config.list.filters,
      roles: null,
      pagination: {},
      selected: [],
      loading: false,
      param: {
        limit: config.list.options.defaultPageSize,
        page: 1,
        sort: "-createdAt",
      },
      // popup: { addRole: false, editRole: false },
      popupActive: false,
    };
  },
  created() {
    this.getData();
  },
  computed: {
    currentUser() {
      return this.$store.getters.appActiveUser;
    },
    scriptUserRole() {
      return `sur${this.currentUser.company}`;
    },
  },
  methods: {
    async getData() {
      try {
        this.loading = true;
        const param = {
          ...this.param,
          "name-ne": this.scriptUserRole,
        };
        const data = await this.$store.dispatch("roles/search", param);
        this.roles = data.results;
        delete data.results;
        this.pagination = data;
      } catch (error) {
        console.log("--getData", error.response);
        this.$vs.notify({
          title: this.$t("error"),
          // text: this.$t(message_error),
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
    edit(obj) {
      this.$router.push({ name: "roles-update", params: { roleId: obj._id } });
    },
    add() {
      this.$router.push({ name: "roles-create" });
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
        const url = `/api/roles/delete?id=${obj._id}`;
        try {
          await this.$http.post(url);
          this.$vs.notify({
            title: this.$t("success"),
            text: this.$t("deleted_successfuly"),
            color: "success",
            position: "bottom-center",
            iconPack: "feather",
            icon: "icon-check",
          });
          this.getData();
        } catch (error) {
          // console.log(error.response);
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
      this.getData();
    },
    paginate(page) {
      this.param.page = page;
      // this.getData();
    },
    changeSizePage(limit) {
      this.param.limit = limit;
      // if (this.param.page == 1) this.getData();
      // else this.param.page = 1;
    },
    onFilter(obj) {
      console.log(obj);
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
/* #loading-users{
            width: 200px;
            height: 200px;
            margin: auto;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 5px;
            box-shadow :0px 3px 10px 0px rgba(0,0,0,.1);
        } */
</style>
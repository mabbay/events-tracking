<template>
  <div>
    <div class="container">
      <div class="vx-row">
        <div class="vx-col w-full mb-base">
          <si-table
            :config="configList"
            :data="websites"
            :pagination="{}"
            :loading="loading"
            @selected="bindselected"
            @changeSizePage="changeSizePage"
            @actions="action"
            @paginate="paginate"
          ></si-table>
          <p
            v-if="websites.length == 0"
            class="
              text-center
              font-semibold
              text-xl
              p-16
              text-primary
              mt-8
              bg-white
            "
          >
            You don't have any website yet !
          </p>
        </div>
      </div>
    </div>
    <vs-popup
      class="holamundo"
      :title="popupTitle"
      :active.sync="addWebsitePopup"
    >
      <div class="flex justify-center items-center flex-col">
        <vs-input
          class="inputx w-full"
          placeholder="example.com"
          v-model="website"
        />
        <div class="flex flex-row mt-6 space-x-2">
          <vs-button @click="save()" color="primary" type="filled"
            >Save</vs-button
          >
          <vs-button
            @click="closeAddOrEdditWebsitePopup()"
            color="primary"
            type="filled"
            >Cancel</vs-button
          >
        </div>
      </div>
    </vs-popup>
    <vs-popup
      class="holamundo"
      title="Copy Tracking Script"
      :active.sync="copyDialog"
    >
      <div class="flex justify-center items-center flex-col">
        <label>{{ script }}</label>
        <vs-input
          class="inputx w-full"
          placeholder="example.com"
          v-model="script"
          type="text"
          id="scriptInput"
        />
        <div class="flex flex-row mt-6 space-x-2">
          <vs-button @click="copyScript()" color="primary" type="filled"
            >Copy</vs-button
          >
          <vs-button
            @click="openOrCloseCopyPopup()"
            color="primary"
            type="filled"
            >Cancel</vs-button
          >
        </div>
      </div>
    </vs-popup>
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
      script: "",
      copyDialog: false,
      editOrCreate: null,
      popupTitle: null,
      websiteId: null,
      website: null,
      addWebsitePopup: false,
      configList: config.list,
      configFilter: config.list.filters,
      selected: [],
      loading: false,
      param: {
        limit: config.list.options.defaultPageSize,
        page: 1,
      },
    };
  },
  async mounted() {
    this.getData();
  },
  computed: {
    websites() {
      let data = this.$store.getters["websites/list"];
      console.log(data);
      return data;
    },
  },
  methods: {
    async getData(param = {}) {
      try {
        this.loading = true;
        await this.$store.dispatch("websites/search", this.param);
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error.response);
      }
    },
    formatdata(data = []) {
      for (const key in data) {
      }
      return data;
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
    view(obj) {
      this.$router.push({ name: "websites-view", params: { id: obj._id } });
    },
    edit(obj) {
      this.editOrCreate = "edit";
      this.addWebsitePopup = !this.addWebsitePopup;
      this.popupTitle = "Edit Website";
      console.log(obj);
      this.website = obj.domain;
      this.websiteId = obj._id;
    },
    add() {
      this.editOrCreate = "create";
      this.website = "";
      this.addWebsitePopup = !this.addWebsitePopup;
      this.popupTitle = "Add New Website";
    },
    async save() {
      let errorMessage = "error";
      console.log(this.website);
      if (this.website === "") {
        errorMessage = "it's empty !";
      } else if (
        !/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(
          this.website
        )
      ) {
        errorMessage = "not a valid domain name !";
      }
      console.log("cl");
      if (this.editOrCreate === "edit") {
        try {
          const response = await this.$http.put(
            `/api/websites/update/?id=${this.websiteId}`,
            { domain: this.website }
          );
          console.log(response);
          this.$vs.notify({
            title: this.$t("success"),
            text: this.$t("updating_successfuly"),
            color: "success",
            position: "bottom-center",
            iconPack: "feather",
            icon: "icon-check",
          });
        } catch (error) {
          this.$vs.notify({
            title: this.$t("error"),
            text: this.$t(errorMessage),
            color: "danger",
            position: "bottom-center",
            iconPack: "feather",
            icon: "icon-alert-circle",
          });
        } finally {
          this.refresh();
          this.closeAddOrEdditWebsitePopup();
        }
      } else {
        try {
          const response = await this.$http.post(`/api/websites/create`, {
            domain: this.website,
          });
          console.log(response);
          this.$vs.notify({
            title: this.$t("success"),
            text: this.$t("created_successfuly"),
            color: "success",
            position: "bottom-center",
            iconPack: "feather",
            icon: "icon-check",
          });
        } catch (error) {
          this.$vs.notify({
            title: this.$t("error"),
            text: this.$t(errorMessage),
            color: "danger",
            position: "bottom-center",
            iconPack: "feather",
            icon: "icon-alert-circle",
          });
        } finally {
          this.refresh();
          this.closeAddOrEdditWebsitePopup();
        }
      }
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
        let url = `/api/websites/delete?id=${obj._id}`;
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
          this.getData();
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
    copy(obj) {
      this.script = `\<script defer src="http://localhost:3077/api/script/${obj._id}"\>\<\/script\>`;
      document.getElementById("scriptInput").setAttribute("type", "hidden");
      this.openOrCloseCopyPopup();
    },
    copyScript() {
      let scriptInput = document.getElementById("scriptInput");
      scriptInput.setAttribute("type", "text");
      scriptInput.select();
      document.execCommand("copy");
      scriptInput.setAttribute("type", "hidden");
      this.$vs.notify({
        title: this.$t("success"),
        text: this.$t("copied successfuly"),
        color: "success",
        position: "bottom-center",
        iconPack: "feather",
        icon: "icon-check",
      });
      this.openOrCloseCopyPopup();
    },
    openOrCloseCopyPopup() {
      this.copyDialog = !this.copyDialog;
    },
    refresh() {
      this.getData();
    },
    paginate(page) {
      this.param.page = page;
      this.getData();
    },
    changeSizePage(limit) {
      this.param.limit = limit;
      if (this.param.page == 1) this.getData();
      else this.param.page = 1;
    },
    onFilter(obj) {
      console.log(obj);
    },
    closeAddOrEdditWebsitePopup() {
      this.addWebsitePopup = false;
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

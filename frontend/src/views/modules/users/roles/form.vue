<template>
  <div id="supp_form">
    <si-progress-bar v-if="loading.page" />
    <div v-if="!loading.page" class="container">
      <vx-card>
        <form class="grid grid-cols-1 gap-5">
          <!-- name -->
          <div class="w-full">
            <vs-input v-model.trim="role.name" :label="'name' | t" class="w-full" />
            <small class="text-danger">{{ errors.name }}</small>
          </div>
          <!-- description -->
          <div class="w-full">
            <vs-textarea
              v-model.trim="role.description"
              :label="'description' | t"
              class="w-full"
            />
            <small class="text-danger">{{ errors.description }}</small>
          </div>
          <!-- model -->
          <table>
            <thead>
              <tr>
                <th>Model</th>
                <th
                  v-for="(acc, index) in access"
                  :key="index"
                  class="text-center"
                >
                  {{ acc | t }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(module, index) in modules" :key="index">
                <td class="flex">
                  <vs-checkbox
                    v-model="selected.modules"
                    :vs-value="module"
                  /><span class="font-semibold">{{ module | t }}</span>
                </td>
                <td v-for="(acc, id) in access" :key="id">
                  <div class="flex justify-center">
                    <vs-checkbox
                      v-model="selected.permissions[module].access[acc]"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- <div class="grid grid-cols-5 gap-5">
            <p class="font-semibold">Model</p>
            <p v-for="(acc, index) in access" :key="index" class="text-center font-semibold">
              {{ acc }}
            </p>
            <template v-for="(module, index) in modules">
              <div class="flex" :key="index">
                <vs-checkbox
                  v-model="selected.modules"
                  :vs-value="module"
                /><span class="font-semibold">{{ module }}</span>
              </div>
              <div
                v-for="(acc, id) in access"
                :key="id"
                class="flex justify-center"
              >
                <vs-checkbox
                  v-model="selected.permissions[module].access[acc]"
                />
              </div>
            </template> 
          </div>-->
        </form>
      </vx-card>
    </div>
    <si-form-bar v-if="!loading.page">
      <template v-slot:content>
        <div class="flex flex-nowrap justify-between items-center">
          <h5 class="text-secondary">{{ "save_change" | t }}</h5>
          <vs-button
            :disabled="loading.page"
            color="primary"
            type="filled"
            @click="onSubmit"
          >
            {{ "confirm" | t }}
          </vs-button>
        </div>
      </template>
    </si-form-bar>
  </div>
</template>
<script>
import validate from "@/validation";
import vSelect from "vue-select";
export default {
  components: {
    "v-select": vSelect,
  },
  props: {
    roleId: { type: String },
  },
  data() {
    return {
      role: {
        name: "",
        description: "",
      },
      errors: {}, // validation errors
      loading: {
        page: false,
        submit: false,
      },
      modules: ["elements", "websites", "users", "actions", "pageViews"],
      access: ["create", "read", "update", "delete"],
      selected: { modules: [], permissions: {} },
    };
  },
  computed: {
    // data that's going to be sent to the server
    roleData() {
      const data = {};
      data.name = this.role.name;
      if (this.role.description) data.description = this.role.description;
      data.permissions = [];
      for (const model of this.selected.modules) {
        data.permissions.push(this.selected.permissions[model]);
      }
      return data;
    },
    roleDataValid() {
      return Object.keys(this.errors).length === 0;
    },
    isUpdate() {
      return !!this.roleId;
    },
    fullAccess() {
      const res = {};
      for (const access of this.access) {
        res[access] = true;
      }
      return res;
    },
    noAccess() {
      const res = {};
      for (const access of this.access) {
        res[access] = false;
      }
      return res;
    },
  },
  watch: {
    "selected.modules": function (newValue, oldValue) {
      // if new model is selected
      if (newValue.length > oldValue.length) {
        const insertedModule = newValue[newValue.length - 1];
        const access = this.selected.permissions[insertedModule].access;
        const hasAnAccess = Object.values(access).some((v) => v === true);
        if (!hasAnAccess)
          this.selected.permissions[insertedModule].access = {
            ...this.fullAccess,
          };
      } else if (newValue.length < oldValue.length) {
        const deletedModule = oldValue.find((v) => !newValue.includes(v));
        this.selected.permissions[deletedModule].access = { ...this.noAccess };
      }
    },
    "role.name": function (value) {
      this.onFieldValueChange({ field: "name", value });
    },
    "role.description": function (value) {
      this.onFieldValueChange({ field: "description", value });
    },
    // "user.email": function (value) {
    //   this.onFieldValueChange({ field: "email", value });
    // },
    // "user.password": function (value) {
    //   if (this.isUpdate && (!value || value === "")) {
    //     delete this.user.password;
    //     delete this.errors.password;
    //   } else this.onFieldValueChange({ field: "password", value });
    // },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      // init permissions
      const permissions = {};
      for (const module of this.modules) {
        permissions[module] = { module, access: { ...this.noAccess } };
      }
      this.selected.permissions = permissions;
      if (this.isUpdate) this.getRole();
    },
    // update the value of selected.modules & selected.permissions based on the received role
    setSelectedParam(role) {
      const modules = [];
      for (const { module, access } of role.permissions) {
        this.selected.permissions[module].access = { ...access };
        modules.push(module);
      }
      this.selected.modules = modules;
    },
    async getRole() {
      try {
        this.loading.page = true;
        const response = await this.$http.get(`/api/roles/get`, {
          params: { id: this.roleId },
        });
        const role = response.data;
        this.setSelectedParam(role);
        this.role = role;
      } catch (error) {
        this.$vs.notify({
          title: this.$t("error"),
          // text: this.$t(""),
          color: "danger",
          position: "bottom-center",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
      } finally {
        this.loading.page = false;
      }
    },
    formatData(data = {}) {
      return data;
    },
    onFieldValueChange({ field, value, namespace = "roles" }) {
      const { errorMess } = validate({ field, value, namespace });
      if (errorMess) this.errors[field] = errorMess;
      else delete this.errors[field];
    },
    validateRoleData() {
      const errors = {};
      for (const field in this.roleData) {
        const { isValid, errorMess } = validate({
          field,
          value: this.roleData[field],
          namespace: "roles",
        });
        if (isValid) continue;
        errors[field] = errorMess;
      }
      return errors;
    },
    async onSubmit() {
      this.errors = this.validateRoleData();
      if (!this.roleDataValid) return;
      //todo format data before send it
      this.loading.submit = true;
      const url = this.isUpdate
        ? `/api/roles/update/?id=${this.roleId}`
        : `/api/roles/create`;
      try {
        const response = await this.$http.post(url, this.roleData); //! role needs permissions
        // console.log(response);
        if (this.isUpdate) {
          this.$vs.notify({
            title: this.$t("success"),
            text: this.$t("updating_successfuly"),
            color: "success",
            position: "bottom-center",
            iconPack: "feather",
            icon: "icon-check",
          });
        } else {
          this.$vs.notify({
            title: this.$t("success"),
            text: this.$t("creating_successfuly"),
            color: "success",
            position: "bottom-center",
            iconPack: "feather",
            icon: "icon-check",
          });
          this.$router.push({
            name: "roles-update",
            params: { roleId: response.data._id },
          });
        }
      } catch (error) {
        // console.log("--submit", error.response);
        let errMess;
        if (error.response) errMess = this.formatErrorMess(error.response.data);
        else errMess = this.isUpdate ? "error_updating" : "error_creating";
        // if (typeof error.response.data.errors == "object") {
        //   let errors = error.response.data.errors;
        //   let key = Object.keys(errors)[0];
        //   errMess = `${key}_${errors[key]}`;
        // }
        this.$vs.notify({
          title: this.$t("error"),
          text: this.$t(errMess),
          color: "danger",
          position: "bottom-center",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
      } finally {
        this.loading.submit = false;
      }
    },
    formatErrorMess(errMess) {
      // if (errMess.includes("email already taken")) return "email already taken";
      return errMess;
    },
  },
};
</script>
<style>
#supp_form .style-chooser .vs__dropdown-menu {
  max-height: 20px !important;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}

#supp_form .style-chooser .vs__selected-options {
  overflow-x: hidden;
}

#supp_form .style-chooser .vs__selected {
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
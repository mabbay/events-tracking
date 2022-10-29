<template>
  <div id="supp_form">
    <si-progress-bar v-if="loading.page" />
    <div v-if="!loading.page" class="container">
      <vx-card>
        <!-- first name -->
        <form class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="w-full">
            <vs-input
              v-model="user.firstName"
              label="First Name"
              class="w-full"
            />
            <small class="text-danger">{{ errors.firstName }}</small>
          </div>
          <!-- last name -->
          <div class="w-full">
            <vs-input
              v-model="user.lastName"
              label="Last Name"
              class="w-full"
            />
            <small class="text-danger">{{ errors.lastName }}</small>
          </div>
          <!-- email -->
          <div class="w-full">
            <vs-input class="w-full" label="Email" v-model="user.email" />
            <small class="text-danger">{{ errors.email }}</small>
          </div>
          <!-- password -->
          <div class="w-full">
            <vs-input
              type="password"
              class="w-full"
              label="Password"
              v-model="user.password"
            />
            <small class="text-danger">{{ errors.password }}</small>
          </div>
        </form>
        <!--role -->
        <div class="mt-10">
          <vs-checkbox v-model="editRoleEnabled">Edit Role</vs-checkbox>
          <div v-if="editRoleEnabled" class="grid grid-cols-2 items-center">
            <div class="flex justify-center">
              <vs-checkbox v-model="selected.isAdmin">Admin</vs-checkbox>
            </div>
            <!-- or -->
            <div class="grid grid-cols-2 items-end gap-5">
              <vs-select
                label="Roles"
                :disabled="selectRoleDisabled"
                v-model="selected.role"
              >
                <vs-select-item
                  :key="index"
                  :value="role._id"
                  :text="role.name"
                  v-for="(role, index) in roles"
                />
              </vs-select>
              <vs-button @click="createRole">Create New Role</vs-button>
            </div>
          </div>
        </div>
        <!-- {{ user }} -->
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
    userId: { type: String },
  },
  data() {
    return {
      user: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        isAdmin: false,
        // role: null,
      },
      errors: {}, // validation errors
      loading: {
        page: false,
        submit: false,
      },
      isMediaImagesActive: false,
      editRoleEnabled: false,
      roles: null,
      selected: { role: null, isAdmin: false },
    };
  },
  computed: {
    userDataValid() {
      return Object.keys(this.errors).length === 0;
    },
    isUpdate() {
      return !!this.userId;
    },
    currentUser() {
      return this.$store.getters.appActiveUser;
    },
    scriptUserRole() {
      return `sur${this.currentUser.company}`;
    },
    selectRoleDisabled() {
      return this.selected.isAdmin;
    },
    // user data that's going to be sent to the server
    userData() {
      const data = this.user;
      if (!this.editRoleEnabled) return data;
      data.isAdmin = this.selected.isAdmin;
      data.role = this.selected.role;
      return data;
    },
  },
  watch: {
    "user.firstName": function (value) {
      this.onFieldValueChange({ field: "firstName", value });
    },
    "user.lastName": function (value) {
      this.onFieldValueChange({ field: "lastName", value });
    },
    "user.email": function (value) {
      this.onFieldValueChange({ field: "email", value });
    },
    "user.password": function (value) {
      if (this.isUpdate && (!value || value === "")) {
        delete this.user.password;
        delete this.errors.password;
      } else this.onFieldValueChange({ field: "password", value });
    },
    "user.isAdmin": function (value) {
      if (value) delete this.user.role;
    },
    editRoleEnabled: function (value) {
      if (!value) {
        this.selected.isAdmin = this.user.isAdmin;
        this.selected.role = this.user.role;
      }
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      if (this.isUpdate) this.getUser();
      this.getRoles();
    },
    async getUser() {
      try {
        this.loading.page = true;
        const response = await this.$http.get(`/api/users/get`, {
          params: { id: this.userId },
        });
        this.user = this.formatData(response.data);
        this.selected.isAdmin = this.user.isAdmin;
        this.selected.role = this.user.role;
        // console.log(this.user);
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
    async getRoles() {
      try {
        this.loading.page = true;
        const param = { "name-ne": this.scriptUserRole, sort: "-createdAt" };
        const data = await this.$store.dispatch("roles/getAll", param);
        this.roles = data.results;
      } catch (err) {
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
      delete data.password;
      return data;
    },
    onFieldValueChange({ field, value }) {
      const { errorMess } = validate({ field, value });
      if (errorMess) this.errors[field] = errorMess;
      else delete this.errors[field];
    },
    validateUserData() {
      const errors = {};
      for (const field in this.user) {
        const { isValid, errorMess } = validate({
          field,
          value: this.user[field],
        });
        if (isValid) continue;
        errors[field] = errorMess;
      }
      return errors;
    },
    async onSubmit() {
      this.errors = this.validateUserData();
      if (!this.userDataValid) return;
      this.loading.submit = true;
      const url = this.isUpdate
        ? `/api/users/update/?id=${this.userId}`
        : `/api/users/invite`;
      try {
        const response = await this.$http.post(url, this.userData);
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
            name: "users-update",
            params: { userId: response.data._id },
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
      if (errMess.includes("email already taken")) return "email already taken";
      return errMess;
    },
    createRole() {
      this.$router.push({ name: "roles-create"});
    }
  },
};
</script>
<style>
#supp_form .style-chooser .vs__dropdown-menu {
  max-height: 120px !important;
  overflow-x: hidden;
  text-overflow: ellipsis;
  /* white-space: normal; */
}

#supp_form .style-chooser .vs__selected-options {
  overflow-x: hidden;
}

#supp_form .style-chooser .vs__selected {
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
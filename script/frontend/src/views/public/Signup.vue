<template>
  <div class="flex flex-col justify-center items-center pt-10">
    <vx-card class="w-1/2 flex flex-col justify-center items-center">
      <div class="flex flex-col items-center">
        <logo class="w-20 h-20" />
        <p class="text-lg mt-5 mb-5">Create an Account</p>
      </div>
      <div class="text-center color" v-if="!!errorMess">{{ errorMess }}</div>
      <form
        @submit.prevent="signup"
        class="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <div class="w-full">
          <vs-input label="First Name" v-model="user.firstName" />
          <span class="color">{{ errors.firstName }}</span>
        </div>
        <div class="w-full">
          <vs-input label="Last Name" v-model="user.lastName" />
          <span class="color">{{ errors.lastName }}</span>
        </div>
        <div class="w-full md:col-span-2">
          <vs-input
            label="E-mail"
            v-model="user.email"
            class="w-full md:col-span-2"
          />
          <span class="color">{{ errors.email }}</span>
        </div>
        <div class="w-full md:col-span-2">
          <vs-input
            type="password"
            label="Password"
            v-model="user.password"
            class="w-full md:col-span-2"
          />
          <span class="color">{{ errors.password }}</span>
        </div>
        <div class="w-full md:col-span-2">
          <vs-input
            label="Company (optional)"
            v-model="user.company"
            class="w-full md:col-span-2"
          />
          <span class="color">{{ errors.company }}</span>
        </div>
        <!-- register button-->
        <vs-button class="mb-4 mt-2" type="border" @click="signup"
          >Register</vs-button
        >
      </form>
      <div class="space-y-5 justify-start border-2 border-black">
        <router-link :to="{ name: 'login' }"
          >You have an account ?Login</router-link
        >
      </div>
    </vx-card>
  </div>
</template>
</template>

<script>
import Logo from "../../components/Logo.vue";
import validate from "../../validation";

export default {
  components: { Logo },
  data() {
    return {
      user: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        company: "",
      },
      errors: {}, // validation errors
      errorMess: null, // final error mess exemple: email already taken, ...
    };
  },
  computed: {
    userDataValid() {
      return Object.keys(this.errors).length === 0;
    },
  },
  watch: {
    errorMess() {
      this.formatErrorMess();
    },
  },
  methods: {
    async signup() {
      this.errorMess = null;
      this.validateUserData();
      // console.log("valid", this.userDataValid);
      if (!this.userDataValid) return; // user data not valid
      console.log("sign up");
      this.formatUserData();
      try {
        await this.$store.dispatch("signup", this.user);
        this.$router.push({ name: "dashboard" });
      } catch (err) {
        if (err.response) this.errorMess = err.response.data;
        else this.errorMess = "something went wrong, please try again";
      }
      console.log(this.errorMess);
    },
    validateUserData() {
      this.errors = {};
      for (let field in this.user) {
        const { isValid, errorMess } = validate({
          field,
          value: this.user[field],
        });
        if (isValid) continue;
        this.errors[field] = errorMess;
      }
    },
    // delete optional fields in case they are empty to avoid validation errors on the server
    formatUserData() {
      if (this.user.company === "") delete this.user.company;
    },
    // some errors mess are ugly, so we try to take nescessary part of them
    formatErrorMess() {
      if (!this.errorMess) return;
      if (this.errorMess.includes("email already taken"))
        this.errorMess = "email already taken";
    },
  },
};
</script>

<style lang="scss" scoped>
.color {
  color: red;
}
</style>
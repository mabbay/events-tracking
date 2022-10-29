<template>
  <div
    class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center"
    id="page-login"
  >
    <div class="vx-col sm:w-1/4">
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">
          <div class="vx-row no-gutter justify-center items-center">
            <div
              class="vx-col sm:w-full md:w-full lg:w-full rounded-lg shadow-lg"
            >
              <div class="p-8 login-tabs-container">
                <img
                  class="logo"
                  src="https://storeino.b-cdn.net/assets/img/storeino-logo-notext.png"
                />
                <div class="vx-card__title mb-4">
                  <h2 class="mt-8 mb-1 text-center font-bold">Welcome back</h2>
                  <p class="text-center mt-4">
                    Enter your credentials to login
                  </p>
                </div>
                <div class="mt-3 mb-3">
                  <span class="color" v-if="errorMess">
                    {{errorMess}}
                  </span>
                </div>
                <form @submit.prevent="login" method="post">
                  <div class="clearfix">
                    <div class="mt-6">
                      <vs-input
                        type="email"
                        required
                        label-placeholder="Email"
                        name="email"
                        placeholder="Email"
                        v-model="email"
                        class="w-full"
                      />
                      <div>
                        <span class="color" v-if="!!errors.email">{{
                          errors.email
                        }}</span>
                      </div>
                    </div>
                    <div class="mt-6">
                      <vs-input
                        type="password"
                        name="Password"
                        label-placeholder="Password"
                        placeholder="Password"
                        v-model="password"
                        class="w-full"
                      />
                      <div>
                        <span class="color" v-if="!!errors.password">{{
                          errors.password
                        }}</span>
                      </div>
                    </div>
                    <vs-button class="mb-4 mt-2" @click="login" type="border"
                      >Login</vs-button
                    >
                    <div class="flex flex-col space-y-5">
                      <router-link to>Forgot Password?</router-link>
                      <router-link :to="{ name: 'signup' }"
                        >Don't have an account ? Sign Up</router-link
                      >
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      errors: {}, // validation error
      notUser: false,
      errorMess: null
    };
  },
  computed: {},
  methods: {
    checkinputs() {
      this.errors = {};
      this.notUser = false; this.errorMess = null;
      // email validation
      if (this.email == "") this.errors.email = "email is required";
      else if (!this.validEmail(this.email))
        this.errors.email = "email not valid";
      // password validation
      if (this.password == "") this.errors.password = "password is required";
      // if no errors submit
      // if (Object.keys(this.errors).length == 0) this.login();
    },
    async login() {
      this.checkinputs();
      // if no error submit
      if (Object.keys(this.errors).length !== 0) return;
      console.log("--login--");
      try {
        await this.$store.dispatch("login", {
          email: this.email,
          password: this.password,
        });
        this.$router.push({ name: "dashboard" });
      } catch (err) {
        console.log("--err-login--");
        // invalid email or password
        if (err.response) this.errorMess = err.response.data;
        // request made but no response received
        else this.errorMess = 'something went wrong, please try again';
      }
    },
    validEmail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
  },
};
</script>
<style lang="scss" scoped>
.color {
  color: red;
}
.logo {
  width: 6rem;
  margin: auto;
}
</style>

<template>
  <div
    class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center"
    id="page-login"
  >
    <div class="vx-col sm:w-1/4">
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">
          <div class="vx-row no-gutter justify-center items-center">
            <div class="vx-col sm:w-full md:w-full lg:w-full rounded-lg shadow-lg">
              <div class="p-8 login-tabs-container">
                <img
                  class="logo"
                  src="https://storeino.b-cdn.net/assets/img/storeino-logo-notext.png"
                />
                <div class="vx-card__title mb-4">
                  <p class="text-center mt-4">Enter your password</p>
                </div>

                <form @submit.prevent="submit" method="post">
                  <div class="clearfix">
                    <div class="mt-6">
                      <vs-input
                        type="password"
                        label-placeholder="password"
                        name="password"
                        placeholder="Password"
                        v-model="password"
                        class="w-full"
                      />
                      <div>
                        <span class="color" v-if="passError">{{passError}}</span>
                      </div>
                    </div>
                    <div class="mt-6">
                      <vs-input
                        type="password"
                        name="confirmPassword"
                        label-placeholder="confirmPassword"
                        placeholder="ConfirmPassword"
                        v-model="confirmPassword"
                        class="w-full"
                      />
                      <div>
                        <span class="color" v-if="confirmError">{{confirmError}}</span>
                      </div>
                    </div>
                    <div v-if="!confirmPassword" class="mt-6"></div>
                    <vs-button class="mb-4 mt-2" @click="checkinputs" type="border">Register</vs-button>
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
      password: "",
      confirmPassword: "",
      passError: null,
      confirmError: null
    };
  },
  methods: {
    checkinputs() {
      if (this.password == "") {
        this.passError = "Password is required";
      }
      if (this.password !== "") {
        this.passError = null;
      }
      if (this.confirmPassword == "") {
        this.confirmError = "confirmPassword is required";
      }
      if (this.confirmPassword !== "") {
        this.confirmError = null;
      }
      if (this.passwordError == null && this.confirmError == null) {
        this.submit();
      }
    },
    submit() {
      alert("ok");
    }
  }
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
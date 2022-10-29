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
                        type="email"
                        name="email"
                        label-placeholder="Email"
                        placeholder="Email"
                        v-model="email"
                        class="w-full"
                      />
                      <div>
                        <span class="color" v-if="emailError">{{emailError}}</span>
                      </div>
                    </div>
                    <div v-if="!email" class="mt-6"></div>
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
     
      email:"",
      emailError: null,
     
    };
  },
  methods: {
    checkinputs() {
      if (this.email == "") {
        this.emailError = "Password is required";
      }
      if (this.email !== "") {
        this.emailError = null;
      }
      if (
        this.email &&
        !/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(this.email)
      ) {
        this.emailError = `${this.email} is not a valid email address`;
      }
      if(
        this.emailError==null
      )
      {
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
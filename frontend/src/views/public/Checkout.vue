<template>
  <div class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center">
    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4">
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">
          <div class="vx-row no-gutter">
            <div class="vx-col sm:w-full md:w-full lg:w-1/2 mx-auto self-center d-theme-dark-bg">
              <div class="px-8 pt-8 register-tabs-container">
                <div class="vx-card__title mb-4">
                  <h4 class="mb-4">Sing up.</h4>
                  <p>Fill the below form to create a new account.</p>
                </div>
                <!--satrt form -->
                <form @submit.prevent="submit" class="pt-8" method="post">
                  <div class="clearfix">
                    <div class="pb-4">
                      <vs-input  name="firstname" :placeholder="data.firstname.label" v-model="data.firstname.value" class="w-full" />
                      <div>
                        <small class="color" v-if="data.firstname.validation.error">{{data.firstname.validation.error}}</small>
                      </div>
                    </div>
                    <div class="pb-4">
                      <vs-input name="lastname" type="lastname"  :placeholder="data.lastname.label" v-model="data.lastname.value" class="w-full" />
                      <div>
                        <small class="color" v-if="data.lastname.validation.error">{{data.lastname.validation.error}}</small>
                      </div>
                    </div>
                    <div class="pb-4">
                      <vs-input name="email" type="email"  :placeholder="data.email.label" v-model="data.email.value"
                        class="w-full" />
                      <div>
                        <small class="color" v-if="data.email.validation.error">{{data.email.validation.error}}</small>
                      </div>
                    </div>
                    <div class="pb-4">
                      <div class="flex">
                        <div class="">
                          <select class="vx-col styleselect w-auto" name="cars" id="cars" v-model="data.codeNumber.value">
                            <option v-for="(item,key) in values" :key="key" :value="item.value">{{item.text}}</option>
                          </select>
                        </div>
                        <div class="w-5" ></div>
                        <div class="w-full">
                          <vs-input type="number" name="Phonenumber" :placeholder="data.phonenumber.label" v-model="data.phonenumber.value"
                            class="rounded-full d-block" />
                        </div>
                      </div>
                      <small class="color" v-if="data.phonenumber.validation.error">{{ data.phonenumber.validation.error }}</small>
                    </div>
                    <div class="pb-4">
                      <vs-input type="companyname" name="companyname" 
                        :placeholder="data.companyname.label" v-model="data.companyname.value" class="w-full" />
                      <div>
                        <small class="color" v-if="data.companyname.validation.error">{{ data.companyname.validation.error }}</small>
                      </div>
                    </div>
                    <vs-button class="mb-4 mt-2" button="submit"  type="border">Register</vs-button>
                  </div>
                </form>
                <!-- end form -->
              </div>
            </div>
            <div class="vx-col hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto self-center">
              <img src="https://storeino.com/images/front.svg" alt="register" class="w-full mx-auto p-4" />
            </div>
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>

<script>
  export default {
    components: {},
    data() {
      return {
        data:{
          firstname: {
            value:"",
            label:"Firstname",
            validation:{
              trim:true,
              required:true,
              min:2,
            },
          },
          lastname: {
            value:"",
            label:"Lastname",
            validation:{
              trim:true,
              required:true,
              min:2,
            }
          },
          email: {
            value:"",
            label:"Email",
            validation:{
              required:true,
              email:true,
            }
          },
          codeNumber:{
            value:"212",
            validation:{},
          },
          phonenumber: {
            value:null,
            label:"Phone number",
            validation:{
              required:true,
              phone:true,
            }
          },
          companyname: {
            value:"",
            label:"Company",
            validation:{
              required:true,
            }
          },
        },
        values: [
          { value: "212", text: "+212" },
          { value: "213", text: "+213" }
        ],
        codeNumber:"212",
        ready:false,
      };
    },
    methods: {
      checkinputs() {
        if (this.firstname == "") {
          this.fnamError = "First Name is required";
        }
        if (this.firstname != "") {
          this.fnamError = null;
        }
        if (this.lastname == "") {
          this.lnameError = "Last Name is required";
        }
        if (this.lastname !== "") {
          this.lnameError = null;
        }
        if (this.email == "") {
          this.lemailError = "Email is required";
        }
        if (this.email !== "") {
          this.lemailError = null;
        }
        if (this.phonenumber == "") {
          this.lnumberError = "Phone Number is required";
        }
        if (this.phonenumber !== "") {
          this.lnumberError = null;
        }
        if (this.companyname == "") {
          this.lcompanyError = "Company Name is required";
        }
        if (this.companyname !== "") {
          this.lcompanyError = null;
        }
        if (this.email && !/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(this.email)) {
          this.lemailError = `${this.email} is not a valid email address`;
        }
        if (this.phonenumber && !/^[0-9]{9,12}/.test(this.phonenumber)) {
          this.lnumberError = `${this.phonenumber} is not a valid phone number`;
        }
        if (
          this.lnameError == null &&
          this.fnameError == null &&
          this.lemailError == null &&
          this.lnumberError == null &&
          this.lcompanyError == null
        ) {
          this.submit();
        }
      },
      validate(){
        let isValide = true;
        for (const key in this.data) {
          this.$set(this.data[key].validation, 'error', null);
          const validate = this.data[key].validation;
          if (validate.trim) this.data[key].value = this.$_.trim(this.data[key].value);
          if (validate.required && !this.data[key].value) {
              this.$set(this.data[key].validation, 'error', `${this.data[key].label} is required`);
              isValide = false;
          }
          if (validate.isNumber && !this.$_.isNumber(this.data[key].value)) {
              // this.data[key].validation.error = `${this.data[key].label} is not number`;
              this.$set(this.data[key].validation, 'error', `${this.data[key].label} is not number`);
              isValide = false;
          }
          if (validate.max && this.data[key].value < validate.max && this.data[key].value) {
            this.data[key].validation.error = `Value ${this.data[key].label} must be greater than ${validate.max - 1}.`;
            isValide = false;
          }
          if (validate.min && this.data[key].value > validate.min && this.data[key].value) {
            this.data[key].validation.error = `Value ${this.data[key].label} must be less than ${validate.min + 1}.`;
            isValide = false;
          }
          if (validate.phone && !/^[0-9]{9,12}/.test(this.data[key].value)) {
            this.data[key].validation.error = `${this.data[key].label} is not a valid phone number`;
            isValide = false;
          }
          if (validate.email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.data[key].value )) {
            this.data[key].validation.error = `${this.data[key].label} is not a valid email address`;
            isValide = false;
          }
        }
        return isValide;
      },
      genarateData(){
        let data = {
          company:{
            name : this.data.companyname.value,
          },
          user:{
            firstname : this.data.firstname.value,
            lastname : this.data.lastname.value,
            email : this.data.email.value,
            phones : [{
              number: `${this.data.codeNumber.value}${this.data.phonenumber.value}`
            }],
          }
        };
        // for (const key in this.data) {
        //   data[key] = this.data[key].value;
        // }
        return data;
      },
      async submit() {
        var isValidate = this.validate();
        if(isValidate){
          console.log(this.genarateData());
          const data =  this.genarateData();
          try {
            const target = this.$route.query.target ? this.$route.query.target : 'stores';
            window.location.href = `/${target}/create`;
            // this.$router.push(`/${target}/create`);
            // const response =  await this.$http.post('/users/create',data);
            // window.localStorage.setItem('x-auth-token',response.data.token);

            // console.log(response);
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
  };
</script>

<style lang="scss">
  .register-tabs-container {
    min-height: 517px;

    
  }
  .con-tab {
      padding-bottom: 20px;
    }
  .styleselect {
    border: 1px solid #cccccc;
    width: 100%;
    display: block;
    padding: 9px;
    border-radius: 5px;
  }

  .d-block {
    width: 100%;
    display: block;
  }

  .color {
    color: red;
  }
</style>
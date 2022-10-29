<template>
  <div class="Form">
    <form @submit.prevent="submit" method="post" :id="config.ref" v-if="ready">
      <div :class="config.class ? config.class:''">
        <si-from-group v-for="(element,key) in formElements" :key="key" :inputStyle="config.inputStyle"  :element="element" :field="key" @onChange="onChange"></si-from-group>
      </div>
      <div class="vx-row">
        <div class="vx-col w-full">
          <div class="flex" :class="`justify-${config.buttons.justify}`">
            <vs-button v-for="(button,key) in buttons" :key="key" @click="onClick(button.action)"
              :radius="button.radius" :size="button.size" :color="button.color" :text-color="button.textColor"
              :icon-pack="button.iconPack" :icon="button.icon" :type="button.type" :class="button.class">
              <span v-if="button.text">{{ button.text }}</span>
            </vs-button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
  import SiFormGroup from "./components/SiFormGroup";
  export default {
    name: "si-form",
    components: {
      "si-from-group": SiFormGroup
    },
    props: {
      config: {
        required: true,
        isnumber: true,
        min: Number,
        type: Object
      },
      elements: {
        required: true,
        type: Object
      },
      buttons: {
        required: true,
        type: Array
      }
    },
    data() {
      return {
        ready: true,
        formData: {},
        formElements: this.elements
      };
    },
    mounted() {
      for (const key in this.elements) {
        this.formData[key] = this.elements[key].value;
      }
    },
    methods: {
      onChange(field, value) {
        this.formElements[field].value = value;
        this.formData[field] = value;
      },
      onClick: function (action) {
        if (this.hasOwnProperty(action)) this[action]();
        else console.log("Action not found");
      },
      reset() {
        for (const key in this.formElements) {
          this.formElements[key].value = null;
          if (this.formElements[key].validate)
            this.formElements[key].validate.error = null;
          if (this.formElements[key].multiple)
            this.formElements[key].value = [];
          if (this.formElements[key].type == "StartEndDate")
            this.formElements[key].value = { from: "", to: "" };
        }
        this.refresh();
      },
      submit() {
        const isValid = this.validate();
        if (isValid) this.$emit("onSubmit", this.simplified());
      },
      validate() {
        let isValide = true;
        for (const key in this.formElements) {
          if (this.formElements[key].validate) {
            this.formElements[key].validate.error = null;
            const validate = this.formElements[key].validate;
            if (validate.trim) this.formElements[key].value = this.$_.trim(this.formElements[key].value);

            if (validate.required && !this.formElements[key].value) {
              this.formElements[key].validate.error = `${this.formElements[key].options.label} is required`;
              isValide = false;
            }
            // min max in input type number---------------------------------
            if (validate.isnumber) {
              if (validate.min && this.formElements[key].value < validate.min && this.formElements[key].value) {
                this.formElements[key].validate.error = `Value ${this.formElements[key].options.label} must be greater than ${validate.min - 1}.`;
                isValide = false;
              }
              if (validate.min && this.formElements[key].value > validate.min && this.formElements[key].value) {
                this.formElements[key].validate.error = `Value ${this.formElements[key].options.label} must be less than ${validate.max + 1}.`;
                isValide = false;
              }
            }
            // end min max in input type number
            if (this.formElements[key].value) {
              if (validate.minlength && this.formElements[key].value.length < validate.minlength) {
                this.formElements[key].validate.error = `${this.formElements[key].options.label} must be more than ${validate.minlength - 1} characters.`;
                isValide = false;
              }
              if (validate.maxlength && this.formElements[key].value.length > validate.maxlength) {
                  this.formElements[key].validate.error = `${this.formElements[key].options.label} must be less than ${validate.maxlength} characters.`;
                  isValide = false;
              }
              if (validate.min && this.formElements[key].value < validate.min) {
                this.formElements[key].validate.error = `${this.formElements[key].options.label} must be greater than ${validate.min - 1}.`;
                isValide = false;
              }
              if (validate.phone && !/^[0-9]{9,12}/.test(this.formElements[key].value)) {
                this.formElements[key].validate.error = `${this.formElements[key].value} is not a valid phone number`;
                isValide = false;
              }
              if (validate.email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.formElements[key].value )) {
                this.formElements[key].validate.error = `${this.formElements[key].value} is not a valid email address`;
                isValide = false;
              }
              if (validate.compare && this.formElements[key].value != this.formElements[validate.compare].value ) {
                this.formElements[key].validate.error = `${this.formElements[validate.compare].options.label} and ${this.formElements[key].options.label} must be the same`;
                isValide = false;
              }
            }
            // reg Valid
            if (validate.reg_match &&  !RegExp(validate.reg_match.regex).test(this.formElements[key].value) ) {
              this.formElements[key].validate.error = `${this.formElements[key].options.label} ${validate.reg_match.message}`;
              isValide = false;
            }
          }
        }
        this.refresh();
        return isValide;
      },
      refresh() {
        this.ready = false;
        this.$nextTick(function () {
          this.ready = true;
        });
      },
      simplified() {
        const simplified = {};
        for (const key in this.formElements) {
          simplified[key] = this.formElements[key].value;
        }
        return simplified;
      }
    }
  };
</script>
<style scoped>
</style>
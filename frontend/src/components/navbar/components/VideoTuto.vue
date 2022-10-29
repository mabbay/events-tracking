<template>
  <div class="flex cursor-pointer mr-3 mt-1" @click="goto({name:'formations'})">
      <unicon  class=" navbar-fuzzy-search mr-1 text-secondary" name="youtube" :fill="classVideo" icon-style="line"  />
      <span class="hidden sm:block text-secondary font-medium">{{ 'formations' | t }}</span>
  </div>
</template>

<script>
export default {
    data() {
        return {
            
        }
    },
    computed:{
        classVideo(){
            let color = "rgb(98 98 98)";
            if (this.$route.name == "formations") color = "rgb(255 0 0)";
            return color;
        },
    },
    methods: {
        goto(obj){
            this.$router.push(obj);
        }
    },
}
</script>

<style>

</style>
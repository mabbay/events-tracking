<template>
    <div id="switch-lang" class="bg-white p-0 border border-solid border-grey rounded shadow" v-show="langs.length > 1" >
        <div class="flex flex-no-wrap"  >
            <div v-for="(item, index) in langs" :key="index" class="flex items-center" >
                <span v-if="index != 0" class="line" ></span>
                <div class="px-4 py-2 font-medium switchLang_item cursor-pointer flex items-center" :class="{ 'active font-semibold': item.code == currLang }" @click="onChangeLang(item.code)" >
                    <img v-if="item.image && item.code == currLang" :src="item.image" class="h-3 w-4 mr-1">
                    <!-- <span class="ico ico-flag ico-flag-ma"></span> -->
                    <span v-if="item.code == currLang" > {{ item.name | t }} </span>
                    <span v-else > {{ item.code | t }} </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "switch-lang",
    props: {
        langs:{required : true},
        currLang:{required : true}
    },
    // data() {
    //   return {
    //     lang: null,
    //   };
    // },
    // watch: {
    //   lang: function (val) {
    //     this.$emit('input',val);
    //   },
    // },
    // mounted() {
    //     this.langs.forEach(element => {  if (element.default) this.lang = element.code; });
    //     this.$emit('input',this.lang);
    // },
    methods:{
        onChangeLang(lang){
            this.$emit('changeLang',lang);
            // this.lang = lang;
        },
    }
}
</script>
<style>
    #switch-lang .switchLang_item{
        transition: 300ms;
    }
    #switch-lang .switchLang_item.active{
        color: rgba(var(--vs-primary), 1) !important;
    }
    #switch-lang .switchLang_item .line{
        width: 1px;
        height: 100%;
        background-color: green;
    }
</style>
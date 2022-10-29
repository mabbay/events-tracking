<template>
    <div id="switch-curr" class="bg-white p-0 border border-solid border-grey rounded shadow" v-show="currencies.length > 1" >
        <div class="flex flex-no-wrap" >
            <div v-for="(item, index) in currencies" :key="index" class="flex items-center" >
                <span v-if="index != 0" class="line" ></span>
                <div class="px-4 py-2 font-medium switchLang_item cursor-pointer flex items-center" :class="{ 'active font-semibold': item.code == currCurrency }" @click="onChangeCurr(item.code)" >
                    <!-- <span class="ico ico-flag ico-flag-ma"></span> -->
                    <!-- <span v-if="item.code == currencie" > {{ item.name | t }} </span> -->
                    <span :class="{ 'font-semibold': item.code == currCurrency }"> {{ item.code | t }} </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "switch-currency",
    props: {
        currencies:{required : true},
        currCurrency:{required : true}
    },
    // data() {
    //   return {
    //     currencie: null,
    //   };
    // },
    // watch: {
    //   currencie: function (val) {
    //     this.$emit('input',val);
    //   },
    // },
    // mounted() {
    //     // this.currencie = this.currencies[0].code;
    //     this.currencies.forEach(element => {  if (element.default) this.currencie = element.code; });
    //     this.$emit('input',this.currencie);
    // },
    methods:{
        onChangeCurr(currencie){
            // this.currencie = currencie;
            this.$emit('changeCurr',currencie);
        },
    }
}
</script>
<style>
    #switch-curr .switchLang_item{
        transition: 300ms;
    }
    #switch-curr .switchLang_item.active{
        color: rgba(var(--vs-primary), 1) !important;
    }
    #switch-curr .switchLang_item .line{
        width: 1px;
        height: 100%;
        background-color: green;
    }
</style>
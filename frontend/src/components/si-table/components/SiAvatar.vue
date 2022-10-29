<template>
    <div class="flex">
        <vs-avatar class="border-2 border-white border-solid" :class="config.style" :color="config.color" :size="config.size" text="" :src="data" />
    </div>
</template>
<script>
export default {
    props: {
        dataField: { required: true},
        options: { required: false},
    },
    data() {
        return {
        }
    },
    computed: {
        data:{
            get(){
                if( typeof(this.reform)  == "function") return this.reform(this.dataField.item);
                return this.$_.get(this.dataField.item,this.dataField.field);
            },
            set(newvalue){
            }  
        },
        config:{
            get(){
                if( typeof(this.options) == "object" ) return this.options;
                else if( typeof(this.options)  == "function") return this.options(this.dataField.item);
            },
            set(){}
        }
    },
    mounted() {
        // this.init();
    },
    methods: {
        // init(){
        //     if( typeof(this.options) == "object" ) this.config = this.options;
        //     else if( typeof(this.options)  == "function") this.config = this.options(this.dataField);
        // },
    },
}
</script>
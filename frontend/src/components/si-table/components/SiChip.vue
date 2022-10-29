<template>
    <div>
        <vs-chip :color="config.color" :class="config.style">
            <feather-icon v-if="config.icon" :icon="config.icon" :svgClasses="'w-4 h-4 mr-2'"  />
            <div v-if="config.translate">
                <span :style="{ 'color':config.textColor }" v-html="getDataTranslate(data)" ></span>
            </div>
            <span v-else v-html="getDataTranslate(data)" :style="{ 'color':config.textColor }"></span>
        </vs-chip>
    </div>
</template>
<script>
export default {
    props: {
        dataField: { required: true },
        options: { required: false },
        reform:{ required: false }
    },
    data() {
        return {
            // config:{},
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
    methods: {
        getDataTranslate(data){
            let text = this.$_.toLower(data);
            return this.$t(text);
        },
    },
    // mounted() {
    //     this.init();
    // },
    // methods: {
    //     init(){
    //         if( typeof(this.options) == "object" ) this.config = this.options;
    //         else if( typeof(this.options)  == "function") this.config = this.options(this.dataField);
    //     },
    // },
}
</script>
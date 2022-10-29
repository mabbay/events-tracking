<template>
    <div>
        <vx-tooltip v-if="config.tooltip"  :text="config.tooltip">
            <span class="flex items-center justify-start" :class="config.style">
                <feather-icon v-if="config.icon" :icon="config.icon" :svgClasses="'w-4 h-4 mr-2 '"  />
                <span v-if="config.translate"  >{{ getDataTranslate(data) }}</span>
                <span v-else  >{{ data }}</span>
            </span>
        </vx-tooltip>
        <span v-else class="flex items-center justify-start" :class="config.style">
            <feather-icon v-if="config.icon" :icon="config.icon" :svgClasses="'w-4 h-4 mr-2 '"  />
            <div v-if="config.translate">
                <span v-html="getDataTranslate(data)" ></span>
            </div>
            <span v-else v-html="data"></span>
        </span>
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
    },
    methods: {
        isHTML(data){
            return /<\/?[a-z][\s\S]*>/i.test(data);
        },
        getDataTranslate(data){
            let text = this.$_.toLower(data);
            return this.$t(text);
        },
        // init(){
        //     if( typeof(this.options) == "object" ) this.config = this.options;
        //     else if( typeof(this.options)  == "function") this.config = this.options(this.dataField);
        // },
        // generateIconClass(color){
        //     return  `text-${color}`;
        // }
    },
}
</script>
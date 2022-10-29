<template>
    <div>
        <a class="flex items-center justify-start" :class="config.style" :href="data.link" :target="getTarget(config.target)">
            <feather-icon v-if="config.icon" :icon="config.icon" :svgClasses="'w-4 h-4 mr-2 '"  />
            <span v-if="config.translate"  >{{ data.value | t }}</span>
            <span v-else  >{{ data.value }}</span>
        </a> 
    </div>
</template>
<script>
export default {
    props: {
        dataField: { required: true},
        options: { required: false},
        reform: { required: false},
    },
    data() {
        return {
        }
    },
    computed: {
        data:{
            get(){
                let obj = {};
                if ( typeof(this.reform)  == "function") obj = this.reform(this.dataField.item);
                else obj = this.$_.get(this.dataField.item,this.dataField.field);
                let init = this.$store.getters['getInit'];
                let urlProd = `store.storeino.com`;
                obj.link = obj.link.replace('[DOMAIN_NAME]',`https://${urlProd}`);
                return obj;
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
        getTarget(target){
            let tg = "_blank";
            if(target) tg = target;
            return tg;
        }
    },
}
</script>
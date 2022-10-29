<template>
    <div>
        <div class="w-12 h-12 m-2 relative">
            <img v-if="data" class="product_image rounded-lg shadow"  :src="data" alt="">
            <div v-else class="product_image rounded-lg bg-white flex justify-center shadow" >
                <feather-icon icon="ImageIcon" svgClasses="text-grey w-6 h-6 " />
            </div>
        </div>
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
    },
}
</script>
<style >
.product_image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* border: 1px solid #acacac78; */
  }
</style>
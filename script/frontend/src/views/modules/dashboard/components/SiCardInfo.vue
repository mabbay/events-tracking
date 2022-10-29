<template>
    <div id="dashboard_page">
        <div class="bg-white rounded-lg shadow p-8 relative" >
            <div class="flex flex-wrap w-full" >
                <h6 class="text-secondary font-semibold w-full mb-3 uppercase truncate" > {{ title  }} </h6>
                <h2 class="text-dark-grey font-bold w-full" style="text-shadow:" v-html="number" ></h2>
            </div>
            <div class="icon absolute" >
                <div class="p-3 bg-light bg-opacity-50 inline-flex rounded-full feather-icon select-none relative"  >
                    <feather-icon :icon="icon" :svgClasses="'w-8 h-8 text-'+color"  />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'si-card-info',
    props:{
        title:{ required : true },
        number:{ required : true,default:'___' },
        loading:{required : false },
        icon:{required : true,default:'BarChart2Icon'},
        color:{required : true,default:'primary'},
    },
    data() {
        return {
            
        }
    },
}
</script>
<style>
    #dashboard_page .icon {
        top: 10px;
        right: 10px;
        bottom: auto;
        transition: 300ms;
    }
    @media screen and (max-width: 992px) {
        #dashboard_page .icon {
            bottom: 10px;
            top: auto;
        }
    }
</style>
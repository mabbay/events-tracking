<template>
    <div id="progressBar">
        <!-- <div class="fixed_progress_bar">
            <vs-progress indeterminate :color="color" :height="height"></vs-progress>
        </div> -->
        <div id="progress_loading_circle" class="w-full fixed_progress_circle vs-con-loading__container" ></div>
    </div>
</template>
<script>
export default {
    name: "si-progress-bar",
    props: {
        color:{required:false,default:"primary"},
        height:{required:false,default:3},
    },
    mounted() {
        this.$vs.loading({
            container: '#progress_loading_circle',
            scale: 0.8
        });
    },
};
</script>
<style>
   #progressBar .con-vs-loading{
       background: rgba(255, 255, 255, 0) !important;
    }
    #progressBar .fixed_progress_circle{
        height: calc(100vh - 260px);
    }
    #progressBar .fixed_progress_bar{
        position: fixed !important;
        top: 0px !important;
        width: 100% !important;
        z-index: 41001;
        padding: 0rem;
    }
    #progressBar .fixed_progress_bar .vs-progress--background {
        display: block !important;
    }

    @media (min-width: 1201px){
        #progressBar .fixed_progress_bar{
            width: calc(100% - 260px) !important;
        }
    }
</style>
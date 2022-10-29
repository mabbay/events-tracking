<template>
    <div class="relative" >
        <div class="nota w-2 h-2 bg-danger pulse_effect rounded-full" ></div>
        <!-- <feather-icon icon="FileTextIcon" class="cursor-pointer mt-1 sm:mr-6 mr-2"  svgClasses="text-secondary"  @click="goto()"/> -->
        <unicon @click="goto()" width="24" height="24" class="cursor-pointer mt-1 sm:mr-6 mr-2" name="file-edit-alt" fill="rgb(98 98 98)" icon-style="line"  />
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
            const locale = this.$i18n.locale;
            let link = "https://docs.google.com/forms/d/e/1FAIpQLSfc3YUnCBtVsEVHz4cMgPre6_rkTKDEUlA-Huxi7e54B4tnvA/viewform";
            if (locale === 'en') link = "https://docs.google.com/forms/d/e/1FAIpQLSc4MxqBC1DZvtki3_C1uLmrhRCZlzNw3mvpO4LsbfTW7z-3qQ/viewform?usp=send_form";
            else if (locale === 'fr') link = "https://docs.google.com/forms/d/e/1FAIpQLSfc3YUnCBtVsEVHz4cMgPre6_rkTKDEUlA-Huxi7e54B4tnvA/viewform";
            else if (locale === 'ar') link = "https://docs.google.com/forms/d/e/1FAIpQLSdVQy5z7EJvX5V1ZF022WsakCuyXdrEVINNAfQToF8L3JpxQg/viewform";
            window.open(link,'_blank'); 
        }
    },
}
</script>

<style>
    .nota{
        position: absolute;
        top: 2px;
        right: 18px;
    }
    @media only screen and (max-width: 600px) {
        .nota{
            right: 4px;
        }
    }
    .pulse_effect{
        box-shadow: 0 0 0 0 rgba(var(--vs-danger),0.7);
        -webkit-animation: hello 1.25s infinite cubic-bezier(.66,0,0,1);
        -moz-animation: hello 1.25s infinite cubic-bezier(.66,0,0,1);
        -ms-animation: hello 1.25s infinite cubic-bezier(.66,0,0,1);
        animation: hello 1.25s infinite cubic-bezier(.66,0,0,1);
    }
    @-webkit-keyframes hello {
        to {
            box-shadow: 0 0 0 20px transparent
        }
    }

    @-moz-keyframes hello {
        to {
            box-shadow: 0 0 0 20px transparent
        }
    }

    @-ms-keyframes hello {
        to {
            box-shadow: 0 0 0 20px transparent
        }
    }

    @keyframes hello {
        to {
            box-shadow: 0 0 0 20px transparent
        }
    }
</style>
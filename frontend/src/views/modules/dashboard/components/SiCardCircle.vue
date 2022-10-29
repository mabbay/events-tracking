<template>
    <div>
        <div class=" bg-white rounded-lg shadow p-4" >
            <div class="flex flex-no-wrap w-full mb-0 p-4" >
                <h5 class="text-secondary font-semibold w-full uppercase truncate" > {{ title  }} </h5>
            </div>
            <div class="w-full md:p-2" >
                <canvas class="w-full" id="circleCard"></canvas>
            </div>
            
        </div>
    </div>
</template>
<script>
const Chart = require('chart.js');
export default {
    name:'si-card-circle',
    props:{
        list:{ required : true},
        title:{ required : true },
        loading:{ required : false }
    },
    data() {
        return {
        }
    },
     watch: {
        loading( value ){
            if (!value) this.init();
        }
    },
    methods: {
        init(){
            var ctx = document.getElementById('circleCard');
            ctx.height = 350;
            var myChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: this.list.labels,
                    datasets: [
                        {
                            data: this.list.datasets,
                            backgroundColor: this.list.colors,
                            borderWidth: 2
                        },
                    ]
                },
                options: {
                    cutoutPercentage:80,
                    rotation: 0.5 * Math.PI,
                    responsive: true,
                    legend: {
                    position: 'bottom',
                    // display: false,
                    },
                    title: {
                    display: false,
                    text: 'Totals de prix'
                    },
                    animation: {
                    animateScale: true,
                    animateRotate: true
                    }
                }
            });
            
        },
    },
}
</script>
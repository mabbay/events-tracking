<template>
    <div>
        <div class=" bg-white rounded-lg shadow p-4" >
            <div class="flex flex-no-wrap w-full mb-0 p-4" >
                <h5 class="text-secondary font-semibold w-full uppercase truncate" > {{ title  }} </h5>
            </div>
            <div class="w-full md:p-2"  >
                <canvas class="w-full" id="chartOrder"></canvas>
            </div>
            
        </div>
    </div>
</template>
<script>
const Chart = require('chart.js');
export default {
    name:'si-card-chart',
    props:{
        title:{ required : true },
        list:{ required : true  },
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
            var ctx = document.getElementById('chartOrder');
            ctx.height = 350;
            var myChart = new Chart(ctx, {
                 type: 'bar',
                data: {
                    labels: [],
                    datasets:[],
                },
                options: {
                    responsive: true,
                    legend: {
                        position: 'bottom',
                        // display: false,
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false
                    },
                    title: {
                        display: false,
                        text: "Today Revenue",
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                // scaleIntegersOnly: true,
                                min: 0,
                                stepSize: 1,
                                max: this.$_.max(this.list.datasets) + 2
                                // precision: 0
                                // stepSize: 1
                            },
                            
                        }], 


                        xAxes: [{
                            gridLines: {
                                display: false
                            },
                            type: 'time',
                            time: {
                                parser: 'DD/MM/YYYY HH',
                                tooltipFormat: 'll',
                                unit: 'hour',
                                unitStepSize: 1,
                                displayFormats: {
                                    'hour': 'HH'
                                }
                            }
                        }],
                    },
                }
            });
            myChart.data.datasets =  [
                {
                    barPercentage:0.6,
                    label: this.$options.filters.t('dashboard_total_orders_24h'),
                    data: this.list.datasets,
                    backgroundColor: 'rgba(31,116,255, 0.8)',
                    borderColor:'rgba(31,116,255, 1)',
                    borderWidth: 1
                }
            ];
            myChart.data.labels= this.list.labels;
            myChart.update();
        },
        generateDataOfList(){
            let dataList = [];
            for (let i = 23; i >= 0; i--) {
                let data = undefined;
                let label =  this.$moment.utc().subtract(i,"hours").format("DD/MM/YYYY HH");
                this.$_.find(this.list, function(t) { return t.language == code; });
                dataList.push(data);
            }
            return dataList;
        },
        generateLabels24hours(){
            let dataLabel = [];
            for (let i = 23; i >= 0; i--) {
                dataLabel.push( `${this.$moment.utc().subtract(i,"hours").format("DD/MM/YYYY HH")}` );
            }
            return dataLabel;
        }
    },
}
</script>
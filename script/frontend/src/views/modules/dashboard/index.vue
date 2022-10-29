<template>
    <div class="container">
        <div class="vx-row">
            <div class="vx-col lg:w-1/4 md:w-1/2 sm:w-1/2 w-1/2 mb-3 p-3">
                <h1 class=" bg-white p-4 py-6">Views</h1>
            </div>
            <div class="vx-col lg:w-1/4 md:w-1/2 sm:w-1/2 w-1/2 mb-3 p-3">
                <h1 class=" bg-white p-4 py-6">Clicks</h1>
            </div>
            <div class="vx-col lg:w-1/4 md:w-1/2 sm:w-1/2 w-1/2 mb-3 p-3">
                <h1 class=" bg-white p-4 py-6">Earnings</h1>
            </div>
            <div class="vx-col lg:w-1/4 md:w-1/2 sm:w-1/2 w-1/2 mb-3 p-3">
                <h1 class=" bg-white p-4 py-6">Withdrawals</h1>
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col md:w-8/12 w-full mb-3 p-3">
                <si-card-chart :loading="loading" :title="'dashboard_earning_revenue_24h' | t"  :list="dashboard.siChart" />
            </div>
            <div class="vx-col md:w-4/12 w-full mb-3 p-3">
                <si-card-circle :loading="loading" :title="'dashboard_orders_by_status' | t" :list="dashboard.siCircle"  />
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col md:w-8/12 w-full mb-3 p-3">
                <si-card-order :loading="loading" :title="'dashboard_recent_orders' | t" :list="dashboard.lastOrders"  />
            </div>
            <div class="vx-col md:w-4/12 w-full mb-3 p-3">
                <div class="h-64 bg-white rounded border border-solid border-grey shadow p-5 cursor-pointer" >
                  
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import SiCardChart from './components/SiCardChart.vue'
import SiCardOrder from './components/SiCardOrder.vue'
import SiCardCircle from './components/SiCardCircle.vue'
export default {
    components:{ SiCardChart,SiCardOrder,SiCardCircle },
    data() {
        return {
            loading:true,
            dashboard:{},
            ordernotes:[],
        }
    },
    mounted() {
    },
    methods: {
    },
}
</script>
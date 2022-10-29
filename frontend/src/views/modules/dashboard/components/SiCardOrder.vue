<template>
    <div>
        <div class="bg-white rounded-lg shadow p-4">
            <div class="flex flex-no-wrap w-full mb-0 p-4" >
                <h5 class="text-secondary font-semibold w-full uppercase truncate" > {{ title }} </h5>
            </div>
            <div class="vs-component vs-con-table vs-table-primary stripe">
                <div class="w-full">
                    <div class="vs-con-tbody vs-table--tbody">
                        <table class="vs-table vs-table--tbody-table">
                            <thead class="vs-table--thead">
                                <tr>
                                    <th width="30" >{{ 'detail' | t }} </th>
                                    <th>{{ 'customer' | t }}</th>
                                    <th width="30">{{ 'status' | t }}</th>
                                    <th width="30">{{ 'total' | t }}</th>
                                    <th width="20">{{ 'action' | t }}</th>
                                </tr>
                            </thead>
                            <tr class="tr-values vs-table--tr tr-table-state-null" v-for="(item, index) in list" :key="index">
                                <td class="td vs-table--td py-3">
                                    <div class="flex flex-wrap w-full" >
                                        <span class="text-secondary font-semibold whitespace-no-wrap w-full mb-2">
                                            <span class="text-primary"> {{ item.details.length }} </span> Products
                                        </span>
                                        <span class="flex items-center text-secondary font-semibold whitespace-no-wrap text-sm" >
                                            <feather-icon icon="CalendarIcon" :svgClasses="'w-4 h-4 mr-2 '"  />
                                            <span class="" > {{ item.createdAt }} </span>
                                        </span>
                                    </div>
                                </td>
                                <td class="td vs-table--td py-3">
                                    <div class="flex flex-wrap w-full" >
                                        <span class="text-primary font-semibold whitespace-no-wrap mb-2 w-full" >
                                            {{ item.customer.lastname+ ' ' + item.customer.firstname | nameFilter }}
                                        </span>
                                        <span class="text-secondary font-semibold whitespace-no-wrap text-sm" >
                                            {{ item.customer.email }}
                                        </span>
                                    </div>
                                </td>
                                <td class="td vs-table--td py-3">
                                    <div class="flex flex-no-wrap w-full" >
                                        <vs-chip color="white" class="font-semibold text-sm whitespace-no-wrap shadow w-full">
                                            <span :style="getColorStatus(item.status)"> {{ item.status }} </span>
                                        </vs-chip>
                                    </div>
                                </td>
                                <td class="td vs-table--td py-3">
                                    <span class="text-danger font-semibold text-sm whitespace-no-wrap lowercase" >
                                        {{ item.total | price }} <span class="text-secondary" >{{ item.currency }}</span>
                                    </span>
                                </td>
                                <td class="td vs-table--td py-3" width="10">
                                    <vs-row vs-align="center" class="flex-no-wrap justify-center">
                                        <div class="mr-4">
                                            <feather-icon icon="EyeIcon" svgClasses="w-5 h-5 cursor-pointer hover:text-primary" @click="view(item)"  />
                                        </div>
                                    </vs-row>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'si-card-order',
        props: {
            list:{ required: true },
            title: { required: true },
            loading: { required: false }
        },
        data() {
            return {

            }
        },
        filters:{
            nameFilter(value){
                return value.length > 25 ? `${value.substring(0,24)}...` : value ;
            }
        },
        mounted() {
        },
        methods: {
            getColorStatus(status){
                console.log(status);
                return { color:'rgb(115,103,240)' };
            },
            view(obj){
                this.$router.push({name:'orders-view',params:{id:obj._id}});
            }
        },
    }
</script>
<template>
  <div class="the-navbar__user-meta flex items-center" >

    <div class="text-right leading-tight hidden sm:block">
      <p class="font-semibold">{{ appActiveUser.fullName }}</p>
      <!-- <small class="flex text-primary hover:text-secondary cursor-pointer mt-1 justify-end" >
        <feather-icon icon="EyeIcon" svgClasses="w-4 h-4" />
        <span class="ml-2 whitespace-no-wrap">Store Name</span>
      </small> -->
    </div>

    <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">

      <div class="con-img ml-3">
        <img v-if="appActiveUser.icon" key="onlineImg" :src="appActiveUser.icon" alt="user-img" width="40" height="40" class="rounded-full shadow-md cursor-pointer block" />
        <div v-else class="w-12 h-12 rounded-full bg-grey shadow-md cursor-pointer block" />
      </div>

      <vs-dropdown-menu >
        <!-- <vs-dropdown-group :vs-label="'stores' | t ">
           <vs-dropdown-item>
            <feather-icon icon="EyeIcon" svgClasses="w-4 h-4" />
            <span class="ml-2 whitespace-no-wrap">Hello World</span>
          </vs-dropdown-item>
        </vs-dropdown-group>
        <vs-divider class="my-1" />
        <vs-dropdown-item class="flex" @click="backToManager()">
          <feather-icon icon="CommandIcon" svgClasses="w-4 h-4" />
          <span class="ml-2 whitespace-no-wrap">{{ 'back_to_manager' | t }}</span>
        </vs-dropdown-item> -->
        <!-- <vs-divider class="my-1" /> -->
        <vs-dropdown-item @click="logout">
          <feather-icon icon="LogOutIcon" svgClasses="w-4 h-4" />
          <span class="ml-2 whitespace-no-wrap">{{ 'logout' | t }}</span>
        </vs-dropdown-item>
      </vs-dropdown-menu>
    </vs-dropdown>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      loading:{
        switch : false
      }
    }
  },
  computed: {
    ...mapGetters(['appActiveUser'])
    /*activeUserInfo() {
      console.log(this.$store.getters['getInit']);
      let allInfo = this.$_.merge({}, this.$store.getters['getInit']);
      let data  = {
        user : allInfo.user,
        icon : null,
        storename: null,
        store: allInfo.store,
        stores:[]
      };
      let storeLogo = this.$_.find(allInfo.options, function(t) { return t.key == "store_logo"; });
      if( typeof(storeLogo) != 'undefined' && typeof(storeLogo.value) != 'undefined' && storeLogo.value != null && typeof(storeLogo.value.src) != 'undefined' ) {
        data.icon = storeLogo.value.src;
      }

      let storeName = this.$_.find(allInfo.options, function(t) { return t.key == "store_name"; });
      data.stores = [];
      console.log('Store Init',data);
      return data;
    }*/
  },
  methods: {
    logout() {
        // this.$router.push('/pages/login').catch(() => {})
        // console.log('Logout');
        // window.open('/logout','_self');
        this.$store.dispatch('logout');
        this.$router.push({ name: 'login' });
    },
    backToManager(){
      window.open('/manager','_self');
    },
    goto(link){
      window.open("https://" + link,'_blank');
    },

    async switchToStore(id, options = {confirmed : false}) {
      if (id != this.activeUserInfo.store._id) {
        console.log('switch');
        if (!options.confirmed) {
            this.$vs.dialog({
                type: 'confirm',
                color: 'primary',
                title:  this.$t('confirm_switch'),
                text: this.$t('confirm_switch_item'),
                accept:()=>{ this.switchToStore(id,{ confirmed : true}); },
            });
        }else{
          try {
            this.loading.switch = true;
            const response = await this.$http.get(`/api/stores/get`,{
              params: {id: id,withToken : true}
            });
            console.log('__ access,',response.data);
            if (typeof response.data.token != "undefined") {
              let s_token = response.data.token;
              let m_token = window.localStorage.getItem('x-auth-token');
              window.localStorage.setItem("x-auth-token", s_token);
              window.open('/stores','_self');
              // console.log(s_token);
            }
            this.loading.switch = false;
            } catch (error) {
                console.log(error);
                let message_error = "Error";
                if (error.response.data && typeof error.response.data == "string") message_error = error.response.data;
                this.$vs.notify({ title: 'Error', text: message_error, color: "danger", position: 'bottom-center', iconPack: 'feather', icon: 'icon-alert-circle' });
                this.loading.switch = false;
            }
        }
      }
    },
  }
}
</script>
<style >
  .vs-dropdown--item-link{
    display: flex !important;
  }
  .vs-component.vs-dropdown--group.no-cascading {
    border-top : none !important;
    margin-top : 0 !important;
  }
  .con-dropdown--group-con-ul{
    border-left : none !important;
  }
</style>

<!-- =========================================================================================
  File Name: TheNavbar.vue
  Description: Navbar component
  Component Name: TheNavbar
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div id="topbar" class="relative">
    <div id="navbar-top" class="vx-navbar-wrapper" :class="classObj">
      <vs-navbar class="vx-navbar navbar-custom navbar-skelton" :color="navbarColorLocal" :class="textColor">
        <!-- SM - OPEN SIDEBAR BUTTON -->
        <feather-icon class="sm:inline-flex xl:hidden cursor-pointer p-2" icon="MenuIcon" @click.stop="showSidebar" />
        <!-- <bookmarks :navbarColor="navbarColor" v-if="windowWidth >= 992" /> -->
          <div class="flex flex-nowrap items-center px-2" >
            <div class="filter_obj hover:shadow-none rounded-full w-8 h-8  relative flex justify-center items-center" >
                <div class="stock_icon" >
                    <feather-icon class="stock_icon_item"  icon="ChevronLeftIcon" svgClasses="w-5 h-5 cursor-pointer" @click="handleBack()"  />
                </div>
            </div>
          </div>
          <div class="border-l border-0 border-solid border-grey overflow-hidden px-1 flex flex-nowrap items-center" >
            <div class="w-2" ></div>
            <h5 class="text-secondary overflow-hidden truncate" > {{ routeTitle | t }} </h5> 
          </div>
        <vs-spacer />

        <!-- <video-tuto/> -->
        <!-- <Language /> -->
        <!-- <google-form/> -->
        <!-- <search-bar /> -->

        <!-- <notification-drop-down /> -->

        <profile-drop-down />

      </vs-navbar>
    </div>
  </div>
</template>


<script>
import Bookmarks            from "./components/Bookmarks.vue"
import SearchBar            from "./components/SearchBar.vue"
import NotificationDropDown from "./components/NotificationDropDown.vue"
import ProfileDropDown      from "./components/ProfileDropDown.vue"
import Language             from './components/Language.vue'
import VideoTuto            from './components/VideoTuto.vue'
import GoogleForm from './components/GoogleForm.vue'

export default {
  name: "the-navbar-vertical",
  props: {
    navbarColor: {
      type: String,
      default: "#fff",
    },
  },
  data() {
    return {
    }
  },
  mounted() {},
  components: {
    Bookmarks,
    SearchBar,
    NotificationDropDown,
    ProfileDropDown,
    Language,
    VideoTuto,
    GoogleForm
  },
  computed: {
    routeTitle(){
     return this.$route.meta.pageTitle
    },
    navbarColorLocal() {
      return this.$store.state.theme === "dark" && this.navbarColor === "#fff" ? "#10163a" : this.navbarColor
    },
    verticalNavMenuWidth() {
      return this.$store.state.verticalNavMenuWidth
    },
    textColor() {
      return {'text-white': (this.navbarColor != '#10163a' && this.$store.state.theme === 'dark') || (this.navbarColor != '#fff' && this.$store.state.theme !== 'dark')}
    },
    windowWidth() {
      return this.$store.state.windowWidth
    },

    // NAVBAR STYLE
    classObj() {
      if (this.verticalNavMenuWidth == "default")      return "navbar-default"
      else if (this.verticalNavMenuWidth == "reduced") return "navbar-reduced"
      else if (this.verticalNavMenuWidth)              return "navbar-full"
    },
  },
  methods: {
    showSidebar() {
      this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', true);
    },
    handleBack(fallback) {
      this.$router.back();
    }
  }
}
</script>
<style scoped>
  .fix-button{
    background-color: white;
    padding: 6px 12px;
    border-radius: 5px;
    border: 0;
    color: var(--vs-primary);
    cursor: pointer;
    font-weight: 600;
  }
  .expire-number {
    background-color: #e91e63;
    color: white;
    padding: 4px;
    display: inline-block;
    border-radius: 4px;
    text-align: center;
    min-width: 30px;
  }
  .will-expire,.is-expired{
    transition: .2s;
    cursor: pointer;
  }
  .will-expire{
    border-bottom: 2px solid #e7361f;
    background-color: rgb(249, 214, 185);
  }
  
  .will-expire .expire-number{
    background-color: #ff5722;
  }
  .is-expired{
    background-color: rgb(249 185 189);
    border-bottom: 2px solid #e71f62;
  }
  .is-expired:hover{
    background-color: rgb(255, 227, 229);
  }
  .will-expire:hover{
    background-color: rgb(255, 240, 227);
  }
  #topbar .stock_icon{
      position: absolute !important;
      line-height: 0 !important;
  }
  #topbar  .filter_obj{
        background: rgba(var(--vs-dark),0.1);
        transition: 300ms;
    }
  #topbar .filter_obj:hover{
      background: rgba(var(--vs-dark),0.2);
  }
  #topbar  .stock_icon_item{
      color : rgba(var(--vs-dark),0.8);
      transition: 300ms;
  }
  #topbar .filter_obj:hover .stock_icon_item{
      color : rgba(var(--vs-dark),0.8)
  }
</style>


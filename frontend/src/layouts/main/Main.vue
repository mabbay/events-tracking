<!-- =========================================================================================
    File Name: Main.vue
    Description: Main layout
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div class="layout--main" :class="[layoutTypeClass, navbarClasses, footerClasses, {'no-scroll': isAppPage}]">
    <!-- <tour /> -->
    <v-nav-menu :navMenuItems="navMenuItems" :title="'storeino' | t" parent=".layout--main" />

    <div id="content-area" :class="[contentAreaClass, {'show-overlay': bodyOverlay}]">
      <div id="content-overlay" />
      <!-- Navbar -->
      <template v-if="mainLayoutType === 'horizontal' && windowWidth >= 1200">
        <the-navbar-horizontal :navbarType="navbarType" :class="[
          {'text-white' : isNavbarDark  && !isThemeDark},
          {'text-base'  : !isNavbarDark && isThemeDark}
        ]" />

        <div style="height: 62px" v-if="navbarType === 'static'"></div>

        <h-nav-menu :class="[
          {'text-white' : isNavbarDark  && !isThemeDark},
          {'text-base'  : !isNavbarDark && isThemeDark}
        ]" :navMenuItems="navMenuItems" />
      </template>

      <template v-else>
        <the-navbar-vertical :navbarColor="navbarColor" :class="[
          {'text-white' : isNavbarDark  && !isThemeDark},
          {'text-base'  : !isNavbarDark && isThemeDark}
        ]" />
      </template>
      <!-- /Navbar -->
      
      <div class="content-wrapper">

        <div class="router-view">
          <div class="router-content">

            <transition :name="routerTransition">

              <!-- <div v-if="$route.meta.breadcrumb || $route.meta.pageTitle" class="router-header flex flex-wrap items-center mb-6"> -->
              <!-- <div
                  class="content-area__heading"
                  :class="{'pr-4 border-0 md:border-r border-solid border-grey-light' : $route.meta.breadcrumb}">
                  <h2 class="mb-1">{{ routeTitle }}</h2>
                </div> -->

              <!-- BREADCRUMB -->
              <!-- <vx-breadcrumb class="ml-4 md:block hidden" v-if="$route.meta.breadcrumb" :route="$route" :isRTL="$vs.rtl" /> -->

              <!-- DROPDOWN -->
              <!-- <vs-dropdown vs-trigger-click class="ml-auto md:block hidden cursor-pointer">
                  <vs-button radius icon="icon-settings" icon-pack="feather" />

                  <vs-dropdown-menu class="w-32">
                    <vs-dropdown-item>
                      <div @click="$router.push('/pages/profile').catch(() => {})" class="flex items-center">
                        <feather-icon icon="UserIcon" class="inline-block mr-2" svgClasses="w-4 h-4" />
                        <span>Profile</span>
                      </div>
                    </vs-dropdown-item>
                    <vs-dropdown-item>
                      <div @click="$router.push('/apps/todo').catch(() => {})" class="flex items-center">
                        <feather-icon icon="CheckSquareIcon" class="inline-block mr-2" svgClasses="w-4 h-4" />
                        <span>Tasks</span>
                      </div>
                    </vs-dropdown-item>
                    <vs-dropdown-item>
                      <div @click="$router.push('/apps/email').catch(() => {})" class="flex items-center">
                        <feather-icon icon="MailIcon" class="inline-block mr-2" svgClasses="w-4 h-4" />
                        <span>Inbox</span>
                      </div>
                    </vs-dropdown-item>
                  </vs-dropdown-menu>

                </vs-dropdown> -->

              <!-- </div> -->
            </transition>

            <div class="content-area__content">

              <!-- <back-to-top bottom="5%" :right="$vs.rtl ? 'calc(100% - 2.2rem - 38px)' : '30px'" visibleoffset="500" v-if="!hideScrollToTop">
                <vs-button icon-pack="feather" icon="icon-arrow-up" class="shadow-lg btn-back-to-top" />
              </back-to-top> -->
              <transition :name="routerTransition" mode="out-in">
                <router-view :key="$route.path" @changeRouteTitle="changeRouteTitle"
                  @setAppClasses="(classesStr) => $emit('setAppClasses', classesStr)" />
              </transition>
            </div>
          </div>
        </div>
      </div>
      <!-- <TheCustomizer :footerType="footerType" :hideScrollToTop="hideScrollToTop" :navbarType="navbarType" :navbarColor="navbarColor" :routerTransition="routerTransition" /> -->
      <the-footer />
    </div>
  </div>
</template>

<script>
  // import BackToTop           from 'vue-backtotop'
  import navMenuItems from "@/core/config/menus/primary.json"
  import TheNavbarVertical from '@/components/navbar/TheNavbarVertical.vue'
  import TheFooter from '@/components/TheFooter.vue'
  import VNavMenu from '@/components/vertical-nav-menu/VerticalNavMenu.vue'
  import themeConfig from '@/../config/theme.js'
  // import tour from '@/core/tour/index.js'
  export default {
    components: {
      TheFooter,
      TheNavbarVertical,
      VNavMenu
    },
    data() {
      return {
        footerType: themeConfig.footerType || 'static',
        hideScrollToTop: themeConfig.hideScrollToTop,
        isNavbarDark: false,
        navbarColor: themeConfig.navbarColor || '#fff',
        navbarType: themeConfig.navbarType || 'floating',
        // navMenuItems: navMenuItems,
        routerTransition: themeConfig.routerTransition || 'none',
        routeTitle: this.$route.meta.pageTitle
      }
    },
    watch: {
      "$route"() {
        this.routeTitle = this.$route.meta.pageTitle
      },
      isThemeDark(val) {
        const color = this.navbarColor == "#fff" && val ? "#10163a" : "#fff"
        this.updateNavbarColor(color)
      },
      "$store.state.mainLayoutType"(val) {
        this.setNavMenuVisibility(val)
      }
    },
    computed: {
      navMenuItems(){
        let listPermissions = [];
        let vm = this;
        vm.$_.remove(navMenuItems, function (el) {
          let isExist = false;
          if (typeof el.permission != "undefined") {
            for (let index = 0; index < listPermissions.length; index++) {
              const perm = listPermissions[index];
              // console.log(`${perm.model} - ${perm.access.read}`);
              if (perm.model == el.permission && perm.access.read == false) isExist = true;
              
            }
          }
          else if(typeof el.submenu != "undefined"){
            vm.$_.remove(el.submenu, function (el) {
                let isExistSub = false;
                if (typeof el.permission != "undefined") {
                  for (let index = 0; index < listPermissions.length; index++) {
                    const subperm = listPermissions[index];
                    // console.log(`${perm.model} - ${perm.access.read}`);
                    if (subperm.model == el.permission && subperm.access.read == false) isExistSub = true;
                    
                  }
                }
                return isExistSub;
            });
          }
          // console.log(isExist);
          return isExist;
        });
        vm.$_.remove(navMenuItems,function(el){
          if (typeof el.submenu != "undefined" && el.submenu.length == 0 ) return true;
        });
        console.log(navMenuItems);
        return navMenuItems;
      },
      bodyOverlay() { return this.$store.state.bodyOverlay },
      contentAreaClass() {
        if (this.mainLayoutType === "vertical") {
          if (this.verticalNavMenuWidth == "default") return "content-area-reduced"
          else if (this.verticalNavMenuWidth == "reduced") return "content-area-lg"
          else return "content-area-full"
        }
        // else if(this.mainLayoutType === "boxed") return "content-area-reduced"
        else return "content-area-full"
      },
      footerClasses() {
        return {
          'footer-hidden': this.footerType == 'hidden',
          'footer-sticky': this.footerType == 'sticky',
          'footer-static': this.footerType == 'static',
        }
      },
      isAppPage() {
        return this.$route.meta.no_scroll
      },
      isThemeDark() { return this.$store.state.theme == 'dark' },
      layoutTypeClass() { return `main-${this.mainLayoutType}` },
      mainLayoutType() { return this.$store.state.mainLayoutType },
      navbarClasses() {
        return {
          'navbar-hidden': this.navbarType == 'hidden',
          'navbar-sticky': this.navbarType == 'sticky',
          'navbar-static': this.navbarType == 'static',
          'navbar-floating': this.navbarType == 'floating',
        }
      },
      verticalNavMenuWidth() { return this.$store.state.verticalNavMenuWidth },
      windowWidth() { return this.$store.state.windowWidth }
    },
    methods: {
      changeRouteTitle(title) {
        this.routeTitle = title
      },
      updateNavbarColor(val) {
        this.navbarColor = val
        if (val == "#fff") this.isNavbarDark = false
        else this.isNavbarDark = true
      },
      setNavMenuVisibility(layoutType) {
        if ((layoutType === 'horizontal' && this.windowWidth >= 1200) || (layoutType === "vertical" && this.windowWidth < 1200)) {
          this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', false)
          this.$store.dispatch('updateVerticalNavMenuWidth', 'no-nav-menu')
        }
        else {
          this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', true)
        }
      },
      checkConnection(){
        window.addEventListener('offline',()=>{
          console.log('Offline Mode');
        });
        window.addEventListener('online',()=>{
          console.log('Online Mode');
        });
      }
    },
    created() {
      const color = this.navbarColor == "#fff" && this.isThemeDark ? "#10163a" : this.navbarColor
      this.updateNavbarColor(color)
      this.setNavMenuVisibility(this.$store.state.mainLayoutType);
      this.checkConnection();
    },
    mounted() {
      var fakebtn = document.getElementById("fakebtn");
      fakebtn.click();
    },
  }
  
</script>

<style>
  .google_form{
    position: fixed;
    top: 100px;
    right: 0px;
    z-index: 800000;
    border: 2px solid rgb(99, 99, 99);
    background: white;
    transition: 300ms;
    cursor: pointer;
  }
  .google_form:hover{
    background: rgb(242, 242, 242);
  }
</style>
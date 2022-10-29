<template>
  <vs-dropdown vs-trigger-click class="cursor-pointer">
    <span class="cursor-pointer flex items-center i18n-locale mr-4">
      <img class="h-4 w-5" :src="'data:image/png;base64,'+getCurrentLocaleData.flag" :alt="$i18n.locale" />
      <span class="hidden sm:block ml-2">{{ getCurrentLocaleData.lang }}</span>
    </span>
    <vs-dropdown-menu class="md:w-40 w-auto">
      <vs-dropdown-item @click="updateLocale('en')"><img class="h-4 w-5 mr-1" :src="'data:image/png;base64,'+$getFlug('US')" alt="en" /> <span class="hidden md:block">&nbsp;English</span></vs-dropdown-item>
      <vs-dropdown-item @click="updateLocale('fr')"><img class="h-4 w-5 mr-1" :src="'data:image/png;base64,'+$getFlug('FR')" alt="fr" /> <span class="hidden md:block">&nbsp;Français</span></vs-dropdown-item>
      <vs-dropdown-item @click="updateLocale('ar')"><img class="h-4 w-5 mr-1" :src="'data:image/png;base64,'+$getFlug('MA')" alt="ar" /> <span class="hidden md:block">&nbsp;العربية</span></vs-dropdown-item>
    </vs-dropdown-menu>
  </vs-dropdown>
</template>

<script>
export default {
  computed: {
    i18n_locale_img () {
      return require(`@/assets/images/flags/${this.$i18n.locale}.svg`)
    },
    getCurrentLocaleData () {
      const locale = this.$i18n.locale
      if (locale === 'en')      return { flag: this.$getFlug('US'), lang: 'English'    }
      else if (locale === 'fr') return { flag: this.$getFlug('FR'), lang: 'Français'     }
      else if (locale === 'ar') return { flag: this.$getFlug('MA'), lang: 'العربية'     }
    }
  },
  methods: {
    updateLocale (locale) {
      if (locale == 'ar') this.$vs.rtl = true;
      else this.$vs.rtl = false;

      localStorage.setItem('language', locale);
      this.$i18n.locale = locale
    }
  }
}
</script>
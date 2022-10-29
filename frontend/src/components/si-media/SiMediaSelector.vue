<template>
  <div>
    <vs-tabs v-model="indexTap" >
      <vs-tab :label="`Library (${this.selectedImages.length})`" icon-pack="feather" icon="icon-image">
        <form @submit.prevent="getImages" class="my-1">
          <vx-input-group class="mb-base">
            <vs-input type="search" v-model="searchQuery" />
            <template slot="append">
              <div class="append-text btn-addon">
                <vs-button @click.prevent="getImages" iconPack="feather" icon="icon-search" color="primary"></vs-button>
              </div>
            </template>
          </vx-input-group>
        </form>
        <div class="selected-images">
          <vs-divider position="left" v-if="selectedImages.length > 0">
            <h5 class="text-primary">Selected images</h5>
          </vs-divider>
          
          <div style="overflow: auto">
            <div class="flex flex-row-reverse" :style="`width:${selectedImages.length * 130}px`">
              <div  class="container p-2" v-for="(image, key) in selectedImages" :key="key" >
                <img class="image selected" :src="image.src" alt="" @click="unselect(key)">
              </div>
            </div>
          </div>
        </div>
        <div class="library-images">
          <vs-divider position="left"><h5 class="text-primary">Library</h5></vs-divider>
          <div class="flex flex-wrap mb-6">
            <div class="md:w-1/3 w-1/2 mb-1 image-gallery" v-for="(image, key) in images" :key="key" >
              <div class="h-48 w-48 m-auto p-1 relative" >
                <button @click="editImage(key)" type="button" class="btn-edit-image">
                  <i translate="translate" class="material-icons notranslate">create</i>
                </button>
                <img class="image" :src="image.src" alt="" @click="select(key)">
              </div>
            </div>
          </div>
        </div>
      </vs-tab>
      <vs-tab label="Upload" icon-pack="feather" icon="icon-upload">
        <div class="con-upload pb-10">
          <!---->
          <div class="con-img-upload">
            <div v-for="(image, key) in imagesToUpload" :key="key" class="img-upload">
              <button @click="editImage(key)" type="button" class="btn-edit-file">
                <i translate="translate" class="material-icons notranslate">create</i>
              </button>
              <button @click="remove(key)" type="button" class="btn-x-file">
                <i translate="translate" class="material-icons notranslate">clear</i>
              </button>
              <button v-if="!uploading" @click="upload(key)" class="btn-upload-file">
                <i translate="translate" class="material-icons notranslate">cloud_upload</i>
                <span>%</span>
              </button>
              <img :src="image.src" style="max-width: 100%; max-height: none;" />
              <!---->
            </div>
            <div class="con-input-upload" v-if="!uploading">
              <input type="file" @change="previewFiles" multiple />
              <span class="text-input">Upload File</span>
              <span class="input-progress" style="width: 0%;"></span>
              <button type="button" title="Upload" class="btn-upload-all vs-upload--button-upload">
                <i translate="translate" class="material-icons notranslate">cloud_upload</i>
              </button>
            </div>
          </div>
        </div>
      </vs-tab>
    </vs-tabs>
    <div class="upload-footer flex bg-white w-full p-2 justify-end">
      <div class="p-1" >
        <vs-button v-if="indexTap == 1" :disabled="imagesToUpload.length == 0" color="success" @click="uploadAll">Upload All</vs-button>
      </div>
      <div class="p-1" >
        <vs-button :disabled="selectedImages.length == 0" @click="submit">Insert photos</vs-button>
      </div>
    </div>
    <vs-popup :title="'edit image' | t" :active.sync="isPopupActive">
      <div class="container" >
        <div class="flex flex-col" >
          <div class="w-full mb-3 p-0 md:p-2">
            <vs-input v-model="image.title" :label="'title' | t" placeholder="Title ...." class="w-full" />
            <small class="text-danger"></small>
          </div>
          <div class="w-full mb-3 p-0 md:p-2">
            <vs-button class="w-full" color="primary" type="filled" @click="submitEditImage()">confirm</vs-button>
          </div>
        </div>
      </div>
    </vs-popup>
  </div>
</template>
<script>
import VxAutoSuggest from '@/components/vx-auto-suggest/VxAutoSuggest.vue'
export default {
  props: {
      multiple: { required: false, type: Boolean,default:true},
      isActivePopup : { required:false,type: Boolean,default:true }
  },
  components:{
    'vx-auto-suggest': VxAutoSuggest,
  },
  data() {
    return {
        indexTap : 0,
        isPopupActive :false,
        selected: {},
        uploading:false,
        images: [],
        image:{
          title:'',
          src:'',
        },
        imagesToUpload: [],
        formData: {},
        selectedImages: [],
        params:{
          title:null,
        }
    };
  },
  mounted(){
    this.init();
    
  },
  watch: {
    'indexTap':{
      handler(value){
        // console.log('tab index == ',value);
      },
      immediate:true,
    },
    isActivePopup(){
      this.selectedImages = [];
    }
  },
  computed: {
    searchQuery:{
      get: function () {
        return this.params.title;
      },
      set: function (newValue) {
        this.params.title = newValue == '' ? null : newValue;
      }
    }
  },
  methods: {
    clickTab(tab){
      console.log('tab index == ',tab);
    },
    init(){
      this.getImages();
    },
    async getImages(){
      try{
        const response = await this.$http.get("/api/images/search",{
          params: this.params
        });
        this.images = response.data.results;
      }catch(error){
        if(error.response) alert(error.response.data);
      }
    },
    select(key){
      const found = this.selectedImages.find(x=> x._id == this.images[key]._id);
      if(!found){
        if (!this.multiple) this.selectedImages = [];
        this.selectedImages.push(this.images[key]);
      }
    },
    unselect(key){
      this.selectedImages.splice(key, 1);
    },
    previewFiles(e) {
      this.uploading = true;
      const image = e.target;
      
      if (image.files && image.files[0]) {
        image.files.forEach(img => {
          var reader = new FileReader();
          reader.onload = async e => {
            // var index = this.imagesToUpload.indexOf(e.target.result);
            let image = {};
            image.title = '';
            image.src = e.target.result;
            this.imagesToUpload.push(image);
            this.uploading = false;
          };
          reader.readAsDataURL(img);
        });
      } else console.log("No image");
    },
    async upload(key,mutiple = false){
      this.uploading = true;
      try {
          const response = await this.$http.post('/api/images/create', this.imagesToUpload[key] );
          this.images.push(response.data);
          if (!this.multiple) this.selectedImages = [];
          this.selectedImages.push(response.data);
         if (!mutiple) this.imagesToUpload.splice(key, 1);
         else this.imagesToUpload = [];
          this.uploading = false;
      } catch (error) {
        this.uploading = false;
        if (error.response) alert(error.response.data);
      }
    },
    uploadAll(){
      for (let index = 0; index < this.imagesToUpload.length; index++) {
        this.upload(index,true);
      }
    },
    editImage(key){
      if (this.indexTap == 1 || this.indexTap == '1' ) {
        this.image.title = this.imagesToUpload[key].title;
        this.image.key = key;
      }else if (this.indexTap == 0 || this.indexTap == '0'){
        this.image.title = this.images[key].title;
        this.image.key = key;
      }
      this.isPopupActive = true;
    },
    async submitEditImage(){
      if (this.indexTap == 1 || this.indexTap == '1' ) {
        this.imagesToUpload[this.image.key].title = this.image.title;
      }else if (this.indexTap == 0 || this.indexTap == '0'){
        this.images[this.image.key].title = this.image.title;
        let data = {};
        this.images[this.image.key].title = this.image.title;
        data =  this.$_.pick(this.images[this.image.key], ['title', 'src']);
        try {
          const response = await this.$http.post(`/api/images/update?id=${this.images[this.image.key]._id}`, data );
          console.log(response.data);
        } catch (error) {
          console.log(error.response.data);
        }
      }
      this.isPopupActive = false;
      this.image = {};
      
    },
    remove(key){
        this.imagesToUpload.splice(key,1);
    },
    submit(){
      this.$emit("onSelect", this.selectedImages);
    }
  }
};
</script>
<style>
.image{
  display: block;
  border-radius: 5px;
  box-shadow: 0px 0px 0px 1px #00000010;
  cursor: pointer;
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* border: 3px solid #ffffff; */
  transition: 250ms;
}
.image:not(.selected):hover{
  /* border: 3px solid rgba(33, 149, 243, 0.678); */
  box-shadow: 0px 0px 0px 2px rgba(33, 149, 243, 0.678);
}
.image.selected{
  /* border: 3px solid rgba(33, 149, 243, 0.698); */
  box-shadow: 0px 0px 0px 2px rgba(33, 149, 243, 0.698);
}
.image.selected:hover{
  /* border: 3px solid #e90032; */
  box-shadow: 0px 0px 0px 2px  #e90032;
}
.selected-images .container{
  width: 130px;
  height: 130px;
}
.vs-popup{
  position: relative;
}
.upload-footer{
  position: absolute;
  bottom: 0;
  right: 0;
}
.con-img-upload .img-upload .btn-edit-file {
    display: block;
    position: absolute;
    top: 5px;
    left: 5px;
    padding: 0;
    margin: 0;
    -webkit-transform: translate(20%,-20%);
    transform: translate(20%,-20%);
    background: rgb(0 0 0 / 0%);
    z-index: 300;
    opacity: 0;
    border: 0;
    cursor: pointer;
    -webkit-transition: all .2s ease;
    transition: all .2s ease;
    border-radius: 10px;
}
.con-img-upload .img-upload:hover .btn-edit-file {
    opacity: 1;
    -webkit-transform: translate(0);
    transform: translate(0);
}
.con-img-upload .img-upload .btn-edit-file i {
    -webkit-transition: all .2s ease;
    transition: all .2s ease;
    position: relative;
    padding: 4px;
    font-size: 1.4rem;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    border-radius: 5px;
    background: rgb(0 0 0 / 10%);
    color: rgb(255 255 255);
    text-shadow: 0 3px 10px rgba(0,0,0,.5);
}
.con-img-upload .img-upload .btn-edit-file:hover i {
    border-radius: 50%;
    background: rgba(var(--vs-primary),1);
}
.btn-edit-image{
  display: block;
  position: absolute;
  top: 5px;
  left: 5px;
  padding: 0;
  margin: 0;
  -webkit-transform: translate(20%,-20%);
  transform: translate(20%,-20%);
  background: rgb(0 0 0 / 0%);
  z-index: 300;
  opacity: 0;
  border: 0;
  cursor: pointer;
  -webkit-transition: all .2s ease;
  transition: all .2s ease;
  border-radius: 10px;
}
.image-gallery .btn-edit-image i {
    -webkit-transition: all .2s ease;
    transition: all .2s ease;
    position: relative;
    padding: 4px;
    font-size: 1.4rem;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    border-radius: 5px;
    background: rgb(0 0 0 / 10%);
    color: rgb(255 255 255);
    text-shadow: 0 3px 10px rgba(0,0,0,.5);
}
.image-gallery .btn-edit-image:hover i {
    border-radius: 50%;
    background: rgba(var(--vs-primary),1);
}
.image-gallery:hover .btn-edit-image {
    opacity: 1;
    -webkit-transform: translate(0);
    transform: translate(0);
}
</style>
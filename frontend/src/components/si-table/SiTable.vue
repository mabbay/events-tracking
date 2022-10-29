<template>
  <div class="container bg-white rounded shadow p-0" v-on:copyClicked="copyIsClicked">
    <div
      class="flex flex-no-wrap mb-0 justify-between px-5 py-3 border-0 border-b border-solid border-grey-light items-center"
    >
      <h4 class="font-medium">{{ config.title | t }}</h4>
      <div
        v-if="config.filters.isActive && !loadingFilter"
        class="filter_obj hover:shadow-none rounded-full w-10 h-10 cursor-pointer relative flex justify-center items-center"
        @click="config.filters.isOpen = !config.filters.isOpen"
      >
        <div class="filter_icon">
          <feather-icon
            class="filter_icon_item"
            icon="FilterIcon"
            svgClasses="w-4 h-4 cursor-pointer"
          />
        </div>
      </div>
    </div>
    <transition name="filterForm">
      <div
        v-if="config.filters.isActive && !loadingFilter"
        class="w-full bg-white border-0 border-b border-light border-solid mb-5"
        v-show="config.filters.isOpen"
      >
        <!-- <si-form @onSubmit="emitFilter" :elements="config.filters.elements" :buttons="config.filters.buttons" :config="config.filters.config"/> -->
        <si-filter
          @onSubmit="emitFilter"
          :elements="config.filters.elements"
          :config="config.filters.config"
        ></si-filter>
      </div>
    </transition>
    <div class="flex flex-wrap items-center mt-5 px-5">
      <div class="flex-grow">
        <vs-dropdown vs-trigger-click class="cursor-pointer">
          <div
            class="py-3 shadow px-5 rounded-lg cursor-pointer flex items-center justify-between font-medium"
          >
            <span v-if="pagination.current_page" class="mr-2"
              >{{
                pagination.per_page * pagination.current_page -
                (pagination.per_page - 1)
              }}
              - {{ pagination.per_page * pagination.current_page }} /
              {{ pagination.total }}
            </span>
            <span v-else> 0 - 0 / 0 </span>
            <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
          </div>
          <vs-dropdown-menu>
            <vs-dropdown-item
              v-for="size in config.options.pageSizes"
              :key="size"
              @click="$emit('changeSizePage', size)"
            >
              <span>{{ size }}</span>
            </vs-dropdown-item>
          </vs-dropdown-menu>
        </vs-dropdown>
      </div>

      <!-- Actions Dropdown -->
      <div class="flex align-baseline">
        <div v-if="config.options.actions.buttons" class="flex flex-wrap">
          <template v-for="(action, index) in config.options.actions.buttons">
            <vs-button
              :key="index"
              v-if="$hasPermission(action.model, action.access)"
              class="py-2 mr-2"
              @click="emitFunction(action.click)"
              :icon="action.icon"
              :color="action.color"
              :type="action.type || 'filled'"
            >
              <span v-if="windowWidth > 570"> {{ action.text | t }} </span>
            </vs-button>
          </template>
          <div class="w-2 h-2"></div>
        </div>
        <vs-dropdown
          vs-trigger-click
          vs-custom-content
          class="cursor-pointer"
          v-if="config.options.actions && config.options.actions.isActive"
        >
          <div
            class="p-3 shadow rounded-lg cursor-pointer flex items-end justify-center text-lg font-medium"
          >
            <!-- <span class="mr-2 leading-none">{{config.options.actions.name}}</span> -->
            <feather-icon icon="MoreVerticalIcon" svgClasses="h-4 w-4" />
          </div>
          <vs-dropdown-menu>
            <template
              v-for="(action, indexAct) in config.options.actions.elements"
            >
              <vs-dropdown-item
                v-if="$hasPermission(action.model, action.access)"
                :key="indexAct"
                @click="emitFunction(action.click)"
              >
                <span class="flex items-center">
                  <feather-icon
                    :icon="action.icon"
                    svgClasses="h-4 w-4"
                    class="mr-2"
                  />
                  <span class="whitespace-no-wrap">{{ action.text | t }}</span>
                </span>
              </vs-dropdown-item>
            </template>
          </vs-dropdown-menu>
        </vs-dropdown>
      </div>
    </div>
    <div
      class="vs-component vs-con-table vs-table-primary mt-5 px-5 pb-5"
      :class="config.options.classes"
    >
      <div id="div-with-loading" class="w-full vs-con-loading__container">
        <div class="vs-con-tbody vs-table--tbody">
          <table class="vs-table vs-table--tbody-table">
            <thead class="vs-table--thead">
              <tr>
                <th
                  scope="col"
                  v-if="config.options.selected"
                  width="10"
                  class="table_th_select px-3"
                >
                  <vs-checkbox
                    class="m-0"
                    v-model="selectAll"
                    @change="checkAll"
                    color="primary"
                    :size="config.options.selectSize"
                  />
                </th>
                <th
                  v-for="(column, ind) in config.columns"
                  :key="ind"
                  class="text-left"
                  :width="column.width"
                >
                  {{ column.name | t }}
                </th>
                <th
                  v-if="
                    config.actions &&
                    config.actions.elements &&
                    config.actions.elements.length != 0
                  "
                  :width="config.actions.width"
                >
                  {{ config.actions.name | t }}
                </th>
              </tr>
            </thead>
            <tr
              class="tr-values vs-table--tr tr-table-state-null hoverFlat inhover"
              v-for="(row, indextr) in data"
              :key="indextr"
            >
              <th
                class="td vs-table--td table_th_select px-3"
                v-if="config.options.selected"
              >
                <vs-checkbox
                  class="m-0"
                  color="primary"
                  :size="config.options.selectSize"
                  v-model="selectedRow"
                  @change="select"
                  :vs-value="row"
                />
              </th>
              <!-- columns data -->
              <td
                class="td vs-table--td py-1"
                v-for="(col, indexcol) in config.columns"
                :key="indexcol"
              >
                <!-- elements -->
                <div
                  v-for="(element, indElm) in col.elements"
                  :key="indElm"
                  class="flex"
                  :class="col.class"
                >
                  <!-- items -->
                  <div
                    v-for="(item, itemIndex) in element.items"
                    :key="itemIndex"
                    :class="item.class"
                  >
                    <!-- if item is a list -->
                    <div v-if="item.isList" :class="item.class">
                      <component
                        v-for="(entry, i) in row[item.name]" :key="i"
                        :is="getComponent(item.type)"
                        :dataField="{ item: row, field: `${item.name}[${i}]` }"
                        :options="item.options"
                        :reform="item.reform"
                      ></component>
                    </div>
                    <component
                      v-else
                      :is="getComponent(item.type)"
                      :dataField="{ item: row, field: item.name }"
                      :options="item.options"
                      :reform="item.reform"
                    ></component>
                    <!-- item dropdown -->
                    <vs-dropdown
                      v-if="
                        item.dropdown && $hasPermission(item.model, item.access)
                      "
                      vs-trigger-click
                      vs-custom-content
                      class="cursor-pointer"
                    >
                      <div :class="item.dropdown.style">
                        <feather-icon
                          icon="ChevronDownIcon"
                          svgClasses="h-4 w-4"
                        />
                      </div>
                      <vs-dropdown-menu>
                        <vs-dropdown-item
                          v-for="(action, indexAct) in item.dropdown.items"
                          :key="indexAct"
                          @click="
                            emitFunction(item.dropdown.click, {
                              item: row,
                              value: action,
                            })
                          "
                        >
                          <span class="flex items-center">
                            <span class="whitespace-no-wrap">{{
                              action.value
                            }}</span>
                          </span>
                        </vs-dropdown-item>
                      </vs-dropdown-menu>
                    </vs-dropdown>
                  </div>
                </div>
              </td>
              <td
                class="td vs-table--td py-1"
                v-if="
                  config.actions &&
                  config.actions.elements &&
                  config.actions.elements.length != 0
                "
              >
                <vs-row vs-align="center" class="flex-no-wrap justify-center">
                  <template v-for="(action, ind) in config.actions.elements">
                    <vx-tooltip
                      v-if="$hasPermission(action.model, action.access)"
                      :key="ind"
                      class="mr-4"
                      :text="action.tooltip | t"
                    >
                      <feather-icon
                        @click="emitFunction(action.click, row)"
                        :icon="action.icon"
                        :svgClasses="generateActionClass(action.color)"
                      />
                    </vx-tooltip>
                  </template>
                </vs-row>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="mt-5" v-if="queryparam.limit < pagination.total">
        <vs-pagination
          @change="changePaginate()"
          :total="pagination.last_page"
          v-model="currenPage"
          :max="windowWidth > 570 ? 9 : 5"
        ></vs-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import SiText from "./components/SiText";
import SiLink from "./components/SiLink";
import SiAvatar from "./components/SiAvatar";
import SiChip from "./components/SiChip";
import SiIcon from "./components/SiIcon";
import SiImage from "./components/SiImage";
export default {
  name: "si-table",
  components: {
    "si-text": SiText,
    "si-link": SiLink,
    "si-avatar": SiAvatar,
    "si-chip": SiChip,
    "si-icon": SiIcon,
    "si-image": SiImage,
  },
  props: {
    config: { required: true, type: Object },
    data: { required: true },
    selected: { required: false },
    loading: { required: false },
    pagination: { required: true },
    loadingFilter: { required: false, default: false },
    queryparam: {
      required: false,
      default() {
        return { limit: 10, page: 1 };
      },
    },
  },
  data() {
    return {
      filter: {
        isOpen: false,
      },
      selectedRow: [],
      selectAll: false,
      ischangepaginate: false,
      // currenPage: 1,
    };
  },
  watch: {
    selectedRow: function (val) {
      this.$emit("selected", val);
    },
    loading: function (val) {
      if (val) {
        this.selectedRow = [];
        this.$vs.loading({
          container: "#div-with-loading",
          scale: 0.6,
        });
      } else {
        this.$vs.loading.close("#div-with-loading > .con-vs-loading");
      }
    },
  },
  computed: {
    windowWidth() {
      return this.$store.state.windowWidth;
    },
    currenPage: {
      get: function () {
        console.log("CHANGE currenPage");
        return this.queryparam.page ? parseInt(this.queryparam.page) : 1;
      },
      set: function (newValue) {
        console.log("SET currenPage");
        if (this.ischangepaginate) {
          this.$emit("paginate", newValue);
          this.ischangepaginate = false;
        }
      },
    },
  },
  mounted() {},
  methods: {
    changePaginate() {
      console.log("CHANGE PAGINATE");
      this.ischangepaginate = true;
    },
    generateActionClass(color) {
      return `w-5 h-5 cursor-pointer hover:text-${color}`;
    },
    getComponent(type) {
      return `si-${type}`;
    },
    getDataField(obj, key) {
      return this.$_.get(obj, key);
      // return obj[key];
    },
    select() {
      // console.log(this.selectedRow);
    },
    checkAll() {
      this.selectedRow = [];
      console.log(this.data);
      if (this.selectAll && this.data)
        this.data.forEach((element) => {
          this.selectedRow.push(element);
        });
    },
    emitFunction(action, obj = null) {
      let isExist;
      this.$emit("actions", { action, obj }, (x) => (isExist = x));
      // if isExist set to false and action exists in this cmp
      if (!isExist && typeof this[action] == "function") {
        this[action](obj);
      }
    },
    emitFilter(data) {
      // console.log('--fd', data);
      this.emitFunction("onFilter", data);
    },
    async delete(obj, options = { confirmed: false }) {
      if (!options.confirmed) {
        this.$vs.dialog({
          type: "confirm",
          color: "danger",
          title: this.$t("confirm_delete"),
          text: this.$t("confirm_delete_item"),
          accept: () => {
            this.delete(obj, { confirmed: true });
          },
        });
      } else {
        try {
          await this.$store.dispatch(this.config.state.delete, obj._id);
          this.$vs.notify({
            title: this.$t("success"),
            text: this.$t("deleted_successfuly"),
            color: "success",
            position: "bottom-center",
            iconPack: "feather",
            icon: "icon-check",
          });
          // this.getData();
          // this.emitFunction('getData');
        } catch (error) {
          console.log(error);
          let message_error = this.$t("error_deleting");
          // if (typeof error.response.data == "string") message_error = error.response.data;
          this.$vs.notify({
            title: "Error",
            text: message_error,
            color: "danger",
            position: "bottom-center",
            iconPack: "feather",
            icon: "icon-alert-circle",
          });
        }
      }
    },
    copyIsClicked(trackId) {
      console.log(trackId);
    },
  },
};
</script>
<style>
.filter_icon {
  position: absolute !important;
  line-height: 0 !important;
}
.filter_obj {
  /* background-color: rgba(0, 0, 0, 0.1); */
  background: rgba(var(--vs-primary), 0.1);
  /* color : rgba(var(--vs-primary),1); */
  transition: 300ms;
}
.filter_obj:hover {
  /* background-color: rgba(0, 0, 0, 0.193); */
  background: rgba(var(--vs-primary), 0.2);
}
.filter_icon_item {
  color: rgba(var(--vs-primary), 0.5);
  transition: 300ms;
}
.filter_obj:hover .filter_icon_item {
  color: rgba(var(--vs-primary), 0.8);
}
.inhover {
  box-shadow: inset 0px 0px 0px 0px #5c96fc;
  transition: 100ms !important;
}
.inhover:hover {
  box-shadow: inset 3px 0px 0px 0px #5c96fc;
}
</style>
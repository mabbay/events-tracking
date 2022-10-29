import events from './events';

export default {
  list: {
    title: "Elements",
    options: {
      defaultPageSize: 10,
      classes: "stripe",
      selected: true,
      selectSize: "medium",
      pageSizes: [10, 20, 30],
      actions: {
        isActive: true,
        name: "Actions",
        buttons: [
          {
            text: "create element",
            icon: "add",
            click: 'add', // onClick
            color: 'primary',
            model: "elements",
            access: "create"
          }
        ],
        elements: [
          {
            text: "refresh",
            icon: "RefreshCcwIcon",
            click: 'refresh', // onClick
          },
        ]
      }
    },
    columns: [
      {
        name: "Label",
        class: "items-center w-100 py-1",
        elements: [
          {
            items: [
              {
                class: "",
                name: "label",
                type: "text",
                options: {
                  style: "text-primary font-semibold whitespace-no-wrap",
                },

              },
            ],
          },
        ]
      },
      {
        name: "Creation Date",
        class: "items-center w-100 py-1",
        elements: [
          {
            items: [
              {
                class: "",
                name: "creationDate",
                type: "text",
                options: {
                  style: "text-primary font-semibold whitespace-no-wrap",
                },
                reform: function (value) {
                  const date = this.$moment(value.creationDate).format('YYYY-MM-DD hh:mm');
                  return date;
                }
              },
            ],
          },
        ]
      },
      {
        name: "Events",
        elements: [
          {
            items: [
              {
                class: "w-auto flex flex-wrap",
                name: "events",
                isList: true,
                type: "chip",
                options: {
                  style: "text-secondary font-semibold text-sm",
                }
              },
            ],
          },
        ]
      },
    ],
    actions: {
      name: "Actions",
      width: "10px",
      elements: [
        {
          text: "update",
          color: "success",
          icon: "EditIcon",
          click: 'edit',
          tooltip: "update",
          model: "elements",
          access: "update"
        },
        {
          text: "delete",
          color: "danger",
          icon: "Trash2Icon",
          click: 'delete',
          tooltip: "delete",
          model: "elements",
          access: "delete"
        },
        {
          text: "view",
          color: "sucess",
          icon: "ViewIcon",
          click: 'view',
          tooltip: "view",
          model: "elements",
          access: "delete"
        }
      ],
    },
    filters: {
      name: 'Filter',
      isActive: true,
      isOpen: false,
      config: {
        class: "vx-row p-3",
        ref: "filter-list",
        inputStyle: "label-top", // horizontal | label-top | prepend
        buttons: {
          justify: "start" //start || center || end
        }
      },
      elements: {
        label: {
          options: {
            icon: "search",
            label: "Label",
            inputClass: "w-full ",
            groupClass: "vx-col md:w-1/3 w-full p-1",
            hint: "Element Label",
          },
          value: null,
          type: "input",
          validate: {
            trim: true,
            required: false,
            minlength: 0,
            // reg_match:{
            //     regex : /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            //     message:'Incorrect ...',
            // } 
            // email:true,
          }
        },
        events: {
          options: {
            inputType: "select",
            label: "Events",
            multiple: true,
            inputClass: "w-full",
            groupClass: "vx-col md:w-1/3 w-full p-1",
            hint: 'select events ...',
            clearable: true,
          },
          type: "select",
          value: '',
          values: events.map(ev => ({ 'id': ev, 'name': ev })),
          validate: {
            trim: true,
          }
        },
        // date: {
        //   options: {
        //     inputType: "select",
        //     label: "Date",
        //     inputClass: "w-full",
        //     groupClass: "vx-col md:w-1/3 w-full p-1",
        //     hint: {
        //       from: "start",
        //       to: "end"
        //     }
        //   },
        //   type: "start-end-date",
        //   value: {
        //     from: null,
        //     to: null
        //   },
        //   values: [
        //     { id: "1", name: "Souss Massa" },
        //     { id: "2", name: "Casablanca" }
        //   ],
        //   validate: {
        //   }
        // },
      },
    },
  },
  form: {
    config: {
      class: "vx-row",
      buttons: {
        justify: "start" //start || center || end
      }
    },
    elements: {
    },
    buttons: [
      {
        text: "submit",
        action: "submit",
        class: "mr-3 mb-2",
        type: "filled",
        color: "danger",
        iconPack: "feather",
        icon: "icon-check-square",
      },
      {
        class: "mr-3 mb-2",
        text: "Reset",
        type: "border",
        action: "reset",
        iconPack: "feather",
        icon: "icon-x",
        color: "warning",
        textColor: "#EA5455"
      },
      {
        class: "mr-3 mb-2",
        iconPack: "feather",
        icon: "icon-check",
        radius: true
      },
      {
        iconPack: "feather",
        icon: "icon-check",
        radius: true
      }
    ],
    create: {
      title: "create_collection",
      elements: [],
      buttons: []
    },
    update: {
      title: "update_collection",
      elements: [],
      buttons: []
    }
  }
}
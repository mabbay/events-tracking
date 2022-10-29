export default {
    list: {
        title: "Websites",
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
                        text: "New Website",
                        icon: "add",
                        click: 'add',
                        color: 'primary',
                        model: "users",
                        access: "create"
                    }
                ],
                elements: [
                    {
                        text: "refresh",
                        icon: "RefreshCcwIcon",
                        click: 'refresh',
                    },
                ]
            }
        },
        columns: [
            {
                name: "domain",
                class: "items-center w-100 py-1",
                width: "auto",
                elements: [
                    {
                        items: [
                            {
                                class: "",
                                name: "domain",
                                type: "text",
                                options: {
                                    style: "text-primary font-semibold whitespace-no-wrap",
                                },
                                // reform: (value) => {
                                //     return escape(`${value.firstname} ${value.lastname}`);
                                // },
                            },
                        ],
                    },
                ]
            }
        ],
        actions: {
            name: "action",
            width: "10px",
            elements: [
                {
                    text: "copy script",
                    color: "primary",
                    icon: "CopyIcon",
                    click: 'copy',
                    tooltip: "copy tracking script",
                    model: "websites",
                    access: "copy"
                },
                {
                    text: "update",
                    color: "success",
                    icon: "EditIcon",
                    click: 'edit',
                    tooltip: "update",
                    model: "websites",
                    access: "update"
                },
                {
                    text: "delete",
                    color: "danger",
                    icon: "Trash2Icon",
                    click: 'delete',
                    tooltip: "delete",
                    model: "websites",
                    access: "delete"
                }
            ],
        },
        filters: {
            name: 'Filter',
            isActive: false,
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
                search: {
                    options: {
                        icon: "search",
                        label: "Search",
                        inputClass: "w-full ",
                        groupClass: "vx-col md:w-1/3 w-full p-1",
                        hint: "Name, Phone, Region, City ...",
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
                status: {
                    options: {
                        inputType: "select",
                        label: "Status",
                        multiple: false,
                        inputClass: "w-full",
                        groupClass: "vx-col md:w-1/3 w-full p-1",
                        hint: 'select status ...',
                        clearable: true,
                    },
                    type: "select",
                    value: '',
                    values: [
                        { id: "1", name: "Souss Massa" },
                        { id: "2", name: "Casablanca" }
                    ],
                    validate: {
                        trim: true,
                    }
                },
                date: {
                    options: {
                        inputType: "select",
                        label: "Date",
                        inputClass: "w-full",
                        groupClass: "vx-col md:w-1/3 w-full p-1",
                        hint: {
                            from: "start",
                            to: "end"
                        }
                    },
                    type: "start-end-date",
                    value: {
                        from: null,
                        to: null
                    },
                    values: [
                        { id: "1", name: "Souss Massa" },
                        { id: "2", name: "Casablanca" }
                    ],
                    validate: {
                    }
                },
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
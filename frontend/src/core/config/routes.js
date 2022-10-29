import auth from '@/core/middleware/auth';
import isFirst from '@/core/middleware/isFirst';
import guest from '@/core/middleware/guest';

//! middlware meta data need to be an array

const routes = [
    {
        path: '/',
        component: () => import('@/layouts/main/Main.vue'),
        meta: { middleware: [auth] },
        children: [
            {
                path: "",
                name: "dashboard",
                component: () => import(`@/views/modules/dashboard/index.vue`),
                meta: {
                    pageTitle: "Dashboard"
                }
            },
            {
                path: 'elements',
                name: 'elements',
                component: () => import('@/views/modules/elements/index.vue'),
                meta: {
                    pageTitle: "Elements",

                }
            },
            {
                path: 'websites',
                name: 'websites',
                component: () => import('@/views/modules/websites/index.vue'),
                meta: {
                    pageTitle: "Websites",

                }
            },
            {
                path: "users",
                name: "users_list",
                component: () => import(`@/views/modules/users/index.vue`),
                meta: {
                    pageTitle: "Users",

                }
            },
            {
                path: "/elements/create",
                name: "elements-create",
                component: () => import(`@/views/modules/elements/form.vue`),
                meta: {
                    pageTitle: "Create New Element  ",

                }
            },
            {
                path: "/elements/update/:elementId",
                name: "elements-update",
                component: () => import(`@/views/modules/elements/form.vue`),
                meta: {
                    pageTitle: "Update Element",

                },
                props: true
            },
            {
                path: "/users/create",
                name: "users-create",
                component: () => import(`@/views/modules/users/form.vue`),
                meta: {
                    pageTitle: "Create New User",

                }
            },
            {
                path: "/users/update/:userId",
                name: "users-update",
                component: () => import(`@/views/modules/users/form.vue`),
                meta: {
                    pageTitle: "Update User",

                },
                props: true
            },
            {
                path: "/statistics",
                name: "statistics",
                component: () => import(`@/views/modules/statistics/index.vue`),
                meta: {
                    pageTitle: "Statistics",
                }
            },
            {
                path: "roles",
                name: "roles",
                component: () => import(`@/views/modules/users/roles/index.vue`),
                meta: {
                    pageTitle: "Roles",

                }
            },
            {
                path: "/roles/create",
                name: "roles-create",
                component: () => import(`@/views/modules/users/roles/form.vue`),
                meta: {
                    pageTitle: "Create New Role",

                }
            },
            {
                path: "/roles/update/:roleId",
                name: "roles-update",
                component: () => import(`@/views/modules/users/roles/form.vue`),
                meta: {
                    pageTitle: "Update Role",

                },
                props: true
            },
        ]
    },
    {
        path: "/login",
        name: "login",
        component: () => import('@/views/public/Login.vue')
    },
    {
        path: '/signup',
        name: 'signup',
        component: () => import('@/views/public/Signup.vue')
    },
    // {
    //     path: "",
    //     component: () => import('@/layouts/public/FullPage.vue'),
    //     children: [
    //         {
    //             path: "/error-404",
    //             name: "page-error-404",
    //             component: () => import(`@/views/public/Error404.vue`),
    //         }
    //     ]
    // },
    {
        path: '*',
        component: () => import(`@/views/public/Error404.vue`),
    }
];

export default routes
const arrayTrans = [
    'global', 'errors', 'products', 'orders',
    'customers', 'dashboard', 'stock',
    'collections', 'suppliers',
    'discounts', 'upsells', 'analytics',
    'themes', "medias", "menus",
    'pages', 'posts', 'categories',
    "shippers", "zones", "locations",
    "invoices", "apps", "settings",
    "orders_status", "users", "users_roles", "languages_currencies"
];
let trans = {};
for (const key in arrayTrans) {
    let data = require(`./data/${arrayTrans[key]}.json`);
    if (arrayTrans[key] == 'global' || arrayTrans[key] == 'errors') {
        trans = { ...data, ...trans };
    } else {
        for (const key1 in data) {
            trans[arrayTrans[key] + '_' + key1] = data[key1];
        }
    }
}
// console.log(trans);
export default trans;
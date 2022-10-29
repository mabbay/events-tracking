module.exports = class Request {
    constructor(httpRequest) {
        this.options = {};
        this.filters = {};
        this.id = httpRequest.query.id;
        this.query = httpRequest.query;
        this.body = httpRequest.body;
        this.params = httpRequest.params;
        this.session = httpRequest.session ? httpRequest.session : {};
        this.headers = {
            'Referer': httpRequest.get('referer'),
            'x-auth-token': httpRequest.get('x-auth-token'),
            'Content-Type': httpRequest.get('Content-Type'),
            'Access-Control-Allow-Origin': httpRequest.get('Access-Control-Allow-Origin'),
        }
        this.mongoRequest();
    }
    mongoRequest() {
        // queryEntries = [..., [key, value], ...]
        const queryEntries = this.query ? Object.entries(this.query) : [];
        if (queryEntries.length === 0) return {};
        // added 'populate'
        const options = ['page', 'sort', 'limit', 'lang', 'populate'];
        const filters = ['from', 'to', 'eq', 'ne', 'in', 'nin', 'contains'];
        const filtredQuery = queryEntries.reduce((prev, curr) => {
            let [key, val] = curr;
            if (key.indexOf('-') > -1) { // key: field-filter
                let [field, filter] = key.split('-');
                if (filters.indexOf(filter) === -1) return prev;
                if (field === 'id') field = '_id';
                filter = this.mongoFormatFilters(filter);
                if (prev.filters[field]) {
                    prev.filters[field][`$${filter}`] = val;
                    if (filter == 'regex') prev.filters[field]['$options'] = "si";
                } else {
                    prev.filters[field] = { [`$${filter}`]: val };
                    if (filter == 'regex') prev.filters[field]['$options'] = "si";
                }
            } else if (options.indexOf(key) > -1) {
                prev.options[key] = val;
            } else {
                if (key === 'id') key = '_id';
                prev.filters[key] = val;
            }
            return prev;
        }, { options: {}, filters: {} });
        this.options = filtredQuery.options;
        this.filters = filtredQuery.filters;
    }
    mongoFormatFilters(filter) {
        switch (filter) {
            case 'from': return 'gte';
            case 'to': return 'lte';
            case 'contains': return 'regex';
            default: return filter;
        }
    }
}

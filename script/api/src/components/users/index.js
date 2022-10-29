module.exports = class Controller extends Core.Controller {
    constructor() {
        super('users');
    }

    async signup(req) {
        // validate user
        const { error } = new this.Validation(req.body);
        if (error) return super.send(error.details[0].message, 400);
        // create company
        let response = await (new Components.companies.Controller()).create(req);
        if (response.getStatus() != 200) return response;
        const { content: company } = response;
        // create user
        req.body.company = company._id;
        req.body.isAdmin = true; // when a user sign up, he is an admin
        const user = await this.Repository.create(req.body);
        if (user.errors) { company.remove(); return this.send(user.message, 400); }
        return super.send(user, 200, user.tokens());
    }

    async login(req) {
        const { email, password } = req.body;
        req.filters = { email };
        // req.options.populate = 'role'; // get the role of the user in the response body
        const response = await super.get(req);
        if (response.getStatus() != 200) {
            response.setContent('invalid email and/or password'); return response;
        }
        const { content: user } = response;
        const match = await Utils.bcrypt.compare(password, user.password);
        if (!match) return super.send('invalid email and/or password', 404);
        response.setHeaders(user.tokens());
        return response;
    }
    // create another user
    invite(req) {
        return super.create(req);
    }
    // get the current user
    me(req) {
        // should be here, because /me passes auth middleware only
        req.filters._id = req.session.user._id;
        return super.get(req);
    }

    async update(req) {
        // hash password on update
        const { password } = req.body;
        if (password) req.body.password = await Utils.functions.hash(password);
        return super.update(req);
    }
}
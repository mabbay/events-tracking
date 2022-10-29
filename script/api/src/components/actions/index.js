module.exports = class Controller extends Core.Controller {
    constructor() {
        super('actions');
    }

    // TODO add origin verification (now we can't, we will do it once it's deployed)
    async create(req) {
        // validate data
        const { schema: actionSchema, Joi } = new Components.actions.Validation;
        const schema = Joi.array().items(actionSchema);
        const actions = req.body.actions;
        const { error } = schema.validate(actions);
        if (error) return new Response('invalid data', 400);
        // for each action: set company-id
        const elementsController = new Components.elements.Controller;
        for (const action of actions) {
            const response = await elementsController.get({ filters: { _id: action.element } });
            if (response.getStatus() === 404) action.isSpam = true; // element not found
            if (response.getStatus() === 200) {
                const element = response.content;
                action.company = element.company;
            }
            else return new Response('internal error', 500);
        };
        // store data
        const res = await (new Core.Repository(this.Model)).bulkCreate(actions);
        if (res.errors) return new Response('internal error', 500);
        return new Response();
    }
}